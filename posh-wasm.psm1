#requires -Version 5.1

# posh-wasm - render a quill to PDF/SVG/PNG from PowerShell, fully offline, with
# no Node at runtime. A WebView2 control hosted by PowerShell loads the bundled
# @quillmark/wasm build (dist/) and does the actual render; PowerShell ships the
# quill in as a path->base64 tree and gets artifact bytes back.
#
# See TASK.md for the architecture and the preflight findings this implements.

$script:ModuleRoot = $PSScriptRoot
$script:DistPath   = Join-Path $script:ModuleRoot 'dist'

# --------------------------------------------------------------------------
# Private helpers
# --------------------------------------------------------------------------

function Resolve-WebView2Loader {
    # Returns the full path to the WebView2Loader.dll matching the current
    # process architecture. The native loader must be loadable before
    # CoreWebView2Environment.CreateAsync, or it throws DllNotFoundException.
    [CmdletBinding()]
    param()

    try {
        $arch = [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture.ToString()
    } catch {
        $arch = if ([Environment]::Is64BitProcess) { 'X64' } else { 'X86' }
    }

    $sub = switch ($arch) {
        'X64'   { 'win-x64' }
        'X86'   { 'win-x86' }
        'Arm64' { 'win-arm64' }
        default { throw "Unsupported process architecture '$arch'. posh-wasm ships loaders for x64, x86, and arm64." }
    }

    $path = Join-Path (Join-Path $script:ModuleRoot 'native') (Join-Path $sub 'WebView2Loader.dll')
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Native WebView2 loader not found for $sub at: $path"
    }
    (Resolve-Path -LiteralPath $path).Path
}

function Get-QuillTree {
    # Walk a quill directory and build an ordered hashtable of
    # "<relative/path>" -> base64(content) for every file. Keys use forward
    # slashes from the quill ROOT (the version dir), which is what
    # Quill.fromTree expects. Every file is included (packages/, fonts, assets).
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$QuillPath)

    if (-not (Test-Path -LiteralPath $QuillPath -PathType Container)) {
        throw "QuillPath is not an existing directory: $QuillPath"
    }
    $root = (Resolve-Path -LiteralPath $QuillPath).Path

    $tree = [ordered]@{}
    $files = Get-ChildItem -LiteralPath $root -Recurse -File -Force
    foreach ($f in $files) {
        $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
        $tree[$rel] = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
    }
    if ($tree.Count -eq 0) {
        throw "No files found under QuillPath: $root"
    }
    $tree
}

# The actual WebView2 host + render roundtrip. Defined as a string so it can be
# run either inline (when the host thread is already STA) or inside a dedicated
# STA runspace (when the host is MTA, e.g. PowerShell 7's default). It returns a
# hashtable: @{ ok = $bool; result = <obj>; error = <string>; diagnostics = <array> }.
$script:RenderCoreText = @'
param(
    [Parameter(Mandatory)] [string]    $ModuleRoot,
    [Parameter(Mandatory)] [string]    $DistPath,
    [Parameter(Mandatory)] [string]    $LoaderPath,
    [Parameter(Mandatory)] [hashtable] $Tree,
    [Parameter(Mandatory)] [string]    $Format,
    [AllowNull()]          [string]    $Markdown,
    [int] $TimeoutSeconds = 120
)

$ErrorActionPreference = 'Stop'

# Pre-load the architecture-correct native loader by full path. Once it is in
# the process, the managed SDK's DllImport("WebView2Loader.dll") resolves to it
# by module name regardless of the current directory.
if (-not ('PoshWasm.Native' -as [type])) {
    Add-Type -Namespace PoshWasm -Name Native -MemberDefinition @"
[System.Runtime.InteropServices.DllImport("kernel32", SetLastError = true, CharSet = System.Runtime.InteropServices.CharSet.Unicode)]
public static extern System.IntPtr LoadLibrary(string lpFileName);
"@
}
$h = [PoshWasm.Native]::LoadLibrary($LoaderPath)
if ($h -eq [IntPtr]::Zero) {
    return @{ ok = $false; error = "Failed to load native WebView2Loader.dll from $LoaderPath (LastError=$([Runtime.InteropServices.Marshal]::GetLastWin32Error()))" }
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -Path (Join-Path $ModuleRoot 'Microsoft.Web.WebView2.Core.dll')
Add-Type -Path (Join-Path $ModuleRoot 'Microsoft.Web.WebView2.WinForms.dll')

# Everything an event handler reads must live on $script: scope: PS event
# scriptblocks do NOT close over their defining scope's locals.
$script:runtimeHelp = "WebView2 Runtime not found. Install the Microsoft Edge WebView2 Runtime (Evergreen bootstrapper) from https://developer.microsoft.com/microsoft-edge/webview2/ and retry."

$script:dist = (Resolve-Path -LiteralPath $DistPath).Path
$udf  = Join-Path $env:TEMP ("posh-wasm-wv2-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $udf | Out-Null

$script:rResult = $null
$script:rError  = $null
$script:rDiag   = $null
$script:rDone   = $false

$form = New-Object System.Windows.Forms.Form
$script:wv = New-Object Microsoft.Web.WebView2.WinForms.WebView2
$script:wv.Dock = 'Fill'
$form.Controls.Add($script:wv)

# Stash the request payload on script scope (same reason as above).
$script:reqTree   = $Tree
$script:reqFormat = $Format
$script:reqMd     = $Markdown

$script:envTask = [Microsoft.Web.WebView2.Core.CoreWebView2Environment]::CreateAsync($null, $udf, $null)

$script:wv.add_CoreWebView2InitializationCompleted({
    param($s, $e)
    try {
        if (-not $e.IsSuccess) {
            $script:rError = "WebView2 init failed: " + $e.InitializationException.ToString()
            $script:rDone = $true
            return
        }
        $core = $s.CoreWebView2
        $core.SetVirtualHostNameToFolderMapping(
            'posh-wasm.local', $script:dist,
            [Microsoft.Web.WebView2.Core.CoreWebView2HostResourceAccessKind]::Allow)

        $core.add_WebMessageReceived({
            param($s2, $e2)
            try {
                $msg = $e2.TryGetWebMessageAsString()
                $obj = $msg | ConvertFrom-Json
                if ($obj.type -eq 'ready') {
                    $opts = @{ format = $script:reqFormat }
                    if (-not [string]::IsNullOrEmpty($script:reqMd)) { $opts.markdown = $script:reqMd }
                    $req = @{ id = 1; tree = $script:reqTree; opts = $opts } | ConvertTo-Json -Depth 8 -Compress
                    $s2.PostWebMessageAsJson($req)
                }
                elseif ($obj.type -eq 'error') {
                    $script:rError = [string]$obj.error
                    $script:rDone  = $true
                }
                elseif ($obj.type -eq 'dbg') {
                    # progress only
                }
                else {
                    if ($obj.ok) {
                        $script:rResult = $obj.result
                    } else {
                        $script:rError = [string]$obj.error
                        $script:rDiag  = $obj.diagnostics
                    }
                    $script:rDone = $true
                }
            } catch {
                $script:rError = "host message handler error: " + $_.Exception.Message
                $script:rDone  = $true
            }
        })

        $core.Navigate('https://posh-wasm.local/index.html')
    } catch {
        $script:rError = "init handler error: " + $_.Exception.Message
        $script:rDone  = $true
    }
})

$form.Add_Shown({
    try {
        while (-not $script:envTask.IsCompleted) {
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 20
        }
        if ($script:envTask.IsFaulted) {
            $exText = $script:envTask.Exception.ToString()
            if ($exText -match 'WebView2|DllNotFound|loader|runtime') {
                $script:rError = $script:runtimeHelp + " (underlying: " + $exText + ")"
            } else {
                $script:rError = "CreateAsync faulted: " + $exText
            }
            $script:rDone = $true
            return
        }
        $script:wv.EnsureCoreWebView2Async($script:envTask.Result) | Out-Null
    } catch {
        $script:rError = "shown handler error: " + $_.Exception.Message
        $script:rDone  = $true
    }
})

$form.Show()
$form.Visible = $false

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while (-not $script:rDone -and (Get-Date) -lt $deadline) {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 25
}

try { $form.Close() } catch {}
try { $script:wv.Dispose() } catch {}
try { $form.Dispose() } catch {}
try { Remove-Item -Recurse -Force -LiteralPath $udf -ErrorAction SilentlyContinue } catch {}

if ($script:rError)  { return @{ ok = $false; error = $script:rError; diagnostics = $script:rDiag } }
if (-not $script:rDone) { return @{ ok = $false; error = "Render timed out after $TimeoutSeconds s (the WebView2 page never replied)." } }
if (-not $script:rResult) { return @{ ok = $false; error = "Render produced no result." } }
return @{ ok = $true; result = $script:rResult }
'@

function Invoke-RenderCore {
    [CmdletBinding()]
    param([Parameter(Mandatory)][hashtable]$Params)

    $apartment = [Threading.Thread]::CurrentThread.GetApartmentState()
    if ($apartment -eq [Threading.ApartmentState]::STA) {
        # Proven path: run inline on the host's STA thread (Windows PowerShell
        # console default).
        $core = [scriptblock]::Create($script:RenderCoreText)
        return (& $core @Params)
    }

    # MTA host (e.g. PowerShell 7): run the WinForms/WebView2 pump on a dedicated
    # STA runspace and marshal the result hashtable back.
    Write-Verbose "Host thread is $apartment; running render on a dedicated STA runspace."
    $rs = [runspacefactory]::CreateRunspace()
    $rs.ApartmentState = [Threading.ApartmentState]::STA
    $rs.ThreadOptions  = [System.Management.Automation.Runspaces.PSThreadOptions]::ReuseThread
    $rs.Open()
    try {
        $ps = [powershell]::Create()
        $ps.Runspace = $rs
        [void]$ps.AddScript($script:RenderCoreText).AddParameters($Params)
        $out = $ps.Invoke()
        if ($ps.Streams.Error.Count -gt 0) {
            $msgs = ($ps.Streams.Error | ForEach-Object { $_.ToString() }) -join '; '
            return @{ ok = $false; error = "STA runspace error: $msgs" }
        }
        $ps.Dispose()
        if ($out.Count -gt 0) { return $out[$out.Count - 1] }
        return @{ ok = $false; error = "STA runspace returned no result." }
    } finally {
        $rs.Close()
        $rs.Dispose()
    }
}

# --------------------------------------------------------------------------
# Public cmdlet
# --------------------------------------------------------------------------

function Invoke-QuillRender {
    <#
    .SYNOPSIS
        Render a quill to a PDF (or SVG/PNG) using @quillmark/wasm, fully offline.

    .DESCRIPTION
        Loads a quill directory from disk, hosts the bundled WebAssembly build of
        @quillmark/wasm inside a WebView2 control, renders the quill, and writes
        the resulting artifact(s) to disk. No Node.js and no network are used at
        runtime - only the Microsoft Edge WebView2 Runtime, which ships with
        modern Windows.

        A quill is a directory <name>/<version>/ containing Quill.yaml, a glue
        template (e.g. plate.typ), and any assets/packages. Pass the version
        directory as -QuillPath.

    .PARAMETER QuillPath
        Path to the quill version directory (the folder containing Quill.yaml).

    .PARAMETER OutputPath
        Path of the output file. For PDF this is the file written directly. When a
        format yields multiple artifacts (SVG/PNG can emit one per page) the files
        are written as <base>-1.<ext>, <base>-2.<ext>, ... next to OutputPath.

    .PARAMETER Format
        Output format: pdf (default), svg, or png.

    .PARAMETER Markdown
        Markdown document content to render. If omitted (and -MarkdownPath is not
        given), the quill's seeded starter document is used.

    .PARAMETER MarkdownPath
        Path to a markdown file to render. Mutually exclusive with -Markdown.

    .PARAMETER TimeoutSeconds
        Maximum time to wait for the render. Default 120.

    .EXAMPLE
        Invoke-QuillRender -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf

    .EXAMPLE
        Invoke-QuillRender -QuillPath .\taro\0.1.0 -OutputPath .\out.svg -Format svg -MarkdownPath .\doc.md
    #>
    [CmdletBinding()]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Mandatory, Position = 0)]
        [ValidateNotNullOrEmpty()]
        [string]$QuillPath,

        [Parameter(Mandatory, Position = 1)]
        [ValidateNotNullOrEmpty()]
        [string]$OutputPath,

        [ValidateSet('pdf', 'svg', 'png')]
        [string]$Format = 'pdf',

        [string]$Markdown,

        [string]$MarkdownPath,

        [ValidateRange(1, 3600)]
        [int]$TimeoutSeconds = 120
    )

    if ($PSBoundParameters.ContainsKey('Markdown') -and $PSBoundParameters.ContainsKey('MarkdownPath')) {
        throw "Specify only one of -Markdown or -MarkdownPath."
    }

    if (-not (Test-Path -LiteralPath $script:DistPath -PathType Container)) {
        throw "Bundled web assets not found at '$script:DistPath'. The module's dist/ folder is missing - rebuild it with: (cd web; npm install; npx vite build)."
    }

    $mdContent = $null
    if ($PSBoundParameters.ContainsKey('MarkdownPath')) {
        if (-not (Test-Path -LiteralPath $MarkdownPath -PathType Leaf)) {
            throw "MarkdownPath not found: $MarkdownPath"
        }
        $mdContent = [IO.File]::ReadAllText((Resolve-Path -LiteralPath $MarkdownPath).Path)
    } elseif ($PSBoundParameters.ContainsKey('Markdown')) {
        $mdContent = $Markdown
    }

    # Resolve output to an absolute path; create the parent directory if needed.
    $outDir = Split-Path -Parent $OutputPath
    if ([string]::IsNullOrEmpty($outDir)) { $outDir = (Get-Location).Path }
    if (-not (Test-Path -LiteralPath $outDir)) {
        New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    }
    $outDir  = (Resolve-Path -LiteralPath $outDir).Path
    $outName = Split-Path -Leaf $OutputPath

    Write-Verbose "Gathering quill tree from $QuillPath"
    $tree = Get-QuillTree -QuillPath $QuillPath

    $loader = Resolve-WebView2Loader
    Write-Verbose "Using native loader: $loader"

    $params = @{
        ModuleRoot     = $script:ModuleRoot
        DistPath       = $script:DistPath
        LoaderPath     = $loader
        Tree           = $tree
        Format         = $Format
        Markdown       = $mdContent
        TimeoutSeconds = $TimeoutSeconds
    }

    Write-Verbose "Rendering ($Format) inside WebView2..."
    $r = Invoke-RenderCore -Params $params

    if (-not $r.ok) {
        if ($r.diagnostics) {
            foreach ($d in $r.diagnostics) {
                $sev = if ($d.severity) { $d.severity } else { 'error' }
                $loc = if ($d.location) { " [$($d.location)]" } else { '' }
                Write-Error ("quill {0}: {1}{2}" -f $sev, $d.message, $loc)
            }
        }
        throw "Render failed: $($r.error)"
    }

    $result = $r.result

    # Surface non-fatal warnings.
    if ($result.warnings) {
        foreach ($w in $result.warnings) {
            $loc = if ($w.location) { " [$($w.location)]" } else { '' }
            Write-Warning ("quill: {0}{1}" -f $w.message, $loc)
        }
    }

    $artifacts = @($result.artifacts)
    if ($artifacts.Count -eq 0) {
        throw "Render returned no artifacts."
    }

    $written = New-Object System.Collections.Generic.List[string]
    if ($artifacts.Count -eq 1) {
        $bytes = [Convert]::FromBase64String($artifacts[0].base64)
        $target = Join-Path $outDir $outName
        [IO.File]::WriteAllBytes($target, $bytes)
        $written.Add($target)
    } else {
        $base = [IO.Path]::GetFileNameWithoutExtension($outName)
        for ($i = 0; $i -lt $artifacts.Count; $i++) {
            $a = $artifacts[$i]
            $ext = if ($a.format) { $a.format } else { $Format }
            $name = "{0}-{1}.{2}" -f $base, ($i + 1), $ext
            $target = Join-Path $outDir $name
            [IO.File]::WriteAllBytes($target, [Convert]::FromBase64String($a.base64))
            $written.Add($target)
        }
    }

    [PSCustomObject]@{
        OutputFiles  = $written.ToArray()
        Format       = $result.outputFormat
        ArtifactCount = $artifacts.Count
        RenderTimeMs = $result.renderTimeMs
        Warnings     = @($result.warnings).Count
        QuillName    = if ($result.metadata) { $result.metadata.name } else { $null }
    }
}

Export-ModuleMember -Function Invoke-QuillRender

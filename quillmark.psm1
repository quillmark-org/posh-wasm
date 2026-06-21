#requires -Version 5.1

# quillmark - render a quill to PDF/SVG/PNG from PowerShell, fully offline, with
# no Node.js at runtime. A WebView2 control hosted by PowerShell loads the
# bundled @quillmark/wasm build (dist/) and does the actual render.
#
# Public surface (mirrors quillmark's Python API):
#   Export-QuillDocument   ~ engine.render(quill, doc, fmt)   (alias: Invoke-QuillRender)
#   Get-Quill              ~ Quill.from_path + .metadata/.schema/.blueprint + supported_formats
#   Test-QuillDocument     ~ quill.validate(doc)
#
# A render host (the 28 MB WASM load + Quill.fromTree) is warmed ONCE per
# pipeline invocation and reused for every piped item, then disposed - so bulk
# generation pays the load cost once without exposing any session object.

$script:ModuleRoot = $PSScriptRoot
$script:DistPath   = Join-Path $script:ModuleRoot 'dist'
$script:QuillsDir  = Join-Path $script:ModuleRoot 'quills'

# kernel32.LoadLibrary, used to pre-load the architecture-correct native
# WebView2 loader process-wide before any WebView2 managed call. Defined in the
# module's own session state (not a child runspace) since the loaded module is
# shared across the whole process/AppDomain.
if (-not ('PoshWasm.Native' -as [type])) {
    Add-Type -Namespace PoshWasm -Name Native -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("kernel32", SetLastError = true, CharSet = System.Runtime.InteropServices.CharSet.Unicode)]
public static extern System.IntPtr LoadLibrary(string lpFileName);
'@
}

# Lets -Quill accept a quill OBJECT from Get-Quill (or its catalog), not just
# a string: any non-string object that has a .Path property is unwrapped to that
# path. Strings pass through untouched, so `-Quill usaf_memo` and
# `-Quill (Get-Quill usaf_memo)` both work. Defined via Add-Type (a compiled
# type) because a PowerShell `class` can't be used as an attribute in its own module.
if (-not ('PoshWasm.QuillPathTransformAttribute' -as [type])) {
    Add-Type -ReferencedAssemblies ([psobject].Assembly.Location) -TypeDefinition @'
using System;
using System.Management.Automation;
namespace PoshWasm {
    public class QuillPathTransformAttribute : ArgumentTransformationAttribute {
        public override object Transform(EngineIntrinsics engineIntrinsics, object inputData) {
            if (inputData == null) return inputData;
            PSObject pso = inputData as PSObject;
            object baseObj = pso != null ? pso.BaseObject : inputData;
            if (baseObj is string) return inputData;
            PSObject view = pso != null ? pso : PSObject.AsPSObject(inputData);
            PSPropertyInfo prop = view.Properties["Path"];
            if (prop != null && prop.Value != null) return prop.Value.ToString();
            return inputData;
        }
    }
}
'@
}

# ==========================================================================
# Private helpers
# ==========================================================================

function Resolve-WebView2Loader {
    # Full path to the WebView2Loader.dll matching the current process arch.
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
        default { throw "Unsupported process architecture '$arch'. quillmark ships loaders for x64, x86, and arm64." }
    }
    $path = Join-Path (Join-Path $script:ModuleRoot 'native') (Join-Path $sub 'WebView2Loader.dll')
    if (-not (Test-Path -LiteralPath $path)) { throw "Native WebView2 loader not found for $sub at: $path" }
    (Resolve-Path -LiteralPath $path).Path
}

function Get-BundledQuillName {
    # Names of quills bundled with the module: each folder under quills/ that
    # contains a Quill.yaml. The set grows as more templates are shipped.
    Get-ChildItem -LiteralPath $script:QuillsDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'Quill.yaml') } |
        ForEach-Object { $_.Name } |
        Sort-Object
}

function Get-QuillIdentity {
    # Cheap identity read straight from a quill's Quill.yaml `quill:` header -- no
    # WebView2/WASM. Used to list the bundled catalog quickly.
    param([Parameter(Mandatory)][string]$QuillDir)
    $id = [pscustomobject]@{ Name = $null; Version = $null; Backend = $null; Description = $null }
    $yaml = Join-Path $QuillDir 'Quill.yaml'
    if (-not (Test-Path -LiteralPath $yaml)) { return $id }
    $inQuill = $false
    foreach ($line in [IO.File]::ReadAllLines($yaml)) {
        if ($line -match '^\s*#') { continue }
        if ($line -match '^quill:\s*$') { $inQuill = $true; continue }
        if ($inQuill) {
            if ($line -match '^\S') { break }   # dedent => left the quill: block
            if     ($line -match '^\s+name:\s*(.+?)\s*$')        { $id.Name        = $matches[1].Trim('"', "'") }
            elseif ($line -match '^\s+version:\s*(.+?)\s*$')     { $id.Version     = $matches[1].Trim('"', "'") }
            elseif ($line -match '^\s+backend:\s*(.+?)\s*$')     { $id.Backend     = $matches[1].Trim('"', "'") }
            elseif ($line -match '^\s+description:\s*(.+?)\s*$') { $id.Description = $matches[1].Trim('"', "'") }
        }
    }
    $id
}

function Resolve-QuillPath {
    # Turn a -QuillPath argument into an absolute quill directory. An existing
    # path (relative or absolute) always wins; a bare name with no separators is
    # resolved against the quills bundled with the module, so `-QuillPath usaf_memo`
    # works the same whether the module is cloned or installed from the Gallery.
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$QuillPath)

    if (Test-Path -LiteralPath $QuillPath -PathType Container) {
        return (Resolve-Path -LiteralPath $QuillPath).Path
    }
    if ($QuillPath -notmatch '[\\/]') {
        $bundled = Join-Path $script:QuillsDir $QuillPath
        if (Test-Path -LiteralPath (Join-Path $bundled 'Quill.yaml')) {
            return (Resolve-Path -LiteralPath $bundled).Path
        }
    }
    $names = (Get-BundledQuillName) -join ', '
    $hint = if ($names) { " Bundled quills: $names." } else { '' }
    throw "QuillPath '$QuillPath' is not an existing quill directory or a bundled quill name.$hint"
}

function Get-QuillTree {
    # Walk a quill directory into a hashtable of "<relative/path>" -> base64.
    # Forward-slash keys from the quill ROOT, exactly what Quill.fromTree wants.
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$QuillPath)

    if (-not (Test-Path -LiteralPath $QuillPath -PathType Container)) {
        throw "QuillPath is not an existing directory: $QuillPath"
    }
    $root = (Resolve-Path -LiteralPath $QuillPath).Path
    $tree = @{}
    foreach ($f in (Get-ChildItem -LiteralPath $root -Recurse -File -Force)) {
        $rel = $f.FullName.Substring($root.Length).TrimStart('\', '/').Replace('\', '/')
        $tree[$rel] = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
    }
    if ($tree.Count -eq 0) { throw "No files found under QuillPath: $root" }
    $tree
}

function Format-QuillDiagnostic {
    param($Diag)
    $sev = if ($Diag.severity) { $Diag.severity } else { 'error' }
    $code = if ($Diag.code) { " ($($Diag.code))" } else { '' }
    $loc = ''
    if ($Diag.location) {
        $l = $Diag.location
        $loc = " [$($l.file):$($l.line):$($l.column)]"
    } elseif ($Diag.path) {
        $loc = " [$($Diag.path)]"
    }
    "{0}{1}: {2}{3}" -f $sev, $code, $Diag.message, $loc
}

# -- The render host (runs on a dedicated STA runspace) --------------------
# WinForms/WebView2 require STA and have thread affinity. We run the host on a
# runspace opened STA with ReuseThread so every request hits the same thread,
# keeping the live control valid across the pipeline. Scripts communicate
# through $global: state (PS event handlers do not close over locals).

$script:WarmupScript = @'
param(
    [Parameter(Mandatory)][string] $ModuleRoot,
    [Parameter(Mandatory)][string] $DistPath,
    [Parameter(Mandatory)][hashtable] $Tree,
    [int] $TimeoutSeconds = 120
)
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -Path (Join-Path $ModuleRoot 'Microsoft.Web.WebView2.Core.dll')
Add-Type -Path (Join-Path $ModuleRoot 'Microsoft.Web.WebView2.WinForms.dll')

$global:PW_runtimeHelp = "WebView2 Runtime not found. Install the Microsoft Edge WebView2 Runtime (Evergreen bootstrapper) from https://developer.microsoft.com/microsoft-edge/webview2/ and retry."
$global:PW_dist     = (Resolve-Path -LiteralPath $DistPath).Path
$global:PW_tree     = $Tree
$global:PW_ready    = $false
$global:PW_done     = $false
$global:PW_msg      = $null
$global:PW_err      = $null
$global:PW_expectId = 0

$global:PW_udf = Join-Path $env:TEMP ("quillmark-wv2-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $global:PW_udf | Out-Null

$global:PW_form = New-Object System.Windows.Forms.Form
$global:PW_wv   = New-Object Microsoft.Web.WebView2.WinForms.WebView2
$global:PW_wv.Dock = 'Fill'
$global:PW_form.Controls.Add($global:PW_wv)

$global:PW_envTask = [Microsoft.Web.WebView2.Core.CoreWebView2Environment]::CreateAsync($null, $global:PW_udf, $null)

$global:PW_wv.add_CoreWebView2InitializationCompleted({
    param($s, $e)
    try {
        if (-not $e.IsSuccess) {
            $global:PW_err = "WebView2 init failed: " + $e.InitializationException.ToString()
            $global:PW_done = $true; return
        }
        $core = $s.CoreWebView2
        $core.SetVirtualHostNameToFolderMapping(
            'quillmark.local', $global:PW_dist,
            [Microsoft.Web.WebView2.Core.CoreWebView2HostResourceAccessKind]::Allow)
        $core.add_WebMessageReceived({
            param($s2, $e2)
            try {
                $obj = $e2.TryGetWebMessageAsString() | ConvertFrom-Json
                if ($obj.type -eq 'ready') { $global:PW_ready = $true; return }
                if ($obj.type -eq 'error') { $global:PW_err = [string]$obj.error; $global:PW_done = $true; return }
                if ($obj.id -eq $global:PW_expectId) { $global:PW_msg = $obj; $global:PW_done = $true }
            } catch {
                $global:PW_err = "host message handler error: " + $_.Exception.Message
                $global:PW_done = $true
            }
        })
        $core.Navigate('https://quillmark.local/index.html')
    } catch {
        $global:PW_err = "init handler error: " + $_.Exception.Message
        $global:PW_done = $true
    }
})

$global:PW_form.Add_Shown({
    try {
        while (-not $global:PW_envTask.IsCompleted) { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 15 }
        if ($global:PW_envTask.IsFaulted) {
            $ex = $global:PW_envTask.Exception.ToString()
            if ($ex -match 'WebView2|DllNotFound|loader|runtime') { $global:PW_err = $global:PW_runtimeHelp + " (underlying: " + $ex + ")" }
            else { $global:PW_err = "CreateAsync faulted: " + $ex }
            $global:PW_done = $true; return
        }
        $global:PW_wv.EnsureCoreWebView2Async($global:PW_envTask.Result) | Out-Null
    } catch {
        $global:PW_err = "shown handler error: " + $_.Exception.Message
        $global:PW_done = $true
    }
})

$global:PW_form.Show()
$global:PW_form.Visible = $false

# Wait for the page bridge to come up.
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while (-not $global:PW_ready -and -not $global:PW_err -and (Get-Date) -lt $deadline) {
    [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 15
}
if ($global:PW_err)   { return @{ ok = $false; error = $global:PW_err } }
if (-not $global:PW_ready) { return @{ ok = $false; error = "WebView2 page did not become ready within $TimeoutSeconds s." } }

# Load the quill once; the bridge caches it for every later request.
$global:PW_done = $false; $global:PW_msg = $null; $global:PW_err = $null; $global:PW_expectId = 1
$req = @{ id = 1; type = 'loadQuill'; tree = $global:PW_tree } | ConvertTo-Json -Depth 8 -Compress
$global:PW_wv.CoreWebView2.PostWebMessageAsJson($req)
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while (-not $global:PW_done -and -not $global:PW_err -and (Get-Date) -lt $deadline) {
    [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 15
}
if ($global:PW_err)  { return @{ ok = $false; error = $global:PW_err } }
if (-not $global:PW_done) { return @{ ok = $false; error = "loadQuill timed out after $TimeoutSeconds s." } }
if (-not $global:PW_msg.ok) { return @{ ok = $false; error = [string]$global:PW_msg.error; diagnostics = $global:PW_msg.diagnostics } }
return @{ ok = $true; info = $global:PW_msg }
'@

$script:RequestScript = @'
param(
    [Parameter(Mandatory)][string] $ReqJson,
    [Parameter(Mandatory)][int]    $ExpectId,
    [int] $TimeoutSeconds = 120
)
$global:PW_done = $false; $global:PW_msg = $null; $global:PW_err = $null; $global:PW_expectId = $ExpectId
$global:PW_wv.CoreWebView2.PostWebMessageAsJson($ReqJson)
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while (-not $global:PW_done -and -not $global:PW_err -and (Get-Date) -lt $deadline) {
    [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 15
}
if ($global:PW_err)  { return @{ ok = $false; error = $global:PW_err } }
if (-not $global:PW_done) { return @{ ok = $false; error = "request timed out after $TimeoutSeconds s." } }
if (-not $global:PW_msg.ok) { return @{ ok = $false; error = [string]$global:PW_msg.error; diagnostics = $global:PW_msg.diagnostics } }
return @{ ok = $true; msg = $global:PW_msg }
'@

$script:TeardownScript = @'
try { $global:PW_form.Close() } catch {}
try { $global:PW_wv.Dispose() } catch {}
try { $global:PW_form.Dispose() } catch {}
try { if ($global:PW_udf) { Remove-Item -Recurse -Force -LiteralPath $global:PW_udf -ErrorAction SilentlyContinue } } catch {}
'@

function Invoke-InRunspace {
    param([Parameter(Mandatory)]$Runspace, [Parameter(Mandatory)][string]$ScriptText, [hashtable]$Parameters)
    $ps = [powershell]::Create()
    $ps.Runspace = $Runspace
    [void]$ps.AddScript($ScriptText)
    if ($Parameters) { [void]$ps.AddParameters($Parameters) }
    try {
        $out = $ps.Invoke()
        if ($ps.Streams.Error.Count -gt 0) {
            $msgs = ($ps.Streams.Error | ForEach-Object { $_.ToString() }) -join '; '
            return @{ ok = $false; error = "render host error: $msgs" }
        }
        if ($out.Count -gt 0) { return $out[$out.Count - 1] }
        return @{ ok = $false; error = "render host returned no result." }
    } finally {
        $ps.Dispose()
    }
}

function Open-QuillHost {
    # Warm a render host for one quill and return a session handle. Internal -
    # callers must always pair this with Close-QuillHost.
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$QuillPath, [int]$TimeoutSeconds = 120)

    if (-not (Test-Path -LiteralPath $script:DistPath -PathType Container)) {
        throw "Bundled web assets not found at '$script:DistPath'. Rebuild the dist/ folder with: (cd web; npm install; npx vite build)."
    }

    $QuillPath = Resolve-QuillPath -QuillPath $QuillPath
    $tree   = Get-QuillTree -QuillPath $QuillPath
    $loader = Resolve-WebView2Loader

    # Pre-load the native loader process-wide so the managed SDK's
    # DllImport("WebView2Loader.dll") resolves by module name in the runspace.
    $h = [PoshWasm.Native]::LoadLibrary($loader)
    if ($h -eq [IntPtr]::Zero) {
        throw "Failed to load native WebView2 loader '$loader' (LastError=$([Runtime.InteropServices.Marshal]::GetLastWin32Error()))."
    }

    $rs = [runspacefactory]::CreateRunspace()
    $rs.ApartmentState = [Threading.ApartmentState]::STA
    $rs.ThreadOptions  = [System.Management.Automation.Runspaces.PSThreadOptions]::ReuseThread
    $rs.Open()

    $warm = Invoke-InRunspace -Runspace $rs -ScriptText $script:WarmupScript -Parameters @{
        ModuleRoot     = $script:ModuleRoot
        DistPath       = $script:DistPath
        Tree           = $tree
        TimeoutSeconds = $TimeoutSeconds
    }
    if (-not $warm.ok) {
        try { $rs.Close(); $rs.Dispose() } catch {}
        if ($warm.diagnostics) { foreach ($d in $warm.diagnostics) { Write-Error (Format-QuillDiagnostic $d) } }
        throw "Failed to start render host: $($warm.error)"
    }

    [pscustomobject]@{
        Runspace = $rs
        Info     = $warm.info
        Path     = (Resolve-Path -LiteralPath $QuillPath).Path
        NextId   = 1
    }
}

function Close-QuillHost {
    param([Parameter(Mandatory)]$QuillHost)
    try { Invoke-InRunspace -Runspace $QuillHost.Runspace -ScriptText $script:TeardownScript | Out-Null } catch {}
    try { $QuillHost.Runspace.Close(); $QuillHost.Runspace.Dispose() } catch {}
}

function Invoke-QuillHostRequest {
    param([Parameter(Mandatory)]$QuillHost, [Parameter(Mandatory)][hashtable]$Request, [int]$TimeoutSeconds = 120)
    $QuillHost.NextId++
    $Request['id'] = $QuillHost.NextId
    $json = $Request | ConvertTo-Json -Depth 8 -Compress
    Invoke-InRunspace -Runspace $QuillHost.Runspace -ScriptText $script:RequestScript -Parameters @{
        ReqJson = $json; ExpectId = $QuillHost.NextId; TimeoutSeconds = $TimeoutSeconds
    }
}

function Get-QuillFieldRows {
    # Project a card schema's `fields` map into friendly row objects.
    param($CardSchema)
    $rows = @()
    if (-not $CardSchema) { return $rows }
    $fieldsProp = $CardSchema.PSObject.Properties['fields']
    if (-not $fieldsProp -or -not $fieldsProp.Value) { return $rows }
    foreach ($p in $fieldsProp.Value.PSObject.Properties) {
        $fs = $p.Value
        $hasDefault = [bool]($fs.PSObject.Properties['default'])
        $ui = $fs.PSObject.Properties['ui']
        $rows += [pscustomobject]@{
            Name        = $p.Name
            Type        = $fs.type
            HasDefault  = $hasDefault
            Default     = if ($hasDefault) { $fs.default } else { $null }
            Example     = if ($fs.PSObject.Properties['example']) { $fs.example } else { $null }
            Enum        = if ($fs.PSObject.Properties['enum']) { $fs.enum } else { $null }
            Group       = if ($ui -and $ui.Value) { $ui.Value.group } else { $null }
            Description = if ($fs.PSObject.Properties['description']) { $fs.description } else { $null }
        }
    }
    $rows
}

function Resolve-RenderOutputs {
    # Map an artifact list to absolute output paths. Single artifact -> the exact
    # OutputPath (file mode) or "<dir>\<base>.<ext>" (dir mode); multiple ->
    # "<base>-N.<ext>" next to it.
    param($Artifacts, [string]$Mode, [string]$OutputPath, [string]$OutputDirectory, [string]$BaseName, [string]$Format)

    function ConvertTo-AbsPath([string]$p) {
        if ([IO.Path]::IsPathRooted($p)) { $p } else { Join-Path (Get-Location).Path $p }
    }

    $targets = @()
    if ($Mode -eq 'file') {
        $abs = ConvertTo-AbsPath $OutputPath
        $dir = Split-Path -Parent $abs
        if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        if ($Artifacts.Count -eq 1) {
            $targets = @($abs)
        } else {
            $base = [IO.Path]::GetFileNameWithoutExtension($abs)
            for ($i = 0; $i -lt $Artifacts.Count; $i++) {
                $ext = if ($Artifacts[$i].format) { $Artifacts[$i].format } else { $Format }
                $targets += (Join-Path $dir ("{0}-{1}.{2}" -f $base, ($i + 1), $ext))
            }
        }
    } else {
        $dir = ConvertTo-AbsPath $OutputDirectory
        if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
        if ($Artifacts.Count -eq 1) {
            $ext = if ($Artifacts[0].format) { $Artifacts[0].format } else { $Format }
            $targets = @(Join-Path $dir ("{0}.{1}" -f $BaseName, $ext))
        } else {
            for ($i = 0; $i -lt $Artifacts.Count; $i++) {
                $ext = if ($Artifacts[$i].format) { $Artifacts[$i].format } else { $Format }
                $targets += (Join-Path $dir ("{0}-{1}.{2}" -f $BaseName, ($i + 1), $ext))
            }
        }
    }
    $targets
}

# ==========================================================================
# Public cmdlets
# ==========================================================================

function Export-QuillDocument {
    <#
    .SYNOPSIS
        Render a quill document to PDF/SVG/PNG via @quillmark/wasm, fully offline.
    .DESCRIPTION
        Renders one or many documents against a quill. Pipe markdown files in for
        bulk generation: a single WebView2 render host is warmed once for the
        whole pipeline and reused for every item, so the 28 MB WASM load is paid
        once. With no markdown supplied, the quill's seeded starter document is
        rendered.
    .PARAMETER Quill
        The quill to render with: a bundled quill name (e.g. usaf_memo), a path to
        a quill directory, or a quill object from Get-Quill. (Alias: QuillPath.)
    .PARAMETER MarkdownPath
        Path to a markdown file to render. Accepts pipeline input (including
        Get-ChildItem FileInfo via its FullName).
    .PARAMETER Markdown
        Inline markdown content to render.
    .PARAMETER OutputPath
        Output file for a single render. Multi-artifact formats write
        <base>-N.<ext> next to it.
    .PARAMETER OutputDirectory
        Output folder; each output is named from its input file's base name (or
        the quill name for a seeded render) plus the format extension. Defaults to
        the current directory when neither -OutputPath nor -OutputDirectory is given.
    .PARAMETER Format
        Output format: pdf (default), svg, or png.
    .PARAMETER TimeoutSeconds
        Per-request timeout (also the host warm-up timeout). Default 120.
    .EXAMPLE
        Export-QuillDocument -Quill usaf_memo
        # -> .\usaf_memo.pdf in the current directory
    .EXAMPLE
        Export-QuillDocument -Quill usaf_memo -OutputPath .\memo.pdf
    .EXAMPLE
        Get-ChildItem .\inbox\*.md | Export-QuillDocument -Quill usaf_memo -OutputDirectory .\out
    #>
    [CmdletBinding(DefaultParameterSetName = 'ToPath')]
    [OutputType([PSCustomObject])]
    [Alias('Invoke-QuillRender')]
    param(
        [Parameter(Mandatory, Position = 0)]
        [PoshWasm.QuillPathTransformAttribute()]
        [Alias('QuillPath')]
        [ValidateNotNullOrEmpty()]
        [string]$Quill,

        [Parameter(ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [Alias('FullName', 'Path')]
        [string]$MarkdownPath,

        [string]$Markdown,

        [Parameter(ParameterSetName = 'ToPath')]
        [string]$OutputPath,

        [Parameter(ParameterSetName = 'ToDir', Mandatory)]
        [string]$OutputDirectory,

        [ValidateSet('pdf', 'svg', 'png')]
        [string]$Format = 'pdf',

        [ValidateRange(1, 3600)]
        [int]$TimeoutSeconds = 120
    )

    begin {
        if ($PSBoundParameters.ContainsKey('Markdown') -and $PSBoundParameters.ContainsKey('MarkdownPath')) {
            throw "Specify only one of -Markdown or -MarkdownPath."
        }
        # -OutputPath => write that exact file. Otherwise write to a directory,
        # naming each output after its input. With neither -OutputPath nor
        # -OutputDirectory, default to the current directory (KISS).
        $mode = if ($PSBoundParameters.ContainsKey('OutputPath')) { 'file' } else { 'dir' }
        if ($mode -eq 'dir' -and -not $PSBoundParameters.ContainsKey('OutputDirectory')) {
            $OutputDirectory = (Get-Location).Path
        }
        $qhost = Open-QuillHost -QuillPath $Quill -TimeoutSeconds $TimeoutSeconds
        $itemCount = 0
    }

    process {
        $md = $null
        $src = '(seed)'
        if ($PSBoundParameters.ContainsKey('MarkdownPath') -and $MarkdownPath) {
            if (-not (Test-Path -LiteralPath $MarkdownPath -PathType Leaf)) {
                Write-Error "MarkdownPath not found: $MarkdownPath"; return
            }
            $md = [IO.File]::ReadAllText((Resolve-Path -LiteralPath $MarkdownPath).Path)
            $src = [IO.Path]::GetFileNameWithoutExtension($MarkdownPath)
        } elseif ($PSBoundParameters.ContainsKey('Markdown')) {
            $md = $Markdown; $src = '(inline)'
        }

        $itemCount++
        if ($mode -eq 'file' -and $itemCount -gt 1) {
            Write-Error "Multiple inputs were piped but -OutputPath targets a single file. Use -OutputDirectory for bulk rendering."
            return
        }

        $req = @{ type = 'render'; format = $Format }
        if ($null -ne $md) { $req['markdown'] = $md }

        $r = Invoke-QuillHostRequest -QuillHost $qhost -Request $req -TimeoutSeconds $TimeoutSeconds
        if (-not $r.ok) {
            if ($r.diagnostics) { foreach ($d in $r.diagnostics) { Write-Error (Format-QuillDiagnostic $d) } }
            Write-Error "Render failed for '$src': $($r.error)"
            return
        }

        $result = $r.msg.result
        if ($result.warnings) { foreach ($w in $result.warnings) { Write-Warning ("[$src] " + (Format-QuillDiagnostic $w)) } }

        $artifacts = @($result.artifacts)
        if ($artifacts.Count -eq 0) { Write-Error "Render for '$src' returned no artifacts."; return }

        $baseName = if ($src -in '(seed)', '(inline)') { if ($qhost.Info.metadata) { $qhost.Info.metadata.name } else { 'document' } } else { $src }
        $targets = @(Resolve-RenderOutputs -Artifacts $artifacts -Mode $mode -OutputPath $OutputPath -OutputDirectory $OutputDirectory -BaseName $baseName -Format $Format)

        for ($i = 0; $i -lt $artifacts.Count; $i++) {
            [IO.File]::WriteAllBytes($targets[$i], [Convert]::FromBase64String($artifacts[$i].base64))
        }

        $out = [pscustomobject]@{
            Source        = $src
            OutputFiles   = $targets
            Format        = $result.outputFormat
            ArtifactCount = $artifacts.Count
            RenderTimeMs  = $result.renderTimeMs
            Warnings      = @($result.warnings).Count
            QuillName     = if ($qhost.Info.metadata) { $qhost.Info.metadata.name } else { $null }
        }
        $out.PSObject.TypeNames.Insert(0, 'PoshWasm.RenderResult')
        $out
    }

    end {
        if ($qhost) { Close-QuillHost -QuillHost $qhost }
    }
}

function Get-Quill {
    <#
    .SYNOPSIS
        Inspect a quill: identity, supported formats, fields, schema, blueprint.
    .DESCRIPTION
        With no -Quill, lists the quills bundled with the module (a cheap
        catalog: Name/Version/Backend/Description, read from each Quill.yaml).

        With a -Quill (a bundled quill name or a directory), loads that quill
        and returns a rich object: the default view shows
        Name/Version/Backend/SupportedFormats/Description, and the full object
        also carries Fields (a projected field table), CardKinds, Schema (raw),
        and Blueprint (starter markdown).
    .PARAMETER Quill
        Bundled quill name (e.g. usaf_memo) or path to a quill directory. Accepts
        pipeline input. Omit to list the bundled quills. (Alias: QuillPath.)
    .PARAMETER TimeoutSeconds
        Host warm-up timeout. Default 120.
    .EXAMPLE
        Get-Quill
    .EXAMPLE
        Get-Quill usaf_memo
    .EXAMPLE
        (Get-Quill usaf_memo).Fields | Where-Object { -not $_.HasDefault }
    #>
    [CmdletBinding()]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Position = 0, ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [PoshWasm.QuillPathTransformAttribute()]
        [Alias('FullName', 'Path', 'QuillPath')]
        [string]$Quill,

        [ValidateRange(1, 3600)]
        [int]$TimeoutSeconds = 120
    )

    process {
        # No quill specified -> emit the bundled catalog (cheap, no WebView2).
        if ([string]::IsNullOrEmpty($Quill)) {
            foreach ($name in (Get-BundledQuillName)) {
                $dir = Join-Path $script:QuillsDir $name
                $id = Get-QuillIdentity -QuillDir $dir
                $row = [pscustomobject]@{
                    Name        = if ($id.Name) { $id.Name } else { $name }
                    Version     = $id.Version
                    Backend     = $id.Backend
                    Description = $id.Description
                    Path        = $dir
                }
                $row.PSObject.TypeNames.Insert(0, 'PoshWasm.QuillSummary')
                $row
            }
            return
        }

        $qhost = Open-QuillHost -QuillPath $Quill -TimeoutSeconds $TimeoutSeconds
        try {
            $info = $qhost.Info
            $meta = $info.metadata
            $schema = $info.schema

            $fields = @()
            $cardKinds = @()
            if ($schema) {
                if ($schema.PSObject.Properties['main']) { $fields = @(Get-QuillFieldRows $schema.main) }
                if ($schema.PSObject.Properties['card_kinds'] -and $schema.card_kinds) {
                    $cardKinds = @($schema.card_kinds.PSObject.Properties.Name)
                }
            }

            $name    = if ($meta) { $meta.name } else { $null }
            $version = if ($meta) { $meta.version } else { $null }

            $obj = [pscustomobject]@{
                Name             = $name
                Version          = $version
                QuillRef         = if ($name -and $version) { "$name@$version" } else { $name }
                Backend          = if ($meta) { $meta.backend } else { $null }
                Description      = if ($meta) { $meta.description } else { $null }
                Author           = if ($meta) { $meta.author } else { $null }
                SupportedFormats = @($info.supportedFormats)
                Fields           = $fields
                CardKinds        = $cardKinds
                Schema           = $schema
                Blueprint        = $info.blueprint
                Path             = $qhost.Path
            }
            $obj.PSObject.TypeNames.Insert(0, 'PoshWasm.Quill')

            $defaultProps = [string[]]('Name', 'Version', 'Backend', 'SupportedFormats', 'Description')
            $dm = New-Object System.Management.Automation.PSPropertySet('DefaultDisplayPropertySet', $defaultProps)
            $obj | Add-Member -MemberType MemberSet -Name PSStandardMembers -Value ([System.Management.Automation.PSMemberInfo[]]@($dm))
            $obj
        } finally {
            Close-QuillHost -QuillHost $qhost
        }
    }
}

function Test-QuillDocument {
    <#
    .SYNOPSIS
        Validate document(s) against a quill's schema without rendering.
    .DESCRIPTION
        Returns a result per document with IsValid and the diagnostics list.
        Pipe many markdown files in to validate a batch fast (one warm host)
        before committing to expensive renders. With no markdown, the quill's
        seeded document is validated.

        IsValid mirrors renderability: the non-fatal completeness signal
        (validation::field_absent, which render zero-fills) does not make a
        document invalid - those absent fields are reported in AbsentFields.
    .PARAMETER Quill
        Bundled quill name, path to a quill directory, or a Get-Quill object.
        (Alias: QuillPath.)
    .PARAMETER MarkdownPath
        Markdown file to validate. Accepts pipeline input.
    .PARAMETER Markdown
        Inline markdown to validate.
    .PARAMETER TimeoutSeconds
        Per-request / warm-up timeout. Default 120.
    .EXAMPLE
        Get-ChildItem .\inbox\*.md | Test-QuillDocument -Quill usaf_memo |
            Where-Object { -not $_.IsValid }
    #>
    [CmdletBinding()]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Mandatory, Position = 0)]
        [PoshWasm.QuillPathTransformAttribute()]
        [Alias('QuillPath')]
        [ValidateNotNullOrEmpty()]
        [string]$Quill,

        [Parameter(ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [Alias('FullName', 'Path')]
        [string]$MarkdownPath,

        [string]$Markdown,

        [ValidateRange(1, 3600)]
        [int]$TimeoutSeconds = 120
    )

    begin {
        if ($PSBoundParameters.ContainsKey('Markdown') -and $PSBoundParameters.ContainsKey('MarkdownPath')) {
            throw "Specify only one of -Markdown or -MarkdownPath."
        }
        $qhost = Open-QuillHost -QuillPath $Quill -TimeoutSeconds $TimeoutSeconds
    }

    process {
        $md = $null
        $src = '(seed)'
        if ($PSBoundParameters.ContainsKey('MarkdownPath') -and $MarkdownPath) {
            if (-not (Test-Path -LiteralPath $MarkdownPath -PathType Leaf)) {
                Write-Error "MarkdownPath not found: $MarkdownPath"; return
            }
            $md = [IO.File]::ReadAllText((Resolve-Path -LiteralPath $MarkdownPath).Path)
            $src = [IO.Path]::GetFileNameWithoutExtension($MarkdownPath)
        } elseif ($PSBoundParameters.ContainsKey('Markdown')) {
            $md = $Markdown; $src = '(inline)'
        }

        $req = @{ type = 'validate' }
        if ($null -ne $md) { $req['markdown'] = $md }

        $r = Invoke-QuillHostRequest -QuillHost $qhost -Request $req -TimeoutSeconds $TimeoutSeconds
        if (-not $r.ok) {
            Write-Error "Validation failed for '$src': $($r.error)"; return
        }

        $diags = @($r.msg.diagnostics)
        # `validation::field_absent` is a non-fatal completeness signal: the
        # render path zero-fills the field, so it must not count against
        # renderability. IsValid mirrors what `render` would accept.
        $absent   = @($diags | Where-Object { $_.code -eq 'validation::field_absent' })
        $errors   = @($diags | Where-Object { $_.severity -eq 'error' -and $_.code -ne 'validation::field_absent' })
        $warnings = @($diags | Where-Object { $_.severity -eq 'warning' })

        $out = [pscustomobject]@{
            Source       = $src
            IsValid      = ($errors.Count -eq 0)
            ErrorCount   = $errors.Count
            WarningCount = $warnings.Count
            AbsentFields = @($absent | ForEach-Object { if ($_.path) { $_.path } else { $_.message } })
            Diagnostics  = $diags
        }
        $out.PSObject.TypeNames.Insert(0, 'PoshWasm.ValidationResult')
        $out
    }

    end {
        if ($qhost) { Close-QuillHost -QuillHost $qhost }
    }
}

# Tab-complete -Quill with the bundled quill names (suggestions only; any
# path is still accepted). Module-scoped scriptblock, so $script:QuillsDir and
# Get-BundledQuillName are in scope.
$quillPathCompleter = {
    param($commandName, $parameterName, $wordToComplete, $commandAst, $fakeBoundParameters)
    Get-BundledQuillName |
        Where-Object { $_ -like "$wordToComplete*" } |
        ForEach-Object { [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_) }
}
Register-ArgumentCompleter -CommandName 'Export-QuillDocument', 'Get-Quill', 'Test-QuillDocument' -ParameterName 'Quill' -ScriptBlock $quillPathCompleter

Export-ModuleMember -Function Export-QuillDocument, Get-Quill, Test-QuillDocument -Alias Invoke-QuillRender

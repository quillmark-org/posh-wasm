# Definitive proof: render a quill INSIDE a real WebView2 control hosted by
# PowerShell 5.1 — assets loaded offline via virtual-host mapping (no web
# server, no Node at runtime) — and get the PDF bytes back into PowerShell.
param(
  [string]$Dist  = "C:\Users\claude\posh-wasm-task\_spike\web\dist",
  [string]$Quill = "C:\Users\claude\posh-wasm-task\_deps\quillmark\crates\fixtures\resources\quills\taro\0.1.0",
  [string]$OutPdf = "C:\Users\claude\posh-wasm-task\_spike\wv2-host-render.pdf"
)
$ErrorActionPreference = "Stop"
$repo = "C:\Users\claude\posh-wasm-task\posh-wasm"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -Path "$repo\Microsoft.Web.WebView2.Core.dll"
Add-Type -Path "$repo\Microsoft.Web.WebView2.WinForms.dll"

# Build the path->base64 quill tree (this is what PowerShell would gather from disk).
$tree = @{}
$root = (Resolve-Path $Quill).Path
Get-ChildItem -Recurse -File $root | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length).TrimStart('\').Replace('\','/')
  $tree[$rel] = [Convert]::ToBase64String([IO.File]::ReadAllBytes($_.FullName))
}

$udf = Join-Path $env:TEMP "posh-wasm-wv2-render"
New-Item -ItemType Directory -Force $udf | Out-Null

$form = New-Object System.Windows.Forms.Form
$wv = New-Object Microsoft.Web.WebView2.WinForms.WebView2
$wv.Dock = "Fill"; $form.Controls.Add($wv)

$script:result = $null; $script:err = $null; $script:done = $false; $script:pageReady = $false

$envTask = [Microsoft.Web.WebView2.Core.CoreWebView2Environment]::CreateAsync($null, $udf, $null)

$wv.add_CoreWebView2InitializationCompleted({
  param($s, $e)
  if (-not $e.IsSuccess) { $script:err = $e.InitializationException.ToString(); $script:done = $true; return }
  $core = $wv.CoreWebView2
  # Offline asset serving: map a fake host to the local built bundle folder.
  $core.SetVirtualHostNameToFolderMapping("posh-wasm.local", $Dist,
    [Microsoft.Web.WebView2.Core.CoreWebView2HostResourceAccessKind]::Allow)
  $core.add_WebMessageReceived({
    param($s2, $e2)
    $msg = $e2.TryGetWebMessageAsString()
    $head = if ($msg.Length -gt 200) { $msg.Substring(0,200) } else { $msg }
    Add-Content -Path "$env:TEMP\wv2-render-debug.log" -Value ("[{0}] {1}" -f (Get-Date -Format HH:mm:ss.fff), $head)
    $obj = $msg | ConvertFrom-Json
    if ($obj.type -eq "ready") {
      $script:pageReady = $true
      try {
        $req = @{ id = 1; tree = $tree; opts = @{ format = "pdf" } } | ConvertTo-Json -Depth 6 -Compress
        Add-Content "$env:TEMP\wv2-render-debug.log" -Value ("POST len={0} head={1}" -f $req.Length, $req.Substring(0,[Math]::Min(80,$req.Length)))
        $s2.PostWebMessageAsJson($req)
        Add-Content "$env:TEMP\wv2-render-debug.log" -Value "POST-OK"
      } catch {
        Add-Content "$env:TEMP\wv2-render-debug.log" -Value ("POST-EX: " + $_.Exception.ToString())
        $script:err = "post failed: $($_.Exception.Message)"; $script:done = $true
      }
    } elseif ($obj.type -eq "error") {
      $script:err = $obj.error; $script:done = $true
    } elseif ($obj.type -eq "dbg") {
      # progress only; keep waiting
    } else {
      if ($obj.ok) { $script:result = $obj.result } else { $script:err = $obj.error }
      $script:done = $true
    }
  })
  $core.Navigate("https://posh-wasm.local/index.html")
})

$form.Add_Shown({
  while (-not $envTask.IsCompleted) { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 20 }
  if ($envTask.IsFaulted) { $script:err = $envTask.Exception.ToString(); $script:done = $true; return }
  $wv.EnsureCoreWebView2Async($envTask.Result) | Out-Null
})

$form.Show(); $form.Visible = $false
$deadline = (Get-Date).AddSeconds(60)
while (-not $script:done -and (Get-Date) -lt $deadline) { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 30 }
$form.Close()

if ($script:err) { Write-Output "ERROR: $($script:err)"; exit 1 }
if (-not $script:result) { Write-Output "TIMEOUT (pageReady=$script:pageReady)"; exit 1 }

$art = $script:result.artifacts[0]
$bytes = [Convert]::FromBase64String($art.base64)
[IO.File]::WriteAllBytes($OutPdf, $bytes)
$hdr = [Text.Encoding]::ASCII.GetString($bytes[0..4])
Write-Output ("OK name={0} format={1} timeMs={2} bytes={3} header='{4}' validPdf={5} out={6}" -f `
  $script:result.metadata.name, $script:result.outputFormat, $script:result.renderTimeMs, $bytes.Length, $hdr, ($hdr -eq '%PDF-'), $OutPdf)

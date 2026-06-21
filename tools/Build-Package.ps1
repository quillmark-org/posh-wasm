<#
.SYNOPSIS
    Stage the shippable quillmark module into a clean folder for publishing.
.DESCRIPTION
    Publish-Module packages the entire directory that holds the .psd1, so the
    repo (with web/, .git, etc.) must not be published directly.
    This copies only the runtime files into <OutputDir>\quillmark and returns
    that path. Used by .github/workflows/publish.yml and for local test packs.
.EXAMPLE
    $pkg = .\tools\Build-Package.ps1
    Test-ModuleManifest (Join-Path $pkg 'quillmark.psd1')
#>
[CmdletBinding()]
param(
    [string]$OutputDir = (Join-Path $PSScriptRoot '..\_pkg')
)
$ErrorActionPreference = 'Stop'

$root  = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$stage = Join-Path $OutputDir 'quillmark'

if (Test-Path -LiteralPath $stage) { Remove-Item -Recurse -Force -LiteralPath $stage }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

# Loose files that ship with the module.
$files = @(
    'quillmark.psd1'
    'quillmark.psm1'
    'README.md'
    'LICENSE'
    'THIRD-PARTY-NOTICES.md'
    'memo_example.md'
    'Microsoft.Web.WebView2.Core.dll'
    'Microsoft.Web.WebView2.WinForms.dll'
)
foreach ($f in $files) {
    $src = Join-Path $root $f
    if (-not (Test-Path -LiteralPath $src)) { throw "Missing required file: $f" }
    Copy-Item -LiteralPath $src -Destination $stage
}

# Directories that ship: the WASM bundle, native loaders, and the sample quill.
foreach ($d in @('dist', 'native', 'usaf_memo')) {
    $src = Join-Path $root $d
    if (-not (Test-Path -LiteralPath $src)) { throw "Missing required folder: $d" }
    Copy-Item -LiteralPath $src -Destination $stage -Recurse
}

(Resolve-Path -LiteralPath $stage).Path

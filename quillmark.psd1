@{
    RootModule        = 'quillmark.psm1'
    ModuleVersion     = '0.1.0'
    GUID              = 'ee5bcb9a-218c-49de-ae95-259706867dc1'
    Author            = 'quillmark-org'
    CompanyName       = 'quillmark-org'
    Copyright         = '(c) quillmark-org. All rights reserved.'
    Description       = 'Render a quill (Quillmark) to PDF/SVG/PNG from PowerShell, fully offline, with no Node.js at runtime. Hosts the bundled @quillmark/wasm build inside a WebView2 control.'

    PowerShellVersion = '5.1'

    # Windows + .NET Framework only (WinForms + WebView2 managed DLLs target
    # .NET FW 4.6.2 and load under Windows PowerShell 5.1 and PowerShell 7 on Windows).
    CompatiblePSEditions = @('Desktop', 'Core')

    FunctionsToExport = @('Export-QuillDocument', 'Get-Quill', 'Test-QuillDocument')
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @('Invoke-QuillRender')

    # Files that ship with the module (assets are loaded at runtime, not dot-sourced).
    FileList = @(
        'quillmark.psm1',
        'quillmark.psd1',
        'Microsoft.Web.WebView2.Core.dll',
        'Microsoft.Web.WebView2.WinForms.dll',
        'native\win-x64\WebView2Loader.dll',
        'native\win-x86\WebView2Loader.dll',
        'native\win-arm64\WebView2Loader.dll',
        'dist\index.html'
    )

    PrivateData = @{
        PSData = @{
            Tags         = @('quill', 'quillmark', 'typst', 'pdf', 'wasm', 'webview2', 'render', 'Windows')
            ProjectUri   = 'https://github.com/quillmark-org/posh-wasm'
            LicenseUri   = 'https://github.com/quillmark-org/posh-wasm/blob/main/LICENSE'
            ReleaseNotes = 'Render quills to PDF/SVG/PNG offline (no Node) via a WebView2-hosted @quillmark/wasm bundle. Cmdlets: Export-QuillDocument (pipeline/bulk), Get-Quill, Test-QuillDocument. Bundles the usaf_memo sample quill (reference bundled quills by name).'
        }
    }
}

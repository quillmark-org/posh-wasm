# posh-wasm

Render a [Quillmark](https://www.npmjs.com/package/@quillmark/wasm) quill to
**PDF / SVG / PNG** from PowerShell — fully offline, with **no Node.js at
runtime**.

PowerShell hosts a **WebView2** control that loads a bundled WebAssembly build of
`@quillmark/wasm` and does the actual render. The quill is shipped into the
control as an in-memory file tree; artifact bytes come back out and are written
to disk. Node/Vite are used only at *build* time to produce the bundle.

## Requirements (consumer)

- Windows (x64, x86, or arm64).
- Windows PowerShell 5.1 **or** PowerShell 7+ (both supported; on PowerShell 7's
  MTA default the render automatically runs on a dedicated STA runspace).
- **Microsoft Edge WebView2 Runtime** (Chromium). Pre-installed on Windows 11 and
  any box with modern Edge. If missing, the cmdlet points you at the
  [Evergreen bootstrapper](https://developer.microsoft.com/microsoft-edge/webview2/).
- No Node.js, no network access required.

Everything else (the managed WebView2 DLLs, the per-architecture native
`WebView2Loader.dll`, and the `dist/` WASM bundle) ships inside the module.

## Install / import

```powershell
Import-Module .\posh-wasm.psd1
```

## Usage

```powershell
# Render a quill's seeded starter document to PDF
Invoke-QuillRender -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf

# Render your own markdown document
Invoke-QuillRender -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf -MarkdownPath .\doc.md

# SVG / PNG (one artifact per page -> memo-1.svg, memo-2.svg, ...)
Invoke-QuillRender -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.svg -Format svg
```

### `Invoke-QuillRender`

| Parameter | Required | Description |
|---|---|---|
| `-QuillPath` | yes | Path to the quill version directory (the folder with `Quill.yaml`). |
| `-OutputPath` | yes | Output file path. Multi-artifact formats write `<base>-N.<ext>` next to it. |
| `-Format` | no | `pdf` (default), `svg`, or `png`. |
| `-Markdown` | no | Markdown content to render. Mutually exclusive with `-MarkdownPath`. |
| `-MarkdownPath` | no | Path to a markdown file to render. |
| `-TimeoutSeconds` | no | Max wait for the render (default 120). |

If neither `-Markdown` nor `-MarkdownPath` is given, the quill's
`seedDocument()` starter is rendered.

Returns an object with `OutputFiles`, `Format`, `ArtifactCount`, `RenderTimeMs`,
`Warnings`, and `QuillName`. Non-fatal diagnostics surface as PowerShell warnings;
render errors throw and emit the quill's diagnostics as PowerShell errors.

## Rebuilding the bundle (developers only)

The shipped `dist/` is produced from `web/` and must be rebuilt only when
`@quillmark/wasm` or the bridge changes:

```powershell
cd web
npm install
npx vite build   # emits ../dist (index.html + JS + 2x .wasm, ~28 MB)
```

> npm 11 blocks postinstall scripts; the required esbuild/@swc binaries are
> pre-approved via the `allowScripts` key in `web/package.json`.

## How it works

1. PowerShell walks `-QuillPath` into a `{ "relative/path": base64 }` tree.
2. It hosts a hidden WinForms WebView2 control and maps the bundled `dist/`
   folder to a virtual host (`https://posh-wasm.local/`) — served offline, no
   web server.
3. It posts `{ id, tree, opts }` to the page; the JS bridge calls
   `Quill.fromTree` + `Engine().render` and posts artifacts (base64) back.
4. PowerShell decodes and writes the output file(s).

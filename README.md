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

## Cmdlets

The surface mirrors quillmark's Python API:

| Cmdlet | Python parallel | Purpose |
|---|---|---|
| `Export-QuillDocument` | `engine.render(quill, doc, fmt)` | render document(s) to file(s) |
| `Get-Quill` | `Quill.from_path` + `.metadata`/`.schema`/`.blueprint` + `supported_formats` | inspect a quill |
| `Test-QuillDocument` | `quill.validate(doc)` | validate without rendering |

`Invoke-QuillRender` is kept as a back-compat alias of `Export-QuillDocument`.

### Usage

```powershell
# Render a quill's seeded starter document to PDF
Export-QuillDocument -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf

# Render your own markdown document
Export-QuillDocument -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf -MarkdownPath .\doc.md

# SVG / PNG (one artifact per page -> memo-1.svg, memo-2.svg, ...)
Export-QuillDocument -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.svg -Format svg

# BULK: pipe many files; ONE WebView2 host is warmed and reused for all of them
Get-ChildItem .\inbox\*.md |
    Export-QuillDocument -QuillPath .\usaf_memo\0.2.0 -OutputDirectory .\out

# Validate a whole batch (fail fast) before rendering
Get-ChildItem .\inbox\*.md |
    Test-QuillDocument -QuillPath .\usaf_memo\0.2.0 |
    Where-Object { -not $_.IsValid }

# Inspect a quill: formats, fields to fill, blueprint
$q = Get-Quill .\usaf_memo\0.2.0
$q.SupportedFormats                       # pdf, svg, png
$q.Fields | Where-Object { -not $_.HasDefault }   # fields you must fill
```

### Bulk performance (no session to manage)

The 28 MB WASM load is the dominant cost. A render host is warmed **once per
pipeline invocation** and reused for every piped item, then disposed — so a
batch pays the load once with no session object to open or close. (In a quick
run, the first render took ~390 ms and subsequent ones ~50–70 ms each.)

### `Export-QuillDocument`

| Parameter | Description |
|---|---|
| `-QuillPath` *(required)* | Quill version directory (folder with `Quill.yaml`). |
| `-MarkdownPath` | Markdown file to render. **Accepts pipeline input** (incl. `Get-ChildItem` `FullName`). |
| `-Markdown` | Inline markdown content. |
| `-OutputPath` | Output file for a single render (`<base>-N.<ext>` for multi-page). |
| `-OutputDirectory` | Output folder for bulk; each output is named from its input file. |
| `-Format` | `pdf` (default), `svg`, `png`. |
| `-TimeoutSeconds` | Per-render / warm-up timeout (default 120). |

With no markdown, the quill's seeded starter document is rendered. Emits a result
object per render (`Source`, `OutputFiles`, `Format`, `ArtifactCount`,
`RenderTimeMs`, `Warnings`, `QuillName`). Warnings surface as PowerShell warnings;
a failed item writes an error and the pipeline continues.

### `Get-Quill`

Returns one object per quill. Default view shows `Name`, `Version`, `Backend`,
`SupportedFormats`, `Description`; the full object also carries `QuillRef`,
`Author`, `Path`, `Fields` (projected `Name`/`Type`/`HasDefault`/`Default`/
`Example`/`Enum`/`Group`/`Description`), `CardKinds`, `Schema` (raw), and
`Blueprint` (starter markdown).

### `Test-QuillDocument`

Returns `Source`, `IsValid`, `ErrorCount`, `WarningCount`, `AbsentFields`, and the
full `Diagnostics` list. `IsValid` mirrors **renderability**: the non-fatal
`validation::field_absent` completeness signal (which the renderer zero-fills)
doesn't make a document invalid — those fields are listed in `AbsentFields`.

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
2. It hosts a hidden WinForms WebView2 control on a dedicated STA runspace
   (so it works from both STA and MTA hosts) and maps the bundled `dist/`
   folder to a virtual host (`https://posh-wasm.local/`) — served offline, no
   web server.
3. It sends one `loadQuill` message so the bridge builds and caches the `Quill`
   once, then issues atomic `render` / `validate` / `info` requests against it.
   The bridge replies with artifact bytes (base64), diagnostics, or metadata.
4. PowerShell decodes and writes the output file(s). The host lives for one
   pipeline invocation and is disposed at the end.

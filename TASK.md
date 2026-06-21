# TASK — posh-wasm V1: render a quill from PowerShell

> Implementation brief for the agent that builds the module. Everything below
> the line "## Proven during preflight" was validated end-to-end on this box
> (Windows 10, PowerShell 5.1, no Node at runtime). Working reference code lives
> in `reference/`. Read this whole file before starting.

## Goal

A distributable PowerShell module (`posh-wasm`) that wraps the
[`@quillmark/wasm`](https://www.npmjs.com/package/@quillmark/wasm) API.

**V1 scope (this task): a user can render a quill to a PDF.** One public cmdlet
that takes a quill directory + (optionally) a markdown document and produces an
output file (PDF for V1; SVG/PNG are free follow-ons — same backend supports
them). Keep the surface small; correctness and the offline/no-Node guarantee
matter more than breadth.

## Chosen architecture: WebView2 (decided by repo owner)

The render runs **inside a WebView2 control hosted by PowerShell** — matching the
repo's original intent (`README.md`: "PowerShell wrapper of WASM via WebView2"
and the committed WebView2 DLLs). **Node.js is NOT used at runtime.** It is used
only on the *developer/build* machine to bundle `@quillmark/wasm` into
browser-loadable assets.

```
 BUILD TIME (dev machine, Node required once)
   @quillmark/wasm (npm)  ──vite build──▶  static bundle: index.html + JS + 2×.wasm
                                           (committed/shipped inside the module)

 RUNTIME (consumer machine, NO Node)
   PowerShell cmdlet
     ├─ reads quill dir from disk → tree { "relpath": base64 }
     ├─ hosts WinForms WebView2 control (bundled managed DLLs + native loader)
     ├─ SetVirtualHostNameToFolderMapping → serves the bundle OFFLINE (no server)
     ├─ PostWebMessageAsJson({ id, tree, opts })  ──▶  JS bridge
     │                                                   Quill.fromTree(tree)
     │                                                   doc = seedDocument()/fromMarkdown
     │                                                   Engine().render(quill, doc, {format})
     │     JS ──postMessage({ id, ok, result:{artifacts:[{base64,...}]} })──▶ PS
     └─ PS decodes base64 → writes <out>.pdf
```

### Why a bundle step is mandatory (the key finding)

`@quillmark/wasm` loads its WebAssembly via **WASM-ES-Module-Integration**
(`import * as wasm from "./wasm_bg.wasm"`, see `core/wasm.js`,
`backends/typst/wasm.js`). Node 26 supports this (with an experimental warning);
**browsers/WebView2 do not.** A bundler that understands wasm-bindgen's
`--target bundler` output must rewrite those imports into `fetch` +
`WebAssembly.instantiate`. **Vite + `vite-plugin-wasm` + `vite-plugin-top-level-await`
does this** — proven. (esbuild/rollup with a wasm plugin would also work; Vite
was the path validated.)

## Prerequisites

**Build-time (developer building the module):**
- Node ≥ 22 (this box has v26.3.1) and npm.
- `npm install` in the web bundle dir, then `vite build`. NOTE: npm 11 blocks
  postinstall scripts — run `npm approve-scripts esbuild` and
  `npm approve-scripts @swc/core` (or pre-approve in `package.json` `allowScripts`)
  or the build's esbuild binary won't install.

**Runtime (consumer):**
- Windows + **WebView2 Runtime** (Chromium). Present by default on Windows 11 and
  any box with modern Edge — effectively universal on managed Windows. This box
  had Runtime 149.0.4022.80. Detect it; if absent, point the user at the
  Evergreen bootstrapper (or ship a Fixed-Version runtime, ~180 MB, for
  zero-dependency installs).
- **No Node.** **No network.**
- Bundled in the module (do not rely on the machine having them):
  `Microsoft.Web.WebView2.Core.dll`, `Microsoft.Web.WebView2.WinForms.dll`
  (both already in repo root, target .NET Framework 4.6.2 → load in PS 5.1), and
  the **native `WebView2Loader.dll`** (was MISSING from the repo; I added it at
  repo root for x64, and all three arches under `native/win-{x64,x86,arm64}/`).
  The native loader must sit next to the managed DLLs (or be resolvable) or
  `CoreWebView2Environment.CreateAsync` throws `DllNotFoundException`.

## The @quillmark/wasm API (V1 essentials)

Canonical import surface is the package root. Types: `reference/` + the package's
`runtime/runtime.d.ts` and `core/wasm.d.ts`.

```js
import { Quill, Document, Engine } from "@quillmark/wasm";

const quill  = Quill.fromTree(tree);          // tree: Record<string, Uint8Array>, keys = "/"-joined
                                              //   relative paths from the quill ROOT (the version dir)
const doc    = Document.fromMarkdown(md);      // OR quill.seedDocument() for a schema-seeded starter
const engine = new Engine();
const result = await engine.render(quill, doc, { format: "pdf" });  // async
// result.artifacts: [{ format, mimeType, bytes: Uint8Array }]
// result.warnings: Diagnostic[]; result.renderTimeMs: number
```

- A **quill** on disk is a directory `<name>/<version>/` containing `Quill.yaml`
  (declares `quill.name/version/backend/plate_file` + field schema), the glue
  template (`plate.typ` for typst), and assets. It MAY bundle a Typst package
  tree under `packages/` and a `.quillignore` — both render fine; **load every
  file into the tree** (the realistic `usaf_memo` quill with `packages/` + fonts
  rendered to a 122 KB PDF this way). `.quillignore` did not need to be honored
  for rendering; treat honoring it as optional polish.
- Typst backend `supportedFormats`: `['pdf','svg','png']` (no `txt`). PDF = one
  artifact. **SVG/PNG can produce one artifact PER PAGE** — handle
  `artifacts.length > 1` (e.g. `out-1.svg`, `out-2.svg`).
- Errors: every fallible call throws a `QuillmarkError` — a real `Error` with a
  non-empty `.diagnostics` array. The JS bridge must catch and forward
  `{ ok:false, error, diagnostics }`; the cmdlet should surface diagnostics as
  PowerShell errors (severity/message/location).

## Implementation plan

1. **Web bundle** (`reference/web/` is a working starting point — adapt paths):
   - Entry `src/quill-bridge.js` exposes a WebView2 message handler:
     receives `{ id, tree, opts }`, calls render, posts back
     `{ id, ok, result }` or `{ id, ok:false, error, diagnostics }`. It posts
     `{type:"ready"}` once loaded and forwards `unhandledrejection`/`error`.
     Tree is passed as `{ path: base64 }` and rebuilt into `Uint8Array`s in JS;
     artifact bytes are returned base64.
   - `vite build` → `dist/` (index.html + hashed JS + the two `.wasm`, ~28 MB
     total, dominated by the 26 MB typst backend wasm). Ship `dist/` in the module.
2. **PowerShell module** (`posh-wasm.psd1` + `posh-wasm.psm1`):
   - Public cmdlet, e.g. `Invoke-QuillRender` (approved verb), params roughly:
     `-QuillPath <dir>` (required), `-OutputPath <file>` (required),
     `-Format pdf|svg|png` (default pdf), `-MarkdownPath <file>` or
     `-Markdown <string>` (optional; default = `quill.seedDocument()`).
   - Internals: gather tree → host WebView2 → virtual-host map the shipped
     `dist/` → post request → await reply → write artifact(s). Use
     `reference/webview2-render.ps1` as the proven host implementation; refactor
     its body into the module (env init + STA message-pump pattern included).
   - **STA required** (WinForms). The console host is STA, but the module should
     guard/relaunch under `-STA` if `[Threading.Thread]::CurrentThread.ApartmentState`
     is MTA (e.g. PS 7 default).
   - Resolve the native loader for the process arch from `native/win-<arch>/`.
3. **Packaging**: module manifest, `dist/` assets, the 3 DLLs, `native/` loaders.
   The 26 MB wasm makes the module large — acceptable for V1; note it.

## Gotchas proven during preflight (will bite you)

- **PowerShell event scriptblocks do NOT close over outer local variables.**
  Inside `add_WebMessageReceived`, the `$core`/`$wv` locals from the init handler
  are `$null`. Use the handler's **sender arg** (`$s2.PostWebMessageAsJson(...)`)
  or `$script:`-scoped vars. This was the one bug that blocked the full roundtrip.
- Exceptions thrown inside PS event scriptblocks are **silently swallowed** —
  wrap handler bodies in try/catch and log, or you'll chase phantom timeouts.
- `CoreWebView2Environment.CreateAsync` is async; pump messages
  (`[Windows.Forms.Application]::DoEvents()`) while awaiting, then call
  `EnsureCoreWebView2Async($env)` from the control's `Shown`/init path.
- Use a writable user-data folder (`CreateAsync(null, $udf, null)`).
- `Invoke-WebRequest` in PS 5.1 is glacial on binary downloads unless
  `$ProgressPreference='SilentlyContinue'`.
- `.nupkg` is a zip but `Expand-Archive` rejects the extension — copy to `.zip`
  first. (Native loaders already extracted into the repo, so you won't need this.)

## Proven during preflight (validated on this box)

| Check | Result |
|---|---|
| `@quillmark/wasm@0.91.0` API + tree format | ✅ `reference/render-spike.mjs` |
| Render taro quill → PDF (Node) | ✅ valid 9151 B `%PDF-` |
| Render package-based `usaf_memo` quill (packages/+fonts) → PDF | ✅ 122 KB `%PDF-` |
| Vite bundles wasm-bindgen output for the browser | ✅ `reference/web/` `vite build` |
| Render in headless Edge 149 (= WebView2 Chromium engine) | ✅ `reference/web/drive.mjs`, valid PDF |
| WebView2 managed DLLs load in PS 5.1 (.NET FW 4.6.2) | ✅ |
| Native `WebView2Loader.dll` requirement | ✅ identified + added to repo |
| **Full PS 5.1 → WebView2 → WASM render → PS, OFFLINE, no Node** | ✅ `reference/webview2-render.ps1` → valid 9151 B PDF in 148 ms |

Reproduce the headline result:
```powershell
# (after `cd reference/web; npm install; npm approve-scripts esbuild; npm approve-scripts @swc/core; npx vite build`)
powershell.exe -STA -NoProfile -ExecutionPolicy Bypass -File reference\webview2-render.ps1
```
Reference scripts use absolute preflight paths (e.g. a cloned quillmark under
`_deps/`); parameterize them when folding into the module.

## Open decisions for the implementer

- Cmdlet/module naming and exact parameter set (suggestion above).
- Where do end users get quills? V1 can just take a `-QuillPath` on disk. The
  repo bundles `usaf_memo/0.2.0` as a sample; quillmark's `crates/fixtures` has
  `taro`, `classic_resume`, `cmu_letter`, `usaf_memo`.
- Multi-artifact (SVG/PNG per-page) output naming convention.
- WebView2 control lifetime: one-shot per render (proven) vs. a reused/pooled
  host for batch rendering (faster; the WASM/backend load is the main cost).
- WebView2 Runtime detection + user-facing remediation message.
- Whether to honor `.quillignore` when building the tree (optional).
- How to surface `warnings` (non-fatal diagnostics) vs throw on errors.
```

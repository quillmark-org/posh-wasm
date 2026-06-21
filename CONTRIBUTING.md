# Contributing to quillmark

Notes for building, packaging, and releasing the module. End-user docs are in
[README.md](README.md).

## Layout

| Path | What it is |
|---|---|
| `quillmark.psd1` / `quillmark.psm1` | the module |
| `dist/` | committed offline build of `@quillmark/wasm` (shipped to consumers) |
| `web/` | Vite source that produces `dist/` |
| `Microsoft.Web.WebView2.*.dll`, `native/` | WebView2 managed assemblies (AnyCPU) + per-arch native loaders |
| `quills/` | bundled quills shipped with the module (e.g. `usaf_memo`) |
| `tools/Build-Package.ps1` | stages the shippable module |
| `.github/workflows/publish.yml` | tag-triggered PowerShell Gallery release |

## Prerequisites

- Windows + PowerShell 5.1 or 7 and the WebView2 Runtime (to run/test renders).
- Node 22+ and npm — **only** to rebuild `dist/`.

## Rebuilding the WASM bundle

`dist/` is committed (consumers install offline with no Node), so rebuild it only
when `@quillmark/wasm` or `web/src/quill-bridge.js` changes:

```powershell
cd web
npm install
npx vite build   # emits ../dist
```

npm 11 blocks postinstall scripts; the required esbuild/@swc binaries are
pre-approved via the `allowScripts` key in `web/package.json`. Commit the
regenerated `dist/`.

## Packaging

`Publish-Module` packs the whole manifest folder, so publish from a clean stage,
never the repo root:

```powershell
./tools/Build-Package.ps1   # -> _pkg/quillmark (runtime files only)
```

## Releasing to the PowerShell Gallery

Automated by `.github/workflows/publish.yml`:

1. Bump `ModuleVersion` in `quillmark.psd1`.
2. Ensure `PSGALLERY_API_KEY` is set in the repo's `release` environment.
3. Tag and push (the tag must match `ModuleVersion`):

   ```powershell
   git tag v0.1.0; git push origin v0.1.0
   ```

The job stages the module, validates the manifest and that the tag matches the
version, runs PSScriptAnalyzer (errors fail the build), then `Publish-Module`s.

## Conventions

- Keep `quillmark.psm1` / `.psd1` ASCII — Windows PowerShell 5.1 reads BOM-less
  files as ANSI and will mangle non-ASCII characters.
- Use approved PowerShell verbs (`Get-Verb`) for exported functions to avoid
  import warnings.

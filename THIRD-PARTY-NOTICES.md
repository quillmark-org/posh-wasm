# Third-Party Notices

The `quillmark` module is licensed under Apache-2.0 (see `LICENSE`). The
**published Gallery package** bundles and redistributes the following two
third-party components, each under its own license.

## Microsoft Edge WebView2

- `Microsoft.Web.WebView2.Core.dll`, `Microsoft.Web.WebView2.WinForms.dll`
- `native/win-{x64,x86,arm64}/WebView2Loader.dll`

Copyright (c) Microsoft Corporation. Redistributed under the terms of the
Microsoft Edge WebView2 SDK license:
https://aka.ms/webview2/license

## @quillmark/wasm

- `dist/` (the WebAssembly build and its JavaScript glue)

Copyright (c) the Quillmark authors. Licensed under "MIT OR Apache-2.0".
https://www.npmjs.com/package/@quillmark/wasm

## usaf_memo sample quill (repository only -- NOT in the published package)

The `usaf_memo/` sample quill lives in the source repository for examples and
tests; it is **excluded from the published Gallery package**. It includes fonts
under their own licenses, with each font's license text alongside it under
`usaf_memo/packages/tonguetoquill-usaf-memo/fonts/`:

| Font | License (see the font's folder) |
|---|---|
| Cinzel | SIL Open Font License 1.1 |
| CopperplateCC | see `CopperplateCC/LICENSE.md` |
| Liberation Mono | SIL OFL / GPLv2 with font exception |
| Nimbus Roman No9 L | GNU General Public License |

These fonts are redistributed unmodified under their respective licenses for use
by the sample quill. If you repackage or remove the sample, review these terms.

# Third-Party Notices

The `quillmark` module is licensed under Apache-2.0 (see `LICENSE`). The
**published Gallery package** bundles and redistributes the following
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

## Bundled quills (`quills/`)

The module bundles ready-to-use quills under `quills/`. Each quill carries its
own fonts and assets under their own licenses, with license texts shipped
alongside them. The `usaf_memo` quill includes these fonts (license text under
`quills/usaf_memo/packages/tonguetoquill-usaf-memo/fonts/`):

| Font | License (see the font's folder) |
|---|---|
| Cinzel | SIL Open Font License 1.1 |
| CopperplateCC | see `CopperplateCC/LICENSE.md` |
| Liberation Mono | SIL OFL / GPLv2 with font exception |
| Nimbus Roman No9 L | GNU General Public License |

These fonts are redistributed unmodified under their respective licenses. When
adding a new bundled quill, list its third-party assets here.

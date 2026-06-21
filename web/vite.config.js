import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// vite-plugin-wasm rewrites wasm-bindgen's `import * as wasm from "./wasm_bg.wasm"`
// (WASM-ESM integration, unsupported in browsers/WebView2) into
// fetch + WebAssembly.instantiate, which Chromium/WebView2 runs. This is the
// step that makes @quillmark/wasm loadable inside a WebView2 control.
export default defineConfig({
  // Relative base so the built index.html references ./assets/* — works under the
  // virtual-host mapping (https://posh-wasm.local/index.html) regardless of path.
  base: "./",
  plugins: [wasm(), topLevelAwait()],
  build: {
    target: "esnext",
    // Emit the shippable bundle to the module root so posh-wasm.psm1 can serve
    // ../dist directly. emptyOutDir is required because it sits outside web/.
    outDir: "../dist",
    emptyOutDir: true,
  },
});

import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// Proves the WebView2/browser path: vite-plugin-wasm rewrites wasm-bindgen's
// `import * as wasm from "./wasm_bg.wasm"` (WASM-ESM integration, unsupported in
// browsers) into fetch + WebAssembly.instantiate, which Chromium/WebView2 runs.
export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  build: {
    target: "esnext",
    outDir: "dist",
  },
});

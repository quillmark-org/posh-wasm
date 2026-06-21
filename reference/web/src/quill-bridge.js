// Browser-side render bridge. In the real module this is what WebView2 hosts;
// PowerShell posts a tree (path -> base64) + options in, gets artifacts (base64)
// back. Here we expose it on window for the headless-Edge spike to call.
import { Quill, Document, Engine } from "@quillmark/wasm";

function treeFromBase64(map) {
  const tree = {};
  for (const [path, b64] of Object.entries(map)) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    tree[path] = bytes;
  }
  return tree;
}

function base64FromBytes(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

// treeMap: Record<path, base64>; opts: { format, markdown? }
export async function renderQuill(treeMap, opts = {}) {
  const tree = treeFromBase64(treeMap);
  const quill = Quill.fromTree(tree);
  const doc = opts.markdown
    ? Document.fromMarkdown(opts.markdown)
    : quill.seedDocument();
  const engine = new Engine();
  const result = await engine.render(quill, doc, { format: opts.format || "pdf" });
  return {
    metadata: quill.metadata,
    outputFormat: result.outputFormat,
    renderTimeMs: result.renderTimeMs,
    warnings: result.warnings,
    artifacts: result.artifacts.map((a) => ({
      format: a.format,
      mimeType: a.mimeType,
      length: a.bytes.length,
      base64: base64FromBytes(a.bytes),
    })),
  };
}

window.renderQuill = renderQuill;
window.__bridgeReady = true;

// Real WebView2 IPC: PowerShell posts {id, tree, opts}; we render and post the
// result (or error) back via chrome.webview.postMessage. This is the exact
// channel the shipped module will use to get bytes out of the control.
if (window.chrome?.webview) {
  const dbg = (m) => window.chrome.webview.postMessage(JSON.stringify({ type: "dbg", m }));
  window.chrome.webview.addEventListener("message", async (e) => {
    const req = e.data;
    try {
      dbg("got request; tree keys=" + Object.keys(req?.tree || {}).length + " fmt=" + (req?.opts?.format));
      const result = await renderQuill(req.tree, req.opts || {});
      window.chrome.webview.postMessage(JSON.stringify({ id: req.id, ok: true, result }));
    } catch (err) {
      window.chrome.webview.postMessage(
        JSON.stringify({ id: req.id, ok: false, error: String(err?.message || err), diagnostics: err?.diagnostics })
      );
    }
  });
  window.addEventListener("unhandledrejection", (ev) =>
    window.chrome.webview.postMessage(JSON.stringify({ type: "error", error: "unhandledrejection: " + String(ev.reason?.message || ev.reason) }))
  );
  window.addEventListener("error", (ev) =>
    window.chrome.webview.postMessage(JSON.stringify({ type: "error", error: "error: " + String(ev.message) }))
  );
  window.chrome.webview.postMessage(JSON.stringify({ type: "ready" }));
}

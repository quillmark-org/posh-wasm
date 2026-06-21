// Browser-side render bridge hosted inside the WebView2 control.
//
// PowerShell posts { id, tree, opts } in (tree = path -> base64), this renders
// with @quillmark/wasm and posts { id, ok, result } (artifact bytes base64) or
// { id, ok:false, error, diagnostics } back over the chrome.webview channel.
// It also posts { type:"ready" } once loaded and forwards uncaught errors so the
// host never silently times out.
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
  // Chunked to avoid blowing the call stack on large (multi-MB) artifacts.
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

function serializeDiagnostics(diags) {
  if (!Array.isArray(diags)) return [];
  return diags.map((d) => ({
    severity: d.severity,
    message: d.message,
    code: d.code,
    location: d.location,
  }));
}

// treeMap: Record<path, base64>; opts: { format, markdown? }
export async function renderQuill(treeMap, opts = {}) {
  const tree = treeFromBase64(treeMap);
  const quill = Quill.fromTree(tree);
  const doc =
    opts.markdown != null && opts.markdown !== ""
      ? Document.fromMarkdown(opts.markdown)
      : quill.seedDocument();
  const engine = new Engine();
  const result = await engine.render(quill, doc, { format: opts.format || "pdf" });
  return {
    metadata: quill.metadata,
    outputFormat: result.outputFormat,
    renderTimeMs: result.renderTimeMs,
    warnings: serializeDiagnostics(result.warnings),
    artifacts: result.artifacts.map((a) => ({
      format: a.format,
      mimeType: a.mimeType,
      length: a.bytes.length,
      base64: base64FromBytes(a.bytes),
    })),
  };
}

// Expose for headless-Edge testing (window.renderQuill); harmless in WebView2.
window.renderQuill = renderQuill;
window.__bridgeReady = true;

// Real WebView2 IPC channel used by the PowerShell module.
if (window.chrome?.webview) {
  window.chrome.webview.addEventListener("message", async (e) => {
    const req = e.data;
    try {
      const result = await renderQuill(req.tree, req.opts || {});
      window.chrome.webview.postMessage(JSON.stringify({ id: req.id, ok: true, result }));
    } catch (err) {
      window.chrome.webview.postMessage(
        JSON.stringify({
          id: req?.id,
          ok: false,
          error: String(err?.message || err),
          diagnostics: serializeDiagnostics(err?.diagnostics),
        })
      );
    }
  });

  window.addEventListener("unhandledrejection", (ev) =>
    window.chrome.webview.postMessage(
      JSON.stringify({ type: "error", error: "unhandledrejection: " + String(ev.reason?.message || ev.reason) })
    )
  );
  window.addEventListener("error", (ev) =>
    window.chrome.webview.postMessage(JSON.stringify({ type: "error", error: "error: " + String(ev.message) }))
  );

  window.chrome.webview.postMessage(JSON.stringify({ type: "ready" }));
}

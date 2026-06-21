// Browser-side render bridge hosted inside the WebView2 control.
//
// Stateful request/response protocol over chrome.webview. PowerShell loads a
// quill ONCE per host (so the 28 MB WASM + Quill.fromTree parse is paid once),
// then issues many atomic requests against it:
//
//   PS -> JS : { id, type:"loadQuill", tree:{ "path": base64 } }
//   JS -> PS : { id, ok:true, kind:"quill", metadata, schema, blueprint, supportedFormats }
//
//   PS -> JS : { id, type:"render",   format, markdown? }
//   JS -> PS : { id, ok:true, kind:"render", result:{ outputFormat, renderTimeMs, warnings, artifacts:[{format,mimeType,length,base64}] } }
//
//   PS -> JS : { id, type:"validate", markdown? }
//   JS -> PS : { id, ok:true, kind:"validate", diagnostics:[...] }
//
//   PS -> JS : { id, type:"info" }
//   JS -> PS : { id, ok:true, kind:"info", metadata, schema, blueprint, supportedFormats }
//
// Any failure -> { id, ok:false, error, diagnostics }. The page posts
// { type:"ready" } once loaded and forwards uncaught errors as { type:"error" }.
import { Quill, Document, Engine } from "@quillmark/wasm";

let quill = null;
const engine = new Engine();

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
    severity: d.severity ?? null,
    code: d.code ?? null,
    message: d.message ?? null,
    location: d.location ?? null,
    path: d.path ?? null,
    hint: d.hint ?? null,
  }));
}

function ensureQuill() {
  if (!quill) throw new Error("No quill loaded (send a loadQuill request first).");
}

function makeDoc(markdown) {
  return markdown != null && markdown !== ""
    ? Document.fromMarkdown(markdown)
    : quill.seedDocument();
}

async function handleLoadQuill(req) {
  quill = Quill.fromTree(treeFromBase64(req.tree));
  const supportedFormats = await engine.supportedFormats(quill);
  return {
    id: req.id,
    ok: true,
    kind: "quill",
    metadata: quill.metadata,
    schema: quill.schema,
    blueprint: quill.blueprint,
    supportedFormats,
  };
}

async function handleRender(req) {
  ensureQuill();
  const doc = makeDoc(req.markdown);
  const result = await engine.render(quill, doc, { format: req.format || "pdf" });
  return {
    id: req.id,
    ok: true,
    kind: "render",
    result: {
      outputFormat: result.outputFormat,
      renderTimeMs: result.renderTimeMs,
      warnings: serializeDiagnostics(result.warnings),
      artifacts: result.artifacts.map((a) => ({
        format: a.format,
        mimeType: a.mimeType,
        length: a.bytes.length,
        base64: base64FromBytes(a.bytes),
      })),
    },
  };
}

function handleValidate(req) {
  ensureQuill();
  let doc;
  try {
    doc = makeDoc(req.markdown);
  } catch (e) {
    // A parse failure IS the validation result — surface its diagnostics.
    const diags = e?.diagnostics?.length
      ? e.diagnostics
      : [{ severity: "error", message: String(e?.message || e) }];
    return { id: req.id, ok: true, kind: "validate", diagnostics: serializeDiagnostics(diags) };
  }
  return { id: req.id, ok: true, kind: "validate", diagnostics: serializeDiagnostics(quill.validate(doc)) };
}

async function handleInfo(req) {
  ensureQuill();
  const supportedFormats = await engine.supportedFormats(quill);
  return {
    id: req.id,
    ok: true,
    kind: "info",
    metadata: quill.metadata,
    schema: quill.schema,
    blueprint: quill.blueprint,
    supportedFormats,
  };
}

if (window.chrome?.webview) {
  const post = (o) => window.chrome.webview.postMessage(JSON.stringify(o));

  window.chrome.webview.addEventListener("message", async (e) => {
    const req = e.data;
    const id = req?.id;
    try {
      let res;
      switch (req?.type) {
        case "loadQuill": res = await handleLoadQuill(req); break;
        case "render":    res = await handleRender(req); break;
        case "validate":  res = handleValidate(req); break;
        case "info":      res = await handleInfo(req); break;
        default:          res = { id, ok: false, error: "unknown request type: " + req?.type };
      }
      post(res);
    } catch (err) {
      post({
        id,
        ok: false,
        error: String(err?.message || err),
        diagnostics: serializeDiagnostics(err?.diagnostics),
      });
    }
  });

  window.addEventListener("unhandledrejection", (ev) =>
    post({ type: "error", error: "unhandledrejection: " + String(ev.reason?.message || ev.reason) })
  );
  window.addEventListener("error", (ev) =>
    post({ type: "error", error: "error: " + String(ev.message) })
  );

  post({ type: "ready" });
}

window.__bridgeReady = true;

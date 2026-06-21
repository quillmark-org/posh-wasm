// Drives the built bundle in headless Edge (the WebView2 Chromium engine) to
// prove @quillmark/wasm renders a quill in a browser context — no Node runtime
// inside the page. Serves dist/ statically, loads it, posts the taro tree in,
// renders to PDF, asserts the %PDF header.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";

const DIST = new URL("./dist/", import.meta.url).pathname.replace(/^\//, "");
const QUILL = process.argv[2];
if (!QUILL) { console.error("usage: node drive.mjs <quillDir>"); process.exit(2); }

const MIME = { ".html": "text/html", ".js": "text/javascript", ".wasm": "application/wasm", ".css": "text/css" };

// Build path->base64 tree of the quill.
function treeBase64(dir) {
  const out = {};
  (function walk(cur) {
    for (const n of readdirSync(cur)) {
      const full = join(cur, n);
      if (statSync(full).isDirectory()) walk(full);
      else out[relative(dir, full).split(sep).join("/")] = readFileSync(full).toString("base64");
    }
  })(dir);
  return out;
}

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  try {
    const buf = readFileSync(join(DIST, p));
    const ext = p.slice(p.lastIndexOf("."));
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    res.end(buf);
  } catch {
    res.statusCode = 404; res.end("nf");
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`http://localhost:${port}/index.html`);
await page.waitForFunction(() => window.__bridgeReady === true, { timeout: 30000 });
console.error("bridge ready in Edge:", await browser.version());

const tree = treeBase64(QUILL);
const result = await page.evaluate(async (t) => await window.renderQuill(t, { format: "pdf" }), tree);

const a = result.artifacts[0];
const bytes = Buffer.from(a.base64, "base64");
const header = bytes.subarray(0, 5).toString("ascii");
writeFileSync("edge-render.pdf", bytes);
console.error(JSON.stringify({
  metadata: result.metadata,
  outputFormat: result.outputFormat,
  renderTimeMs: result.renderTimeMs,
  warnings: result.warnings.length,
  artifactBytes: bytes.length,
  pdfHeader: header,
  validPdf: header === "%PDF-",
  pageErrors: errors,
}, null, 2));

await browser.close();
server.close();

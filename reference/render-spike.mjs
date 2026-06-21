// Spike: prove end-to-end quill render via @quillmark/wasm in Node.
// Loads a quill directory tree from disk, builds it, seeds a document,
// renders to PDF, and writes the bytes out.
//
// Usage: node render-spike.mjs <quillDir> <outFile> [markdownFile]
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { Quill, Document, Engine } from "@quillmark/wasm";

function loadTree(dir) {
  // Build Record<string, Uint8Array> keyed by "/"-joined relative paths.
  const tree = {};
  function walk(cur) {
    for (const name of readdirSync(cur)) {
      const full = join(cur, name);
      if (statSync(full).isDirectory()) walk(full);
      else {
        const rel = relative(dir, full).split(sep).join("/");
        tree[rel] = new Uint8Array(readFileSync(full));
      }
    }
  }
  walk(dir);
  return tree;
}

const [, , quillDir, outFile, mdFile] = process.argv;
if (!quillDir || !outFile) {
  console.error("usage: node render-spike.mjs <quillDir> <outFile> [markdownFile]");
  process.exit(2);
}

const tree = loadTree(quillDir);
console.error("tree keys:", Object.keys(tree));

const quill = Quill.fromTree(tree);
console.error("quill:", JSON.stringify(quill.metadata));
console.error("backendId:", quill.backendId);

const doc = mdFile
  ? Document.fromMarkdown(readFileSync(mdFile, "utf8"))
  : quill.seedDocument();
console.error("seeded markdown:\n" + doc.toMarkdown());

const engine = new Engine();
const formats = await engine.supportedFormats(quill);
console.error("supportedFormats:", formats);

const result = await engine.render(quill, doc, { format: "pdf" });
console.error("renderTimeMs:", result.renderTimeMs, "warnings:", result.warnings.length);
console.error("artifacts:", result.artifacts.map((a) => `${a.format}/${a.mimeType}/${a.bytes.length}B`));

writeFileSync(outFile, Buffer.from(result.artifacts[0].bytes));
console.error("wrote:", outFile);

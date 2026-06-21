~~~
$quill: usaf_memo
$kind: main

letterhead_caption:
  - HEADQUARTERS AIR EDUCATION AND TRAINING COMMAND
memo_for:
  - AETC/CC
memo_from:
  - 12 FTW/CC
  - 12th Flying Training Wing
  - 1 Wing Way
  - Randolph AFB TX 78150-4521
subject: Rendering the usaf_memo Quill with posh-wasm
signature_block:
  - "JANE Q. PUBLIC, Col, USAF"
  - Commander
references:
  - "AFH 33-337, *The Tongue and Quill*"
classification: UNCLASSIFIED
~~~

This file is a complete, renderable `usaf_memo` document. Render it to PDF from PowerShell with `Invoke-QuillRender -QuillPath .\usaf_memo\0.2.0 -OutputPath .\memo.pdf -MarkdownPath .\memo_example.md`. Top-level paragraphs like this one are auto-numbered; do not add your own numbers.

A Quillmark document is Markdown with a `~~~`-fenced metadata block on top. The block opens with the two system lines `$quill` and `$kind`, then sets the quill's fields (`memo_for`, `subject`, `signature_block`, and so on). Field names and allowed values come straight from the schema in `usaf_memo\0.2.0\Quill.yaml`.

Everything below the closing `~~~` is the memo body, written in plain Markdown:

- Nested bullets are automatically lettered, like this line.
- Use `*asterisks*` for italics, as in the reference above.

Omit the `memo_from` block entirely to produce a Memorandum for Record. To render SVG or PNG instead of PDF, add `-Format svg` (or `png`); those formats emit one artifact per page as `memo-1.svg`, `memo-2.svg`, and so on. The signature block declared in the metadata renders automatically beneath this paragraph.

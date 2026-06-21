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

This file is both a complete `usaf_memo` document and a short tour of the posh-wasm module. Import the module with `Import-Module .\quillmark.psd1`, then render this file to PDF with `Export-QuillDocument -QuillPath .\usaf_memo -OutputPath .\memo.pdf -MarkdownPath .\memo_example.md`. For your very first run you can skip the document entirely: omit `-MarkdownPath` and the quill's seeded starter is rendered instead. Top-level paragraphs like this one are auto-numbered; do not add your own numbers.

A Quillmark document is Markdown with a `~~~`-fenced metadata block on top. The block opens with the two system lines `$quill` and `$kind`, then sets the quill's fields (`memo_for`, `subject`, `signature_block`, and so on). To discover which fields a quill accepts, ask the module rather than reading YAML by hand: `(Get-Quill .\usaf_memo).Fields` lists every field with its type and default, and `(Get-Quill .\usaf_memo).SupportedFormats` confirms it can emit pdf, svg, and png.

Validate a document before you render it with `Test-QuillDocument -QuillPath .\usaf_memo -MarkdownPath .\memo_example.md`, which reports `IsValid` without writing a file. To generate many documents at once, pipe them through a single warm render host: `Get-ChildItem .\inbox\*.md | Export-QuillDocument -QuillPath .\usaf_memo -OutputDirectory .\out`.

Everything below the closing `~~~` is the memo body, written in plain Markdown:

- Nested bullets are automatically lettered, like this line.
- Use `*asterisks*` for italics, as in the reference above.

Omit the `memo_from` block entirely to produce a Memorandum for Record. Add `-Format svg` (or `png`) to emit images instead of PDF; those formats produce one artifact per page, named `memo-1.svg`, `memo-2.svg`, and so on. The signature block declared in the metadata renders automatically beneath this paragraph.

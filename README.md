# quillmark (PowerShell module)

Turn Markdown into finished, correctly formatted administrative documents — PDFs (or SVG/PNG) — straight from PowerShell. Formatting comes from a **quill**: a ready-made template such as `usaf_memo` (a U.S. Air Force / Space Force official memorandum). You write the content; the quill handles the layout.

Everything runs offline on Windows with no extra dependencies. Ideal for scripting or scheduling batches of routine paperwork on restricted environments.

> The PowerShell module is named **quillmark**. (The Git repo is `posh-wasm`.)

Maintained by [TTQ](https://tonguetoquill.com/).

## What you need

- Windows with **PowerShell 5.1 or 7**.
- The **Microsoft Edge WebView2 Runtime** — already present on Windows 11 and any PC with a current version of Edge. (If it's missing, the command tells you and links the free installer.)
- This module, plus a **quill** (the template). The examples use `usaf_memo`, a sample included in the **repo** — clone or download it to follow along, or point `-QuillPath` at your own quill. The Gallery package is the engine only; it doesn't bundle quills.

## Install

Two supported ways — both run fully offline once installed.

**From the PowerShell Gallery**

```powershell
Install-Module quillmark
Import-Module quillmark
```

**From a clone or downloaded copy of the repo**

```powershell
git clone https://github.com/quillmark-org/posh-wasm
Import-Module .\posh-wasm\quillmark.psd1
```

## Make your first PDF

If you cloned or downloaded the repo, the `usaf_memo` sample renders right away (referenced by name from the repo folder):

```powershell
Export-QuillDocument -QuillPath usaf_memo -OutputPath .\memo.pdf
```

If you installed from the Gallery, point `-QuillPath` at your own quill folder:

```powershell
Export-QuillDocument -QuillPath C:\quills\my_letter -OutputPath .\memo.pdf
```

The remaining examples use `usaf_memo` for concreteness — substitute your quill.

## Write your own memo

A document is a small **metadata block** (the fields the quill needs) followed by the **body**, saved as a `.md` text file:

```text
~~~
$quill: usaf_memo
$kind: main
memo_for:
  - AETC/CC
subject: Quarterly Training Summary
signature_block:
  - "JANE Q. PUBLIC, Col, USAF"
  - Commander
~~~

This is the first paragraph of the memo. Paragraphs are numbered automatically.
```

Render it:

```powershell
Export-QuillDocument -QuillPath usaf_memo -OutputPath .\memo.pdf -MarkdownPath .\my-memo.md
```

See **`memo_example.md`** in this repo for a complete, annotated memo.

### Which fields can I set?

Ask the quill instead of guessing. Fields without a default are the ones you'll usually want to fill:

```powershell
(Get-Quill usaf_memo).Fields |
    Where-Object { -not $_.HasDefault } |
    Format-Table Name, Type, Description
```

## Automate a batch

This is the main event. Point a folder of memo files at a folder of PDFs — one line, one pass:

```powershell
Get-ChildItem .\memos\*.md |
    Export-QuillDocument -QuillPath usaf_memo -OutputDirectory .\out
```

The engine starts once and is reused for the whole batch, so large runs stay fast. Drop this into a script or a Scheduled Task for unattended generation.

**Check before you commit to a big run** — list only the files that have problems, without rendering anything:

```powershell
Get-ChildItem .\memos\*.md |
    Test-QuillDocument -QuillPath usaf_memo |
    Where-Object { -not $_.IsValid }
```

## The three commands

| Command | What it does |
|---|---|
| `Export-QuillDocument` | Render document(s) to file(s). `-OutputPath` for one, `-OutputDirectory` for a batch (pipe files in). `-Format pdf\|svg\|png`. With no markdown, renders the quill's example. |
| `Get-Quill` | Inspect a quill: `.SupportedFormats`, `.Fields`, `.Blueprint`, and identity (name/version). |
| `Test-QuillDocument` | Validate document(s) without rendering. `IsValid` tells you it will render; `Diagnostics` explains any problems. |

(`Invoke-QuillRender` still works as an alias of `Export-QuillDocument`.)

## Output formats

`-Format pdf` (default), `svg`, or `png`. PDF is a single file. SVG and PNG produce **one file per page**, named `memo-1.svg`, `memo-2.svg`, and so on.

## If something goes wrong

- **"WebView2 Runtime not found"** — install the free [Evergreen WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) and try again.
- **A document is rejected** — the error names the field or line at fault. Run `Test-QuillDocument` on it to see the full list of issues.

---

Building from source, rebuilding the bundle, or publishing a release? See [CONTRIBUTING.md](CONTRIBUTING.md).

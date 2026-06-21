# quillmark (PowerShell Module)

[![PowerShell Gallery](https://img.shields.io/powershellgallery/v/quillmark?label=PowerShell%20Gallery)](https://www.powershellgallery.com/packages/quillmark)

Turn Markdown into finished, correctly formatted administrative documents — PDFs (or SVG/PNG) — straight from PowerShell. Formatting comes from a **quill**: a ready-made template such as `usaf_memo` (a U.S. Air Force / Space Force official memorandum). You write the content; the quill handles the layout.

Everything runs offline on Windows with no extra dependencies. Ideal for scripting or scheduling batches of routine paperwork on restricted environments.

Maintained by [TTQ](https://tonguetoquill.com/).

## What you need

- Windows with **PowerShell 5.1 or 7** and the **WebView2 Runtime** — already on most PCs; if missing, the cmdlets link the free installer.
- This module; the `usaf_memo` quill used in the examples is bundled (`Get-Quill` lists all bundled quills).

## Install

```powershell
Install-Module quillmark
Import-Module quillmark
```

## Make your first PDF

The `usaf_memo` quill is bundled, so this works right after install — it writes `usaf_memo.pdf` to the current folder:

```powershell
Export-QuillDocument -Quill usaf_memo
```

Add `-OutputPath` to choose the file, list the bundled quills with `Get-Quill`, or use one of your own by passing a folder path:

```powershell
Get-Quill                                                  # bundled quills
Export-QuillDocument -Quill C:\quills\my_letter -OutputPath .\letter.pdf
```

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
Export-QuillDocument -Quill usaf_memo -OutputPath .\memo.pdf -MarkdownPath .\my-memo.md
```

### Which fields can I set?

Ask the quill instead of guessing. Fields without a default are the ones you'll usually want to fill:

```powershell
(Get-Quill usaf_memo).Fields |
    Where-Object { -not $_.HasDefault } |
    Format-Table Name, Type, Description
```

## The three commands

| Command | What it does |
|---|---|
| `Export-QuillDocument` | Render document(s) to file(s). `-OutputPath` for one, `-OutputDirectory` for a batch (pipe files in). `-Format pdf\|svg\|png`. With no markdown, renders the quill's example. |
| `Get-Quill` | No args: list the bundled quills. With a name/path: inspect one (`.SupportedFormats`, `.Fields`, `.Blueprint`, identity). |
| `Test-QuillDocument` | Validate document(s) without rendering. `IsValid` tells you it will render; `Diagnostics` explains any problems. |

## Output formats

`-Format pdf` (default), `svg`, or `png`. PDF is a single file. SVG and PNG produce **one file per page**, named `memo-1.svg`, `memo-2.svg`, and so on.

## If something goes wrong

- **"WebView2 Runtime not found"** — install the free [Evergreen WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) and try again.
- **A document is rejected** — the error names the field or line at fault. Run `Test-QuillDocument` on it to see the full list of issues.

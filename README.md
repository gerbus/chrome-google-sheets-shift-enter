# Sheets Shift+Enter Newline

Makes Shift+Enter insert a newline in a Google Sheets cell editor (native Sheets needs Cmd/Ctrl+Enter).
Content script only; no background worker, no permissions beyond the `https://docs.google.com/spreadsheets/*` match.

## Install
1. `chrome://extensions` > enable Developer mode > **Load unpacked** > select this folder.
2. Reload any open Sheets tabs. After editing `content.js`, click the reload icon on the extension, then reload the tab
   (content scripts only inject into pages loaded after the extension loads).

## How it works
A capture-phase `keydown` listener on `window` catches plain Shift+Enter (no ctrl/meta/alt) while a cell editor is
focused and visible, calls `preventDefault()` and `stopImmediatePropagation()`, then inserts a newline with
`document.execCommand("insertLineBreak")`. Otherwise it does nothing, so native behavior is untouched.

## Verified (manual testing, Chrome on macOS, Oct 2026)
- The editor is `div#waffle-rich-text-editor.cell-input`. When idle it sits offscreen (`y=-9998`, width 0, `role=textbox`).
  When active it gains the `editable` class and `role=combobox`. The extension matches `div.cell-input.editable`.
- `insertLineBreak` saves a real newline: `=CODE(MID(A1,2,1))` returns 10.
- Works in the in-cell editor and in the formula bar.
- Cmd+Z while editing undoes per character, including the newline. After commit it undoes the cell change.
- With a cell selected but not editing, Shift+Enter behaves exactly as without the extension: a single cell
  enters edit mode (native), and a multi-cell selection cycles upward.

## Not tested
- `insertText "\n"` and the Range+`<br>` fallbacks (kept as fallbacks in `INSERT_ORDER`, never needed).
- Windows/Linux, other browsers, IME composition, autocomplete popups.
- Which selector the formula bar matches (it works, but the `#t-formula-bar-input` entry is an unverified guess).
- `keyup`/`keypress` are not intercepted.

## License
Dual license, see [LICENSE.md](LICENSE.md). Free for personal, non-commercial use. Commercial use requires a paid
license (annual or one-time); contact the address in LICENSE.md.

## If Google changes the DOM
All selectors and strategies live in `CONFIG` at the top of `content.js`. Set `DEBUG: true`, reload the extension and tab,
and press Shift+Enter in a cell. The console logs the matched element (class, rect, role, ancestor chain) or `no editor match`.
Compare the idle and editing dumps to find the new distinguishing attribute.

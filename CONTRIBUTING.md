# Contributing

## Run it locally
1. `chrome://extensions` > enable Developer mode > **Load unpacked** > select this folder.
2. Reload any open Sheets tabs. After editing `content.js`, click the reload icon on the extension, then reload the tab
   (content scripts only inject into pages loaded after the extension loads).

## How it works
A capture-phase `keydown` listener on `window` catches plain Shift+Enter (no ctrl/meta/alt) while a cell editor is
focused and visible, calls `preventDefault()` and `stopImmediatePropagation()`, then inserts a newline with
`document.execCommand("insertLineBreak")`. Otherwise it does nothing, so native behavior is untouched.

It does not dispatch a synthetic Cmd+Enter: synthetic events are untrusted (`isTrusted=false`) and Sheets may ignore them.

## What was verified (manual testing, Chrome on macOS, Oct 2026)
- The editor is `div#waffle-rich-text-editor.cell-input`. When idle it sits offscreen (`y=-9998`, width 0, `role=textbox`).
  When active it gains the `editable` class and `role=combobox`. The extension matches `div.cell-input.editable`.
- `insertLineBreak` saves a real newline: `=CODE(MID(A1,2,1))` returns 10.
- Works in the in-cell editor and in the formula bar.
- Cmd+Z while editing undoes per character, including the newline. After commit it undoes the cell change.
- With a cell selected but not editing, Shift+Enter behaves exactly as without the extension: a single cell
  enters edit mode (native), and a multi-cell selection cycles upward.

## Not tested
- Windows/Linux, other browsers, IME composition, autocomplete popups.
- Which selector the formula bar matches (it works, but the `#t-formula-bar-input` entry is an unverified guess).
- `keyup`/`keypress` are not intercepted.

## Manual test checklist
1. Type `a`, Shift+Enter, `b`, Enter. With wrap on, the cell shows two lines.
2. In another cell, `=CODE(MID(A1,2,1))` returns 10.
3. With a cell selected but not editing, Shift+Enter behaves as it does with the extension disabled.
4. Repeat 1 in the formula bar.
5. Cmd+Z after the break undoes per character while editing, and the whole cell change after commit.

## If Google changes the DOM
All selectors live in `CONFIG` at the top of `content.js`. Set `DEBUG: true`, reload the extension and tab,
and press Shift+Enter in a cell. The console logs the matched element (class, rect, role, ancestor chain) or `no editor match`.
Compare the idle and editing dumps to find the new distinguishing attribute. Set `DEBUG` back to `false` before committing.

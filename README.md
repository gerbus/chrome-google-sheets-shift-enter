# Google Sheets Shift+Enter Newline

![Google Sheets Shift+Enter Newline icon](icons/icon128.png)

**A Chrome extension that makes Shift+Enter insert a new line inside a Google Sheets cell.**

You're typing in a cell, you press Shift+Enter for a line break, the way it works in nearly every other app, and Google
Sheets commits your edit, drops you out of the cell, and jumps the selection up to the row above. Shift+Enter is the
near-universal "new line without sending" shortcut in chat apps, text editors, and other web apps, but Sheets has never
supported it for line breaks. Its own shortcut is Cmd+Enter on Mac and Ctrl+Enter on Windows, which few people guess.

This extension fixes that. With it installed, Shift+Enter adds a line break inside the cell you're editing, in the cell
editor and in the formula bar, and nothing else about Sheets changes.

## Install
Install from the Chrome Web Store, then reload any open Google Sheets tabs.

## Usage
While editing a cell (double-click it, or press Enter), or while typing in the formula bar, press **Shift+Enter** to
insert a line break. Turn on **Wrap text** (Format > Wrapping > Wrap) to see the lines.

When you aren't editing a cell, Shift+Enter does exactly what it always did.

## FAQ

**How do I add a new line in a Google Sheets cell?**
Natively, press Cmd+Enter (Mac) or Ctrl+Enter (Windows) while editing the cell. With this extension, Shift+Enter works too.

**Why does Shift+Enter move up a row in Google Sheets instead of adding a line break?**
In Sheets, Shift+Enter means "commit and move up", the reverse of Enter. It isn't a line break shortcut. This extension
changes that only while you're editing a cell.

**Does Alt+Enter work in Google Sheets like it does in Excel?**
No. Alt+Enter is Excel's line break shortcut. Google Sheets uses Cmd/Ctrl+Enter, or Shift+Enter with this extension.

**Is the line break a real newline?**
Yes. `=CODE(MID(A1,2,1))` on a cell containing `a`, a line break, and `b` returns 10, the standard newline character, so
`SPLIT`, `CHAR(10)`, and exports treat it normally.

**Does it work in the formula bar?**
Yes.

**Does it work on Windows or in other browsers?**
It's expected to work on Windows. The code uses nothing Mac-specific: it listens for Shift+Enter via standard
keyboard event properties and inserts the line break with the browser's own editing command. It was only tested on Chrome
for macOS, though, so Windows is unconfirmed. Other Chromium-based browsers should work too, also untested.

## Privacy
Runs only on `https://docs.google.com/spreadsheets/*`. It requests no permissions, makes no network requests, and
collects no data.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development, testing, and what to do if Google changes Sheets.

## License
Dual license, see [LICENSE.md](LICENSE.md). Free for personal, non-commercial use. Commercial use requires a paid
license (annual or one-time); contact the address in LICENSE.md.

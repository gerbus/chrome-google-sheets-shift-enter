// Shift+Enter -> newline in the Google Sheets cell editor.
// ALL selectors/strategies are UNVERIFIED against the live DOM (see README).

// ---- Things Google may change -------------------------------------------
const CONFIG = {
  // Candidate editor elements (in-cell editor and formula bar). Tried in order
  // against document.activeElement via .closest().
  EDITOR_SELECTORS: [
    // Verified: idle editor is "cell-input" (offscreen, 0 width); the active one adds "editable".
    "div.cell-input.editable[contenteditable='true']",
    "#t-formula-bar-input [contenteditable='true']", // formula bar (unverified guess)
  ],
  // Insertion strategies, tried in order until one reports success.
  // Reorder after running the harness in the README.
  INSERT_ORDER: ["insertLineBreak", "insertText", "rangeBr"],
  DEBUG: false,
};
// --------------------------------------------------------------------------

const log = (...a) => CONFIG.DEBUG && console.log("[shift-enter]", ...a);

function findActiveEditor() {
  const el = document.activeElement;
  if (!el) return null;
  for (const sel of CONFIG.EDITOR_SELECTORS) {
    const ed = el.closest(sel);
    // Sheets may keep a hidden editable around while not editing; require it
    // to actually be rendered.
    if (ed && ed.getBoundingClientRect().width > 0) return ed;
  }
  return null;
}

// Debug aid: dump what distinguishes "editing" from "selected, not editing".
function describe(ed) {
  if (!ed) return log("no editor match; activeElement =", document.activeElement);
  const r = ed.getBoundingClientRect();
  const chain = [];
  for (let n = ed; n && n !== document.body; n = n.parentElement) {
    const s = getComputedStyle(n);
    chain.push(`${n.tagName.toLowerCase()}#${n.id}.${n.className} [vis=${s.visibility} disp=${s.display} op=${s.opacity} ariaHidden=${n.getAttribute("aria-hidden")}]`);
  }
  log("editor match", {
    text: JSON.stringify(ed.textContent),
    rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`,
    ce: ed.getAttribute("contenteditable"),
    role: ed.getAttribute("role"),
    chain,
  });
}

const STRATEGIES = {
  insertLineBreak: () => document.execCommand("insertLineBreak"),
  insertText: () => document.execCommand("insertText", false, "\n"),
  rangeBr: () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const br = document.createElement("br");
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  },
};

function insertNewline() {
  for (const name of CONFIG.INSERT_ORDER) {
    try {
      if (STRATEGIES[name]()) {
        log("inserted via", name);
        return true;
      }
    } catch (e) {
      log(name, "threw", e);
    }
  }
  return false;
}

window.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "Enter" || !e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.isComposing) return;
    const editor = findActiveEditor();
    if (CONFIG.DEBUG) describe(editor);
    if (!editor) return; // not editing: let Sheets move selection up
    e.preventDefault();
    e.stopImmediatePropagation();
    insertNewline();
  },
  true
);

# Phase 3 — build notes and spec queries

MOCHI · Unit R-01, the floating bot's state machine, and the pixel cursor.

---

## 1. How MOCHI is built

§3.3 asks for SVG with `crispEdges` and unit squares, animated by swapping
groups rather than shipping a PNG per frame. So the sprite is **layers, not
drawings**: a constant body, plus one choice each from ears, eyes, arms and an
accessory. Every state in the §3.2 table is a combination of those four slots,
which is why a new pose costs a line rather than a new sprite.

The art lives in `src/components/mochi/pixelMaps.ts` as readable pixel rows.
Rows are built with a `span()` helper rather than typed as literal strings —
hand-counting 24 characters per row is how pixel art quietly goes crooked.

Layers are flattened and run-length encoded before rendering, so a sprite is
about 60 `<rect>`s instead of ~400.

**All nine §3.2 states are implemented**, plus the S00 ear-tilt and the S12
adrift pose. They're all on `/styleguide` under "MOCHI · Unit R-01", with
buttons to fire the two form states.

## 2. How the cursor is built

§4.1 asks for `cursor: url('/cursors/arrow.png')`. Shipping PNGs would have
meant binary assets that can't follow the theme, so each cursor is **drawn on
a canvas at runtime and exported as a data URL** instead. Same result, no
extra requests (§10), and it recolours when the theme flips.

SVG cursors were the other option and were rejected: Safari's support for
`cursor: url(*.svg)` is unreliable, and a cursor that fails to load leaves the
visitor with an invisible pointer — exactly what §4.1 warns against.

All seven states from the §4.1 table exist: default, interactive, text, grab,
grabbing, disabled, and the 4-frame hourglass (which only cycles while
something on the page is `aria-busy`).

### The three guards, all verified

| Guard | Verified |
|---|---|
| `pointer: coarse` disables the custom cursor entirely | at 375px with touch emulation: `cursorReady` false, `body` cursor back to `auto` |
| reduced motion kills the trail, keeps the cursor | trail `display: none`, `cursorReady` still true |
| the §4.5 settings toggle turns it all off | custom properties cleared, `body` cursor `auto` |

There's a fourth safeguard the spec doesn't ask for but needs: the CSS is gated
on `data-cursor-ready`, which the component only sets **after** the images
generate successfully. If JS is off, the canvas is blocked, or `toDataURL`
throws, nothing applies and the visitor keeps a working system pointer. Every
declaration also ends in a real keyword fallback (`, auto`, `, pointer`) as
§4.1 requires.

---

## 3. Spec conflicts and decisions

**The bot has two different sizes in §3.2.** The header says "56px mobile /
72px desktop"; the `mobile` row of the same table says "shrinks to 48px" under
768px. Those can't both be right. Built as **56px under 768, 80px at and above**
— 56 keeps the sprite legible at a 4px-per-art-pixel multiple, and 80 gives the
same on desktop. Easy to change if you meant 48.

**MOCHI's lowercase rule is about writing, not rendering.** §13 says MOCHI
speaks in lowercase. I first implemented that as a `text-transform`, which
turned §3.2's own copy — "my favourite one is EcoFootPrint" — into
"ecofootprint". The transform is gone; the copy is simply written lowercase
except where it names something. Worth knowing before Phase 7 adds more lines.

**The bot's placement vs. the mobile dock.** §3.2 puts the bot bottom-right
and §4.4 puts the dock along the bottom. The bot now sits above the dock
(`72px + safe-area`), clearing it by 14px at 375×812. Neither section mentions
the other.

**The 404 hides the floating bot.** §3.1 gives S12 its own MOCHI floating away
on a snapped cable, and §3.2 says the bot is persistent "from S01 onward". Two
MOCHIs on one page reads as a bug rather than a joke, so the 404 shows only the
adrift one.

**The résumé item in the quick nav.** §3.2 lists "Résumé (PDF)" as one of the
five. The file still isn't in the repo, so it renders disabled as "Résumé —
coming soon" and is skipped by arrow-key navigation, consistent with §S01's
edge case.

---

## 4. Accessibility notes

- The bot is `<button aria-haspopup="menu" aria-expanded aria-label="Open quick
  navigation">`, exactly as §3.2 specifies. Verified: 5 menu items, focus moves
  into the menu on open, Esc closes it and returns focus to the bot.
- **Ambient bubbles are `aria-hidden`.** Only `form-success` and `form-error`
  get `role="status"` / `aria-live="polite"`, per §3.2 — otherwise a screen
  reader would announce "need a hand?" every time the pointer drifted past.
- Every sprite is `aria-hidden` unless a caller passes a title. MOCHI never
  carries meaning that isn't also in nearby text.
- Audit with the bot menu *and* settings menu both open: 516 elements,
  0 rounded corners, 0 blurred shadows, 0 gradients outside the dither,
  0 touch targets under 44×44.

---

## 5. Testing caveat, again

The in-app browser pane still reports `document.hasFocus() === false`, so
`element.focus()` never dispatches `focusin`. That made the §3.2
mobile-keyboard edge case look broken; firing the event directly showed the
listener works (bot hides on field focus, returns on blur). The same
limitation means the hover state and the cursor trail's spring could not be
exercised here.

**Worth a manual pass in a real browser** for: the trail's 120ms lag and 4px
snapping, the hover wave, and the cursor art at actual pointer size.

---

## 6. Still open, needs Ruby

- The focus-ring colour decision from `PHASE-1-NOTES.md` §1c.
- LinkedIn handle, résumé PDF.
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.
- Whether the Sound toggle should stay visible before anything uses it.

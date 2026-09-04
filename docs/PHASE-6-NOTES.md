# Phase 6 — build notes and spec queries

S00, the airlock. Built last, so it opens onto a site that already exists: the
hero renders underneath the whole time and the wipe simply uncovers it.

---

## 1. The flood needed the text clipped, not just the background

§S00's signature moment is one half's palette flooding across the seam into
the other. Built the obvious way — move a `clip-path` on the background, swap
the door's ink to match — it has a real defect: the ink changes instantly
while the background takes 400ms, so for that whole 400ms the far door is
**moss-100 on paper, which measures 1.06:1**. Unreadable, in the first thing
anyone sees.

The fix is the standard technique for this effect: render the doors **twice**,
stacked in the same box. The real interactive set is inked for night; a
decorative copy inked for day is clipped to *exactly the same edge* as the day
background. The labels therefore change colour at the flood edge itself rather
than all at once, and no frame of the animation is ever illegible.

Verified by freezing the flood at 70%: "NIGHT SIDE" renders split mid-word,
navy on the paper side and moss on the navy side.

The copy is `aria-hidden` with `pointer-events: none` and renders spans rather
than buttons, so it adds no second tab stop — confirmed: 2 real buttons in the
door layer, 0 in the ghost layer.

---

## 2. Other bugs found and fixed

**The gate looked different depending on the visitor's system theme.** The
seam and the idle-half overlays used the base `.dither` class, which inks with
`var(--line)` — a theme-mapped token. On a dark-theme machine the seam came
out moss, on light it came out navy. The airlock deliberately shows both
palettes at once, so it now uses `.dither-ink` with explicit core-token values
and looks the same either way.

**Two `<h1>`s.** The airlock's prompt was an `<h1>` while the hero's `<h1>` was
still in the DOM behind it, which breaks §9's "one `h1`" rule. The dialog
already carries `aria-label="Choose your theme to enter"`, so the prompt is a
`<p>` now.

**Focus was triggering the flood.** §S00 lists hover and focus-visible as
separate states, and autofocusing the door matching `prefers-color-scheme` was
kicking off a full flood on load. Focus now moves focus only.

**`ref` as a plain prop, again.** Same React 18 issue I hit in S06 — caught it
before it shipped this time. `Door` uses `forwardRef`, without which the
airlock could not focus a door for either autofocus or the arrow keys.

---

## 3. Both bypasses, verified

| Case | Result |
|---|---|
| Returning visitor (`r-theme` set) | gate skipped, stored theme applied, no second gating |
| Deep link `/#work` | gate skipped even with no stored theme; scrolled to 7818px |

Both are decided **once**, from a snapshot taken before the gate can change
anything — otherwise selecting a theme would write `r-theme` and unmount the
gate mid-wipe.

---

## 4. The rest of §S00

- **Keyboard**: `←`/`→` move between doors, `Enter`/`Space` selects (native
  button behaviour), `Esc` skips. Tab is trapped inside the gate — `inert` on
  header/main/footer is not enough on its own, because the skip link sits
  outside all three.
- **Skip does not persist.** "Use my system setting" means exactly that, so it
  applies the system theme without writing `r-theme` — a later visit still
  follows the system.
- **Reduced motion**: verified — transitions killed, no flood, no idle dither,
  and the reveal is a 100ms cross-fade instead of the 12-step wipe.
- **No-JS**: the gate is `display: none` by default and only shown once JS sets
  `data-airlock="open"` on `<html>`, per §S00. Nobody is held behind a door
  with nothing to open it.
- **Short viewport** (<500px tall): sub-labels hidden, sprite down to 40px,
  both doors still reachable.
- **The unmount is timer-driven**, not `animationend` — a dropped frame can
  never leave the gate stuck over the site.
- Contrast, all seven pairs: 13.24, 10.0, 13.70, 8.76, 13.70, 8.76, 4.94.
  Airlock scope, 161 elements: 0 rounded corners, 0 blurred shadows, 0
  gradients outside the dither, 0 touch targets under 44×44.

---

## 5. ⚠ A contradiction inside the spec, for Phase 8

§5 mandates **Vite + React**, a client-rendered SPA. §8 requires that with
**JS disabled, "all content still readable"**, and §15's fourth acceptance
test repeats it.

Those cannot both hold. With JS off, a Vite React SPA serves an empty
`<div id="root">` — not just the airlock but the entire site is blank. S00's
own no-JS handling is done and correct, but it only protects against the gate;
it cannot make the site render.

Satisfying §8 needs prerendering — a build-time static render of the routes
(`vite-plugin-ssr`, `react-snap`, or moving to a framework that does SSG).
That is a Phase 8 decision with real cost, so flagging it now rather than at
the end:

1. **Prerender** — genuinely satisfies §8/§15, adds a build step.
2. **Add a `<noscript>` fallback** with the core content — partial credit,
   much cheaper, honest.
3. **Accept the deviation** and record it in `SCOPE.md` alongside the
   backend decision.

I'd suggest 2 unless you want the acceptance test to pass literally. Tell me
which and I'll do it in Phase 8.

---

## 6. Still open, needs Ruby

- **Case study copy** for the four projects (`PHASE-5-NOTES.md` §1) — still the
  biggest gap.
- The no-JS decision above.
- The BSc progress percentage (`PHASE-4-NOTES.md`) — currently a guess.
- The focus-ring colour decision (`PHASE-1-NOTES.md` §1c).
- LinkedIn handle; the résumé PDF.
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.

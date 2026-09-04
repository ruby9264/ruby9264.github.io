# Phase 5 — build notes and spec queries

S05 the pinned experience track, S06 the card deck and its case study overlay.

---

## 1. ⚠ The case study copy does not exist

§S06 specifies the overlay as **Problem · My Role · Process · Outcome · What
I'd do differently** — but the spec provides no copy for any of those five
headings, for any of the four projects. The only project prose it gives is the
overview paragraph.

Writing them would mean inventing claims about work Ruby actually did, and in
the case of "What I'd do differently", inventing her own reflections. So:

- `caseStudy` is an **empty optional field** on every project in
  `src/data/projects.ts`.
- The modal renders the verbatim overview under an "Overview" heading and
  simply omits any of the five sections that has no copy. It reads as a
  finished short case study rather than a broken long one.
- Fill in any of `problem`, `role`, `process`, `outcome`, `differently` and
  that section appears, in the spec's order, with no code changes.

**This is the one thing Phase 5 genuinely needs from you.** Four short
paragraphs per project would turn the overlay into what §S06 describes.

---

## 2. S05 — built in the order the spec demands

§S05 says to build the vertical fallback *first* and add the pin on top, and
it's right: the vertical stack is the real component and the default. The
pinned horizontal track only engages when **all** of these hold — viewport
≥1024px, fine pointer, motion allowed, and GSAP actually loaded. Anything else
lands on the vertical stack, which is a complete layout with a left rail and
numbered markers, not something that looks like a fallback.

Verified: with Motion set to Reduced, no pin-spacer is created, GSAP never
initialises, and the stack renders all four roles.

**Keyboard in a pinned section.** §S05 calls a pinned section that traps
keyboard users "a hard accessibility failure". Because the horizontal position
is a pure function of vertical scroll, arrow keys and focus both move the
*page* — `scrollToCard(i)` computes the vertical offset for card `i`. Tabbing
into a card scrolls it into view via `onFocusCapture`. Nothing is trapped
because nothing overrides the page's own scrolling.

**GSAP is dynamically imported**, so it splits into separate chunks and
**mobile never downloads it**. Only `gsap` and `gsap/ScrollTrigger` are
imported, per §10 — never the full plugin set. If the import throws, the
component falls back to the vertical stack rather than showing a broken track.

`ScrollTrigger.refresh()` runs on `document.fonts.ready` and on a 200ms
debounced resize, per §S05's edge cases, and Lenis is wired to
`ScrollTrigger.update` so the two scroll systems agree.

**MOCHI got a real walk cycle.** Legs are now their own layer slot alongside
ears, eyes and arms, with `stand`, `walkA` and `walkB` frames. The cycle runs
only while the scroll is moving and freezes to `stand` when it stops, as §S05
specifies.

---

## 3. S06 — the deck

Everything in §S06's interaction list is implemented: drag with rotation
proportional to distance, release past 25% of the card width to advance,
arrows and dots always visible and operable, dots as a `role="tablist"`,
`←`/`→` to change cards and `Enter` to open the case study. **No autoplay**,
by instruction.

The vertical-swipe guard is in: a gesture is only captured as a drag once
`|Δx| > |Δy| × 1.5`, so scrolling the page through the deck still works on
touch.

Card states from §S06 are all present — default, hover (6px shadow, 2px lift),
dragging (`data-grabbing`, which the Phase 3 cursor picks up), front, behind
(dithered, `inert`, `aria-hidden`), focus-visible.

**Every card uses the missing-cover fallback**, because no cover images exist:
a dither block with the project initial in Silkscreen, exactly as §S06's edge
case describes. Drop images into `cover` and they take over.

The modal locks body scroll with scrollbar-width compensation so nothing
shifts, stops Lenis, marks header/main/footer `inert`, traps Tab, closes on
Esc, and returns focus to the card that opened it.

---

## 4. Bug found and fixed

**`ProjectCard` took `ref` as a plain prop.** That's React 19 semantics; on
React 18 `ref` is not forwarded to a function component, so the deck could
never focus a card — meaning the "returns focus to the trigger card" behaviour
§S06 requires would silently fail. Converted to `forwardRef`.

---

## 5. What I could not test here

The in-app browser pane throttles `requestAnimationFrame` and reports
`document.hasFocus() === false`. That means:

- **The pin was never actually exercised.** ScrollTrigger initialises
  correctly (a `.pin-spacer` is created, the section measures 4820px for four
  cards), but `scrub: 1` catches up on GSAP's rAF ticker, which does not run
  here. The scrub, the walk cycle and the progress rail all need a real
  browser window.
- Focus assertions inside the modal report the body as `activeElement`
  because `.focus()` is a no-op without document focus. The focus *target*
  resolves correctly ("Close"), and Esc, scroll-lock restore and `inert`
  cleanup were all verified directly.

**Worth a manual pass** on: the S05 pin and scrub, drag on the deck with a
real pointer, and the case study's focus return.

---

## 6. Automated checks

Whole page, 1,934 elements: 0 rounded corners, 0 blurred shadows, 0 gradients
outside the dither, 0 touch targets under 44×44, one `h1`, no skipped heading
levels, all eight sections present and labelled.

Bundle: 89.4 KB main + 27.9 KB gsap + 18.3 KB ScrollTrigger gzipped. Worst
case 135.6 KB against §10's 200 KB budget, and the last two never load on
mobile.

---

## 7. Still open, needs Ruby

- **The case study copy** (§1 above) — the significant one.
- Cover images for the four projects, if you want them.
- The BSc progress percentage from `PHASE-4-NOTES.md` — currently a guess.
- The focus-ring colour decision from `PHASE-1-NOTES.md` §1c.
- LinkedIn handle; the résumé PDF.
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.

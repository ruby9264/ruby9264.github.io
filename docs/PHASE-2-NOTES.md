# Phase 2 — build notes and spec queries

The shell: nav, mobile dock, settings, footer skeleton, scroll-spy, Lenis,
routing and the 404.

---

## 1. Decisions taken from the pre-build flags

All five were flagged before building and went in as proposed.

**Dock order follows the document, not §4.4.** §4.4 lists the slots as
Home · Work · Skills · About · Contact, but §6 puts About at S03, Skills at S04
and Work at S06. In §4.4's order the scroll-spy indicator jumps backwards as you
scroll — About lights up *after* Work. The order is now Home · About · Skills ·
Work · Contact, in `src/data/nav.ts`. One array to reorder if you disagree.

**The home page has placeholder sections.** `#home`, `#about`, `#skills`,
`#work` and `#contact` exist with a line of scaffolding copy each, so docking,
scroll-spy and the dock indicator are testable now. **None of that copy is from
the spec** — Phase 4 replaces the contents of each `<Section>` in place.

**The nav docks immediately on routes without a hero.** §4.4's "on scroll past
100vh" only makes sense on the home page. On the 404 there's nothing to float
over, so the bar is opaque from the start.

**Motion is tri-state.** System · Full · Reduced, defaulting to System. §4.5
offers only Full/Reduced, but the OS preference is a third input and something
has to win. This also needed a change in `base.css`: the
`@media (prefers-reduced-motion: reduce)` block is now scoped to
`:root:not([data-motion='full'])`, otherwise an explicit "Full" could never
beat the media query and the control would be decorative.

**The Sound toggle ships, and controls nothing yet.** It persists and defaults
off, with the hint "Nothing plays sound yet. Audio never starts on its own."
Phase 7 reads it if UI blips happen.

---

## 2. Contrast failures found and fixed

Two new ones, both caught by extending the audit to Phase 2's surfaces.

**The dock's active-slot indicator was invisible.** §4.4 asks for a 4px
indicator bar on the active slot, and the active slot has an inverted `--brand`
fill. Amber on moss measures **1.96:1** light and **1.65:1** dark, against a 3:1
minimum. It now uses `--on-brand` (6.83 / 4.94). That also matters for §2.2:
amber on the dock would have been a fifth sitewide use against a cap of four.

**`--ink-mute` on `--bg-sunken` came back.** Phase 1 patched this narrowly with
`--ink-placeholder` for form placeholders. The footer sits on `--bg-sunken` too,
so its legal line hit the same **4.34:1**. Rather than keep adding aliases, the
light `--ink-mute` is now `#536251` (5.45 / 5.94 / 4.94 on bg / raised /
sunken), and `--ink-placeholder` is just an alias. `PHASE-1-NOTES.md` §1b is
updated to record the reversal.

**All 26 audited pairs now pass in both themes**, checked live on `/styleguide`.

---

## 3. Bugs found while testing

**Touch targets under 44×44** (§9). Four sets, all fixed: the `R` logo mark was
**8.8 × 21.4**, the desktop nav links were 43.6 tall, the settings toggles were
64 × 32, and the footer links were as small as 38 × 42. The toggle needed
restructuring — the button now carries the 44px hit area and an inner span
draws the 32px track, so the control looks unchanged.

**`requestAnimationFrame` in effects.** The styleguide's contrast table
populated inside a rAF callback. rAF is throttled to nothing in a backgrounded
tab, so the table rendered empty *and reported "All 0 pairs pass"* — a green
light for an audit that never ran. It measures synchronously now, and reports
"Audit did not run" rather than passing when it has no rows. The same hazard was
in the deep-link scroll in `SiteLayout`, now a `setTimeout`.

**Flash of the wrong theme.** `index.html` hardcoded `data-theme="light"` and
React corrected it after mount, so anyone on the dark theme got a light flash on
every load. There's now a small inline script that sets the theme (and any
forced motion setting) before first paint. It duplicates the logic in
`useSettings.tsx` — that's the standard trade for avoiding the flash, and both
sides carry a comment saying so.

---

## 4. Smaller notes

**Two `<nav>` elements share the label "Sections".** The desktop bar and the
mobile dock are both in the DOM at all times, but exactly one is `display: none`
at any breakpoint, so only one ever reaches the accessibility tree. Correct as
built, but worth knowing if the breakpoint logic ever changes.

**The résumé link is disabled.** `/public/R-Ruby-CV-2026.pdf` still isn't in the
repo, so §S01's edge case applies and the footer shows "Résumé (PDF) — coming
soon". Drop the file in and flip `RESUME_AVAILABLE` in `src/data/site.ts`.

**LinkedIn is still omitted** everywhere, per §12. Set `PROFILE.linkedin` in
`src/data/profile.ts` and it appears in the footer automatically.

**`public/_redirects`** is in, so the SPA 404 resolves on Netlify instead of
Netlify's own error page.

**The `·` in the legal line.** §2.3 bans joining meta strings with middle dots,
but §S11's legal line is `© 2026 Ruby — R // Moon Station · Made in Yangon`.
§12 says the copy is final, so it's verbatim. Flagging the tension only.

---

## 5. Testing caveat

The in-app browser pane reports `document.hasFocus() === false` and
`visibilityState: hidden`, which means `:focus-visible` never matches and rAF is
throttled. Focus rings were verified through the CSS rule and via
`focus({focusVisible: true})` in Phase 1 when the pane was focused; Lenis's
smooth scrolling could not be exercised here at all and was tested through its
reduced-motion path (Lenis destroyed, native scrolling) instead. **Worth a
manual pass in a real browser window** for smooth scroll feel and the docking
transition.

---

## 6. Still open, needs Ruby

- The focus-ring colour decision from `PHASE-1-NOTES.md` §1c.
- LinkedIn handle, résumé PDF.
- Whether the Sound toggle should stay visible before anything uses it.

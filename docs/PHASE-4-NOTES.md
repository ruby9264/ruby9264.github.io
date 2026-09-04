# Phase 4 — build notes and spec queries

S01 hero, S02 ticker, S03 about, S04 skills, S07 education, S08 languages.
All copy is verbatim from §6 and lives in `src/data/*.ts`.

---

## 1. The bug that showed up three times

Three sections specify motion that runs once on viewport entry. I built all
three the obvious way — a CSS animation from a hidden `from` state with
`animation-fill-mode: both` — and all three broke the same way:

| Section | Symptom |
|---|---|
| S04 inventory | tab panel stuck at `opacity: 0` — switching tabs showed an empty grid |
| S07 save file | progress bar stuck at `scaleX(0)` — an empty trough |
| S08 languages | segments 1-9 stuck at `visibility: hidden` — every bar read 1/10 |

The pattern is the trap. With `both`, the element sits at the *pre-animation*
state until the animation actually gets a frame. If it never does — a
throttled tab, a dropped frame, a `hidden` element becoming visible in the
same commit — the content is stranded there permanently.

For the language bars that isn't just a missing flourish. **An unfilled bar
says "Burmese: 0 out of 10", which is false information about Ruby's
credentials.** §S08 cares a lot about being honest on exactly this point.

All three are now **declarative**: the finished state is React state, and the
animation is decoration layered on top. A dropped frame costs the animation,
never the content.

- S04 mounts a dither overlay for 150ms and unmounts it. This also fixes a
  spec deviation: §S04 asks for a "150ms dither transition", and §2.1 rule 8
  bans fading a panel with opacity — my first version did exactly that.
- S07 sets the bar's `width` from state, with a stepped `transition` on top.
- S08 reveals segments from a state counter incremented every 60ms.

The dead keyframes are deleted with a comment saying not to reintroduce them.

`useInViewOnce` was the other half of the problem: `IntersectionObserver`
never fired in the test environment, so nothing ever became "seen". It now has
three independent triggers — a synchronous rect check on mount, the observer,
and a scroll listener plus a 1.5s timeout as a backstop. Being early costs an
animation; being late shows the wrong number.

---

## 2. Spec conflicts and decisions

**The ticker needed a real pause control.** §S02 says pause "on hover and on
focus-within" and cites WCAG 2.2.2. But the ticker contains no focusable
content, so `focus-within` can never fire, and hover is not a 2.2.2 mechanism
— as specified, the section fails the very criterion it invokes. There is now
a pause/play button in the bar. Hover and focus-within still work as
described.

**The fourth skills tab is TOOLS, not LANGUAGES.** §S04's diagram shows a
LANGUAGES tab, but the prose under it defines "Tab 4 — TOOLS" and says spoken
languages get their own section because "they deserve better than a chip".
Followed the prose.

**Skill icons are shared by kind.** §S04 asks for a custom 16px icon per slot.
Twenty-nine distinct marks at 16px would be noise, so twelve glyphs cover the
set by kind (pen, frame, flow, grid, code, terminal, database, search, chart,
doc, people, box) and the label carries the meaning. Easy to split further if
you want specific ones.

**S07 and S08 aren't in the nav.** §4.4 caps the dock at five slots, so
education and languages are reachable by scrolling only. Their sections still
carry proper ids and headings.

**The BSc progress figure is invented.** §S07's sketch shows a part-filled bar
but gives no number, so it's set to 80% in `src/data/education.ts` to match
"final year". **Tell me the right figure** — it's one line.

---

## 3. Accessibility

- The CJK and Devanagari strings in S02 and S08 carry `lang` attributes
  (`zh`, `ja`, `hi`), so a screen reader switches voice rather than spelling
  them out in English (§9).
- Each language bar is `role="meter"` with `aria-valuenow/min/max` and a
  spelled-out label — "English proficiency: B2 to C1", not "B2 / C1" read as
  characters. The visible level tag is required, not decorative (§S08).
- The S04 tablist has roving tabindex, arrow keys, Home/End, `aria-selected`
  and `aria-controls`. The status strip is deliberately **not** a live region:
  it mirrors what the visitor is already pointing at, and announcing it would
  double up on the slot's own label.
- Whole-page audit at 1,659 elements: 0 rounded corners, 0 blurred shadows,
  0 gradients outside the dither, 0 touch targets under 44×44, exactly one
  `h1`, no skipped heading levels, all 7 sections labelled, no horizontal
  overflow at 320px.

---

## 4. Things worth knowing

**A stale dev server cost some time.** `sections.css` was created after the
Vite server started and never entered its module graph, so every rule in it
silently did nothing — the tab strip rendered as a vertical stack. Restarting
the server fixed it; production builds were never affected. The dev server now
runs on **port 5174**.

**S01's motion budget.** The load sequence is the five steps §S01 lists, under
1.5s, and then the hero is static apart from the starfield and MOCHI's
breathing. §S01 calls step 4 a "fade-step", so that one is stepped opacity by
the spec's own instruction; everything else avoids opacity per §2.1 rule 8.

**The hero on a short landscape phone.** §S01 says drop the station scene
below 500px tall. Tailwind has no arbitrary variant for "landscape and short",
so that lives in `sections.css` as a media query.

---

## 5. Still open, needs Ruby

- **The BSc progress percentage** (§2 above) — currently a guess.
- The focus-ring colour decision from `PHASE-1-NOTES.md` §1c.
- LinkedIn handle; the résumé PDF (the hero's second CTA is disabled with a
  "coming soon" tooltip until it lands, per §S01's edge case).
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.
- Whether the Sound toggle should stay visible before anything uses it.

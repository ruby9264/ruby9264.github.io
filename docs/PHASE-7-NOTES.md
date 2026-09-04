# Phase 7 — build notes and spec queries

S10 The Break Room, S11 the footer scene, the S09 decision, and the easter egg.

---

## 1. ⚠ The success copy promises something the site can't do

§S10's success panel says, verbatim:

> **Transmission received. ✦**
> I'll get back to you within a couple of days.

With no backend (`docs/SCOPE.md`), nothing is received. Submitting validates
the form and hands a prefilled message to the visitor's own **mail client**.
If they send it, Ruby gets it. If they cancel — or have no mail client
configured, which is common on a work laptop — nothing happens at all, and
they still read "Transmission received".

That is the one place the front-end-only decision genuinely conflicts with the
spec's copy, and I'm not comfortable resolving it by inventing new copy. Three
options:

1. **Change the success copy** to describe what actually happened — something
   like "Your mail app should be open. Hit send and I'll reply within a couple
   of days." Honest, no backend, ~2 lines. **My recommendation.**
2. **Add a form service** (Formspree's free tier, or Netlify Forms). Then the
   spec's copy is literally true — but it reintroduces exactly the backend
   dependency you asked to drop.
3. **Ship as-is** and accept the optimism.

Everything is built so that any of the three is a small change. Tell me which.

Related: §S10's eighth state, **network fail**, cannot occur naturally with a
`mailto:` handoff — there is no network call to fail. The state is built and
wired to the case where composing throws, but its verbatim copy ("Check your
connection and try again") assumes a send that doesn't exist. It resolves
itself under option 2.

---

## 2. All eight form states are built

| §S10 state | How it's reached |
|---|---|
| default | initial |
| focus | 4px ring, per the §7 global rule |
| filled-valid | touched, non-empty, error-free — moss border + ✓ |
| error | red border, ⚠ glyph, message below, `aria-invalid` |
| disabled | while submitting, dither fill |
| submitting | 4-frame spinner, label becomes "sending…" |
| success | panel replaces the form, `aria-live="polite"` |
| network fail | see §1 above |

Verified against §S10's error table — all six messages fire on the right
input, including whitespace-only names being treated as empty:

- name empty ✓ · email empty ✓ · email invalid ✓ · message too short ✓ ·
  message too long ✓ · network fail ✓

Focus moves to the first invalid field on submit failure, errors are linked
with `aria-describedby`, and every input has a real `<label>` (checked
programmatically across the page: all pass).

MOCHI's two announced states fire from the form via the Phase 3 mood channel —
`form-error` shows "hmm, check the fields?" and `form-success` shows "message
launched!". Those are the only two bubbles that are ever announced (§3.2).

---

## 3. Deviations

**zod is gone.** §5 lists `react-hook-form + zod`. react-hook-form stays;
zod and `@hookform/resolvers` were removed after measuring — they added
**23 KB gzipped** and expressed nothing that react-hook-form's own
`required` / `minLength` / `maxLength` / `pattern` rules don't, for four
fields. Main bundle went 128.3 → 105.3 KB. Worst case across all chunks is now
151.6 KB against §10's 200 KB budget.

**No honeypot, no time-to-submit check.** Both are in §S10, and both exist to
protect a submit endpoint. There isn't one. (§S10's "do not add a CAPTCHA"
still holds, for the same reason it always did.)

**The footer wave is two frames, not four.** §S11 asks for a 4-frame wave over
2s; MOCHI has two wave drawings, so it alternates every 500ms — same cadence,
half the art. Adding two more frames is a small edit to `pixelMaps.ts` if you
want the full cycle.

---

## 4. S09 — the band, not the testimonials

§S09 decides itself: "If there are fewer than 2 real testimonials, do not
build this section. Placeholder or invented testimonials are actively damaging
to credibility." There are none, so the **"Currently exploring"** band ships,
covering the three topics the spec names.

The spec names the topics but gives no card copy. Rather than invent a voice,
each line states a fact the spec already establishes elsewhere — the ongoing
BI & Analytics certification from §S07, and the design system and front-end
animation work on EcoFootPrint from §S06. Replace them with Ruby's own words
whenever she likes; they're three strings in `src/data/exploring.ts`.

---

## 5. S11 and the easter egg

The horizon is a **repeating SVG pattern** with `patternUnits="userSpaceOnUse"`,
so the ground tiles at a fixed 16px whatever the viewport width and never
stretches or seams (§S11's edge case). Above 1536px, two extra sprites appear
in the margins rather than the scene stretching.

Eighteen stars twinkle on individual 2–5s intervals, stepped so they blink
rather than glow. All of it stops under reduced motion.

The easter egg fires on exactly the fifth click: confetti burst plus the
bubble "you found me! ✦". MOCHI is a real `<button>` there — a div with an
onClick would have hidden the interaction from keyboard users — and its
screen-reader label changes to the same message, so the egg isn't
sighted-only.

---

## 6. Automated checks

Whole page, 2,439 elements: 0 rounded corners, 0 blurred shadows, 0 gradients
outside the dither, 0 touch targets under 44×44, one `h1`, no skipped heading
levels, 9 labelled sections, and every form control has a real `<label>`.

---

## 7. Still open, needs Ruby

- **The success-copy decision** in §1 — the one that matters this phase.
- **Case study copy** for the four projects (`PHASE-5-NOTES.md` §1).
- The no-JS decision (`PHASE-6-NOTES.md` §5).
- The BSc progress percentage (`PHASE-4-NOTES.md`) — currently a guess.
- The focus-ring colour decision (`PHASE-1-NOTES.md` §1c).
- LinkedIn handle; the résumé PDF.
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.

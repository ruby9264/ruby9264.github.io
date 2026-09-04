# Post-Phase-8 — scroll-driven reveals and contact icons

Two requested changes, made after the build was signed off in Phase 8.

---

## 1. ⚠ Scroll reveals are a deliberate departure from §4.3

§4.3 is explicit, and it is worth quoting because it is the rule this change
sets aside:

> **Motion budget — spend boldness in one place.** The memorable moment is the
> airlock door wipe (S00). Everything after it is restrained. Do NOT put a
> fade-and-slide-up entrance on every section.

Reveals were reserved for S05, S06 and S09. They are now on ~77 elements
across every section. That was asked for directly, so it is built — but the
spec's reasoning still applies, so three things keep it from becoming the
thing §4.3 warns about:

1. **Every reveal is stepped**, `steps(5, jump-none)`, never eased — it reads
   as a sprite popping in rather than a smooth slide (§2.1 rule 7).
2. **The travel is 12px and the range is `entry 5%` → `entry 55%`**, so an
   element has finished moving well before it reaches reading position.
   Nothing is still animating while you read it.
3. **It is off entirely under reduced motion** — verified: 0 elements animated
   with Motion set to Reduced.

If it feels like too much in practice, the dial is one line: widen
`animation-range` for a slower reveal, or narrow the selector in
`src/styles/scroll.css` back to the three sections §4.3 names.

### Implementation

Real CSS scroll-driven animations (`animation-timeline: view()`), not an
IntersectionObserver — they run off the main thread and need no JS.

**The whole file is wrapped in `@supports (animation-timeline: view())`.**
That matters: `animation-timeline` is Chromium-only today (Safari and Firefox
do not ship it). Without the guard, those browsers would apply the `from`
state — `opacity: 0` — and never advance it, so the entire page would load
blank. With it, they simply get the finished layout. This is the same
fill-mode trap that bit S04, S07 and S08 in Phase 4, and it is much worse
here because it would affect every element rather than one bar.

**Opted out** (`.sda-none`), because each already has its own motion and a
second animation would fight it:

- `#home` — the S01 load sequence
- the S02 ticker — already scrolling
- the S05 pinned track — itself a scroll-driven animation
- the S06 case-study modal — `position: fixed` but inside `#main`, so it would
  otherwise get a view timeline and its opacity would depend on page scroll

Nesting is avoided by animating one level only: `.panel` animates, and a list
item animates only when it does not itself contain a panel — otherwise a
certification card would fade in inside a list item that is also fading in and
the two opacities would multiply.

### A bug worth recording

The first version used the `animation` shorthand. **The shorthand resets
`animation-duration` to `0s`, and a scroll-driven animation with a zero
duration completes instantly at the start of its range** — so every element sat
at its end state and nothing appeared to animate at all. Scroll-driven
animations need `animation-duration: auto`, which means "span the range". Now
written as longhands so the shorthand can't reset it again.

### What I could not verify here

The in-app browser reports `ViewTimeline … currentTime: null` — the timeline
is created correctly but inactive, because this pane never runs a rendering
update (the same limitation that throttles `requestAnimationFrame` and froze
CSS transitions in earlier phases). So **I have confirmed the animations are
correctly configured but I have not watched them run.**

Confirmed: `animation-name: sda-reveal`, `duration: auto`, `timeline: view()`,
`range: entry 5% entry 55%`, `fill-mode: both`, a real `ViewTimeline` object
on 77 elements, 3 opt-out containers, and **0 elements stranded invisible**.

**Worth 30 seconds in a real Chrome window** to check the pacing feels right.

---

## 2. Icons before the email and location

A pixel envelope before the address and a pixel map pin before the location,
in both S10 and the footer's ELSEWHERE column.

The envelope reuses the existing `IconContact` from the dock. The pin is new
(`IconPin`), drawn on the same 2-unit grid as the rest of the nav glyph family
so it doesn't read as finer-detailed than its neighbours, with the hole left
transparent rather than knocked out — so it needs no knowledge of whatever
surface it sits on and works in both themes.

Both are `aria-hidden`: the link text and the address already say what they
are, and §9 forbids conveying meaning by an icon alone. The email link keeps
its obfuscated display text and assembles the real `mailto:` at click time.

---

## 3. Project tag links, the CV, and the social profiles

**Tags became links where an artefact exists.** `Project.tags` is now
`{ label, href? }` rather than plain strings. A tag with an `href` opens the
Figma prototype for that slice of the work in a new tab, marked with a small
external-link glyph; a tag without one stays a flat label rather than
pretending to be clickable. Wired: EcoFootPrint's **UX Research** and
**Prototyping**, and InfinityGames' **UI Design**.

The deck is draggable, and a browser still fires `click` on whatever sat under
the pointer when a drag ends — so finishing a swipe over a tag would have
opened Figma. A `didDrag` ref swallows that click. Tag links on the peek cards
behind sit inside `inert`, so they are not tab stops.

**Closing the case study returns to Selected Work.** Both *Close* and *Back to
work* now scroll to `#work` as well as restoring focus to the card that opened
the overlay (§S06 requires the focus part). `focus({ preventScroll: true })`
stops the two fighting. Measured: lands at 4758 against a section top of 4838,
i.e. the 80px nav offset, with focus on "1 of 4: EcoFootPrint".

**"Résumé" is now "CV" everywhere**, and the file is live at
`/public/R-Ruby-CV-2026.pdf` (serves 200, `application/pdf`, 308 KB), so §S01's
disabled "coming soon" state no longer applies. The identifiers were renamed
alongside the copy (`RESUME_AVAILABLE` → `CV_AVAILABLE`, `PROFILE.resume` →
`PROFILE.cv`) so the code doesn't drift from the UI.

**§12's LinkedIn TODO is closed.** The spec flagged the CV's URL as incomplete
and the link was omitted rather than shipped broken; the full handle has now
been supplied, so it ships — along with a GitHub link, which the spec never
mentioned. Both appear in the contact list and the footer's ELSEWHERE column,
in `sameAs` on the Person JSON-LD, and in the `<noscript>` fallback so they
survive with JavaScript off.

Four new glyphs on the same 2-unit grid as the rest of the family: a document
for the CV, a bordered "in" for LinkedIn, a cat head for GitHub, and the
external-link mark. All are outline-only — no knocked-out shapes — so none of
them needs to know what surface it sits on, and all work in both themes. Each
is `aria-hidden` beside a real text label, and external links carry an sr-only
"(opens in a new tab)".

Verified: 0 touch targets under 44×44, 7 external links and **0** missing
`rel="noopener"`, no occurrence of "résumé"/"resume" anywhere in the rendered
text.

---

## 4. Unchanged

Bundle is 106.6 KB gzipped for the main chunk — the reveals cost nothing in JS
because they are pure CSS. Reduced motion, the 9 sections, the contract audit
and everything from `PHASE-8-NOTES.md` still hold.

### Still open

Two items from `PHASE-8-NOTES.md` are now closed (the LinkedIn handle and the
CV). What remains:

- **Case study copy** for the four projects (`PHASE-5-NOTES.md` §1) — the
  largest content gap.
- The real domain, for `canonical` / `og:url` / `sitemap.xml`.
- Whether to prerender for full no-JS parity (`SCOPE.md`).
- Whether to revisit the contact-form success copy (`SCOPE.md`).
- The BSc progress percentage (`PHASE-4-NOTES.md`) — currently a guess.
- The focus-ring colour decision (`PHASE-1-NOTES.md` §1c).
- Bot size: 56/80 as built, or 48 per the §3.2 mobile row.
- A real Safari pass (`clip-path` and `steps()`).

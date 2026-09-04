# R // MOON STATION

Personal portfolio for Ruby (R) — UI/UX Designer & Research Analyst.
Pixel-art space station, moss green and navy, light/dark, fully responsive.

The build spec in [`docs/PORTFOLIO_BUILD_SPEC.md`](docs/PORTFOLIO_BUILD_SPEC.md)
is the source of truth for content, colour and copy.
[`docs/SCOPE.md`](docs/SCOPE.md) records where this build deliberately
departs from the spec: **front-end only, no backend**. The phase notes
([1](docs/PHASE-1-NOTES.md), [2](docs/PHASE-2-NOTES.md),
[3](docs/PHASE-3-NOTES.md), [4](docs/PHASE-4-NOTES.md),
[5](docs/PHASE-5-NOTES.md), [6](docs/PHASE-6-NOTES.md),
[7](docs/PHASE-7-NOTES.md), [8](docs/PHASE-8-NOTES.md),
[9](docs/PHASE-9-NOTES.md)) record what was measured and the questions raised.

## Running it

```bash
npm install
npm run dev
```

- `/` — the shell around placeholder sections until Phases 4–7 fill them in
- `/styleguide` — every primitive in every state from §7, plus a live contrast
  audit that re-measures the computed tokens on each load
- any other path — the S12 404

```bash
npm run build      # typecheck + production build
npm run typecheck  # types only
npm run preview    # serve the production build
npm run assets     # regenerate favicons + the Open Graph card
```

**Deploying:** see [`docs/DEPLOY.md`](docs/DEPLOY.md). Push to `main` and
GitHub Actions builds and publishes to Pages; the canonical URL, Open Graph
tags, `robots.txt` and `sitemap.xml` are all filled in automatically from the
live Pages URL, so there is no domain to edit by hand.

## Build progress (§14)

- [x] **Phase 1 — Foundation.** Vite + React + TS + Tailwind, both theme token
      sets, fonts, the §2.1 pixel contract, `useTheme`, and the `Panel`,
      `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`,
      `ThemeSwitch`, `DitherFill`, `Container` and `Section` primitives.
- [x] **Phase 2 — Shell.** Desktop nav with dock-on-scroll, mobile dock bar,
      footer skeleton, IntersectionObserver scroll-spy, skip link, Lenis,
      `useReducedMotion`, the four-control settings menu, routing and the 404.
- [x] **Phase 3 — Character & cursor.** MOCHI as composable pixel layers with
      all nine §3.2 bot states, the floating bot with its speech bubble, quick-nav
      menu and state machine, and the canvas-generated pixel cursor with all
      seven states and all three guards.
- [x] **Phase 4 — Core content.** S01 hero with its load sequence and
      starfield, S02 status ticker, S03 about and the process rail, S04 skills
      inventory, S07 education save-files and certifications, S08 language
      stat bars.
- [x] **Phase 5 — Complex interaction.** S05 experience as a vertical stack
      with a GSAP-pinned horizontal track layered on top for desktop, and S06
      as a draggable card deck with a focus-trapped case study overlay.
- [x] **Phase 6 — The gate.** S00 airlock: the two-palette flood with the
      labels clipped to the flood edge, the 12-step reveal wipe, and both the
      returning-visitor and deep-link bypasses.
- [x] **Phase 7 — Contact & polish.** S10 The Break Room with all eight form
      states, S11's horizon scene and the five-click easter egg, and S09
      shipping as the "Currently exploring" band per its own edge case.
- [x] **Phase 8 — Hardening.** The §9 checklist against the production build,
      §11's favicons/OG card/JSON-LD/robots/sitemap (generated, not committed),
      a `<noscript>` fallback, and the 320px / 200%-zoom / reduced-motion
      passes.
- [x] **Post-8.** Scroll-driven reveals across every section (a deliberate
      departure from §4.3 — see the notes) and pixel icons before the email
      and location.

## The rules that matter

§2.1 is enforced by the toolchain, not by discipline. `tailwind.config.js`
*replaces* the `borderRadius`, `boxShadow` and `borderWidth` scales, so there is
no rounded utility, no blurred shadow and no 1px border available to write.
Depth comes from the dither in `src/styles/dither.css`, never a gradient.

All copy belongs in `src/data/*.ts` as typed arrays, never hardcoded in JSX, so
the site can be updated without touching components.

MOCHI's art lives in `src/components/mochi/pixelMaps.ts` as readable pixel
rows. A new pose is a combination of existing ear/eye/arm/accessory layers, not
a new drawing.

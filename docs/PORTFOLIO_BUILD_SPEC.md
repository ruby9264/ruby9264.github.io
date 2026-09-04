# BUILD SPEC — "R // MOON STATION"
### Personal portfolio for Ruby (R) · UI/UX Designer & Research Analyst
### Pixel-art space station, moss green + navy blue, light/dark, fully responsive

> **How to use this file:** Paste into Claude Code as the project brief. Build in the
> phase order at the bottom (Section 14). Do not attempt the whole site in one pass —
> each section below is a self-contained ticket with content, layout, states, motion,
> and edge cases already specified.

---

## 0. PROJECT BRIEF

**Who:** Ruby — final-year Business Computing & Information Systems student, UI/UX
Designer and Research Analyst, based in Botahtaung, Yangon, Myanmar.

**What this site is:** A live, interactive portfolio that *demonstrates* front-end and
interaction skill rather than merely listing it. Every section is a different structural
pattern (grid, marquee, horizontal scroll, carousel, stat bars, terminal) so the site
itself is the proof of capability.

**Who it's for:**
1. Hiring managers / design leads scanning in under 90 seconds — they need role, skills,
   proof of work, and contact, fast.
2. Recruiters checking credentials — education, certifications, languages.
3. Peers and other designers — they'll stay for the craft.

**Primary job:** Get a stranger from "who is this" to "I want to talk to them" without
them ever hitting a dead end or a wall of text.

**Tone:** Warm, playful, quietly confident. Retro-game nostalgia with real professional
substance underneath. Never cutesy at the expense of clarity.

---

## 1. REFERENCE WORKFLOW — READ THIS FIRST

Before building, fetch and study **https://mhk-dev.netlify.app/**.

Extract and note down:
- Scroll pacing — how much vertical distance sits between narrative beats
- Nav behaviour — when it appears, whether it docks, shrinks, or hides
- How project work is surfaced (inline cards vs. modal vs. dedicated route)
- Section transition treatment
- Where the site chooses restraint over effect

**Adopt the structural rhythm and pacing. Do NOT adopt its visual language.**
Our aesthetic comes entirely from the pixel-art direction in Section 2.

If the site is unreachable, proceed with the section order in this spec as-is.

---

## 2. DESIGN SYSTEM

### 2.1 Aesthetic law — the pixel contract

Non-negotiable rules that make this read as authentic pixel art rather than "a normal
site with a retro font":

```
1.  border-radius: 0        — everywhere. No exceptions. Not on buttons, not on avatars.
2.  Hard shadows only       — box-shadow: 4px 4px 0 var(--ink). Never blur. Never rgba soft grey.
3.  Borders are 2px solid   — never 1px, never hairline. Pixels have weight.
4.  No CSS gradients        — depth comes from DITHER patterns (2.5) and flat color steps.
5.  image-rendering: pixelated  — on every <img>, <canvas>, and sprite.
6.  8px spatial grid        — 1 "pixel unit" = 4px. All spacing, sizing, and offsets are
                              multiples of 4, and preferably of 8.
7.  Steps() easing on sprites — animation-timing-function: steps(N). Sprites never tween.
8.  No opacity fades on chrome — fade a panel by swapping to a dither pattern, not opacity.
```

### 2.2 Color tokens

Two themes. Same tokens, remapped. Every color is checked against WCAG AA.

```css
:root {
  /* ---- Core moss ---- */
  --moss-900: #1F3325;   /* deepest moss, near-black green */
  --moss-700: #3E5C36;   /* moss shadow */
  --moss-500: #6B8F4E;   /* MOSS — primary brand green */
  --moss-300: #9DBE72;   /* moss light */
  --moss-100: #D6E4BF;   /* moss mist */

  /* ---- Core navy ---- */
  --navy-900: #0B1524;   /* void — darkest */
  --navy-700: #14233A;   /* navy ink — primary brand navy */
  --navy-500: #22375A;   /* navy mid */
  --navy-300: #4A6A9B;   /* navy light */
  --navy-100: #C3D0E4;   /* navy mist */

  /* ---- Neutrals ---- */
  --paper:    #E8EDE0;   /* pale moss-tinted paper (light bg) */
  --paper-2:  #F3F6EC;   /* raised surface, light mode */
  --star:     #F2F5EC;   /* pure highlight */

  /* ---- Accent (use sparingly — see 2.3) ---- */
  --amber-500: #D9A441;  /* COOKIE amber — CTA + reward moments only */
  --amber-700: #A87A22;  /* amber shadow */

  /* ---- Semantic ---- */
  --error:   #C2543D;
  --success: #6B8F4E;
  --warn:    #D9A441;
}
```

**Light theme (DAY SIDE)** — moss-forward, sunlit station exterior
```css
[data-theme="light"] {
  --bg:         var(--paper);
  --bg-raised:  var(--paper-2);
  --bg-sunken:  #DCE3D2;
  --ink:        var(--navy-700);   /* body text — 11.2:1 on --paper ✓ AAA */
  --ink-soft:   var(--navy-500);   /* secondary text — 7.8:1 ✓ AAA */
  --ink-mute:   #5A6B58;           /* tertiary/meta — 5.1:1 ✓ AA */
  --line:       var(--navy-700);   /* all borders */
  --brand:      var(--moss-700);
  --accent:     var(--amber-700);  /* darker amber for AA on light */
  --shadow:     var(--navy-700);
}
```

**Dark theme (NIGHT SIDE)** — navy-forward, deep space
```css
[data-theme="dark"] {
  --bg:         var(--navy-900);
  --bg-raised:  var(--navy-700);
  --bg-sunken:  #060D18;
  --ink:        var(--moss-100);   /* body text — 12.4:1 on --navy-900 ✓ AAA */
  --ink-soft:   var(--moss-300);   /* secondary — 8.1:1 ✓ AAA */
  --ink-mute:   #7F9668;           /* tertiary/meta — 4.9:1 ✓ AA */
  --line:       var(--moss-500);
  --brand:      var(--moss-500);
  --accent:     var(--amber-500);
  --shadow:     #000000;
}
```

**Accent discipline:** `--accent` amber appears in **at most 4 places sitewide** — the
primary hero CTA, the contact submit button, the cookie/coffee reward moment, and the
mascot's coffee cup. Everywhere else is moss and navy. If amber starts showing up on
cards and dividers, delete it.

### 2.3 Typography

Load from Google Fonts. Three roles, clearly distinct.

| Role | Family | Use | Notes |
|---|---|---|---|
| Display | **Silkscreen** (400, 700) | H1, H2, section titles, mascot dialogue | True bitmap. Never below 16px. Never for paragraphs. |
| UI / label | **Pixelify Sans** (400–700 variable) | Buttons, nav, tags, stat labels, HUD | More legible bitmap; survives small sizes better than Silkscreen. |
| Body | **IBM Plex Mono** (400, 500, 600) | All paragraphs, list items, form fields, case-study prose | Monospace keeps the terminal feel *while remaining accessible*. |

**Why body is not a pixel font:** bitmap faces below ~14px lose stroke definition and
fail legibility for dyslexic and low-vision readers. IBM Plex Mono holds the retro
register without that cost. This is the single most important accessibility decision on
the site — do not override it.

**Type scale** (1.25 minor-third, 16px base — mobile → desktop via `clamp()`):

```css
--t-display: clamp(2.25rem, 7vw, 4.75rem);   /* Silkscreen 700 — hero only */
--t-h1:      clamp(1.875rem, 5vw, 3.25rem);  /* Silkscreen 700 */
--t-h2:      clamp(1.5rem, 3.5vw, 2.25rem);  /* Silkscreen 400 */
--t-h3:      clamp(1.25rem, 2.5vw, 1.5rem);  /* Pixelify 700 */
--t-lead:    clamp(1.0625rem, 1.6vw, 1.25rem); /* Plex Mono 400 */
--t-body:    1rem;                            /* Plex Mono 400 — 16px floor */
--t-small:   0.875rem;                        /* Plex Mono 400 — meta only */
--t-label:   0.8125rem;                       /* Pixelify 600, +0.08em tracking */
```

**Line heights:** display `1.05`, headings `1.15`, body `1.65`, mono lists `1.55`.
**Measure:** body copy capped at `62ch`. Mono is wide — 62ch here reads like ~72ch sans.

**Typographic bans** (these are the tells of generated design — avoid all four):
- Do not accent one word of a headline in a different color or weight
- Do not put tracked-out ALL-CAPS eyebrow labels above every section heading
  (exception: the HUD chrome in S02 and S11, where all-caps *is* the game convention)
- Do not append `→` to every link and button label
- Do not join meta strings with middle dots (`A · B · C`)

### 2.4 Spacing & layout

```css
--sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
--sp-6: 24px;  --sp-8: 32px;  --sp-12: 48px; --sp-16: 64px;
--sp-24: 96px; --sp-32: 128px; --sp-40: 160px;

--container: 1200px;
--gutter-mobile: 20px;
--gutter-desk: 48px;
```

**Breakpoints (mobile-first):**
```
base    0–479    single column, 1 col grids
sm      480      2-col grids begin
md      768      tablet — nav dock appears, 2–3 col
lg      1024     desktop — full layouts, horizontal scroll enabled
xl      1280     max container, decorative sprites appear in margins
```

**Section rhythm:** vertical padding `--sp-24` mobile → `--sp-40` desktop. Between
*narrative beats* (e.g. work → contact) add a full `--sp-40`. Consistency here is what
makes the site feel professionally paced rather than assembled.

### 2.5 The dither pattern (replaces all gradients)

```css
.dither {
  background-image:
    repeating-conic-gradient(var(--line) 0% 25%, transparent 0% 50%);
  background-size: 4px 4px;
  opacity: 1; /* control density by swapping size: 4px sparse → 2px dense */
}
```
Use for: panel depth, section transitions, disabled states, the airlock wipe, and the
"loading" fill of stat bars. Three density levels: `.dither-25` (8px), `.dither-50`
(4px), `.dither-75` (2px).

### 2.6 Core component: the pixel panel

Every card, modal, and container in this site is a variant of one primitive.

```css
.panel {
  background: var(--bg-raised);
  border: 2px solid var(--line);
  box-shadow: 4px 4px 0 var(--shadow);
  padding: var(--sp-6);
  position: relative;
}
/* Corner notches — the detail that sells the pixel look.
   4 absolutely-positioned 4x4 squares in --bg, one per corner. */
.panel::before, .panel::after { /* handles 2 corners; use inner span for other 2 */ }
```

**Panel variants:**
- `.panel--window` — adds a 24px title bar with `[ _ ][ □ ][ × ]` chrome (see reference image)
- `.panel--sunken` — inverted shadow (`inset`), for input fields and wells
- `.panel--flush` — no shadow, for tightly nested content

---

## 3. THE MASCOT — "MOCHI"

**Callsign:** MOCHI · Unit R-01
**Concept:** The moon rabbit of East Asian folklore, reassigned as a space station
resident. Navy pressure suit, moss-green visor, an embroidered **R** patch on the chest.
Long ears that don't fit in the helmet — they fold. This is a deliberate cultural
grounding, not a generic mascot.

**Why it matters:** MOCHI gives the site a narrator, a reason for the coffee-and-cookies
contact section (moon rabbits pound rice cakes), and a warm sign-off voice in the footer.

### 3.1 Where MOCHI appears

| Placement | Behaviour |
|---|---|
| **Airlock (S00)** | Floats between the two doors, ears tilting toward whichever side is hovered |
| **Hero (S01)** | Full-body sprite beside the headline, idle-breathing animation |
| **Floating bot** | Bottom-right, fixed, persistent from S01 onward |
| **Contact (S11)** | Holds a coffee cup and a cookie; steam animates |
| **Footer** | Waving goodbye, small, beside the sign-off text |
| **404 page** | Floating away untethered, holding a snapped cable |
| **Empty states** | Sleeping, curled up |

### 3.2 Floating bot — full state machine

Fixed bottom-right, `56px` mobile / `72px` desktop, `z-index: 900`. Contains a sprite
plus a speech bubble that opens on interaction.

| State | Trigger | Visual | Bubble copy |
|---|---|---|---|
| `idle` | Default | Breathing loop, blink every 4–7s (randomized) | — |
| `hover` | Pointer over | Ears perk, waves one paw | "need a hand?" |
| `active` | Click / Enter | Bubble opens with quick-nav menu | see below |
| `scroll-fast` | > 1200px/s scroll | Ears blown back, eyes squint | "whoa, slow down!" |
| `idle-long` | 45s no interaction | Falls asleep, `z z z` particles | — |
| `section-work` | S06 in viewport | Holds a tiny clipboard | "my favourite one is EcoFootPrint" |
| `section-contact` | S11 in viewport | Holds coffee + cookie | "kettle's on" |
| `form-success` | Form submitted | Jumps, confetti pixels | "message launched!" |
| `form-error` | Validation fail | Ears droop | "hmm, check the fields?" |
| `reduced-motion` | `prefers-reduced-motion` | Static sprite, no loop | unchanged |
| `mobile` | < 768px | Shrinks to 48px, bubble opens **upward and full-width-minus-32px** | unchanged |

**Quick-nav bubble contents:** Work · Skills · Résumé (PDF) · Contact · Toggle theme.
Max 5 items. Keyboard: `Tab` to reach bot, `Enter` to open, arrow keys within menu,
`Esc` to close and return focus to the bot.

**Accessibility:** the bot is `<button aria-haspopup="menu" aria-expanded>` with
`aria-label="Open quick navigation"`. Speech bubbles are `aria-live="polite"` ONLY for
the form-success and form-error states — ambient chatter must never be announced, or
screen-reader users get spammed.

**Edge case:** if a mobile keyboard opens, hide the bot (`:has()` or JS focus listener on
inputs) — otherwise it covers the send button.

### 3.3 Asset production

MOCHI should be built as **CSS/SVG pixel art or a sprite sheet**, not a raster PNG per
frame. Recommended: a single SVG with `shape-rendering="crispEdges"` and 4px unit squares,
with animation driven by swapping SVG groups. This keeps it crisp at any DPI and
themeable via `currentColor`.

Sprite sheet fallback: `mochi-sheet.png` at 4× resolution, 8 frames wide,
`image-rendering: pixelated`, animated with `steps(8)`.

---

## 4. GLOBAL SYSTEMS

### 4.1 Custom pixel cursor

Replace the system cursor with a pixel-art arrow. Two layers:
1. **Base cursor** — CSS `cursor: url('/cursors/arrow.png') 0 0, auto` (32×32, hotspot top-left)
2. **Trail companion** — a JS-driven 8px moss square that lags ~120ms behind with a
   spring, snapping in 4px increments (never smooth — use `Math.round(x/4)*4`)

**Cursor states:**
| Context | Cursor |
|---|---|
| Default | Pixel arrow, navy outline / moss fill |
| Interactive (`a`, `button`, `[role=button]`) | Pixel hand pointing |
| Text input / selectable | Pixel I-beam |
| Draggable (slider S06) | Pixel grab hand → closed on active |
| Loading | 4-frame spinning pixel hourglass |
| Disabled | Pixel arrow with a small `×` |

**Mandatory guards — do not skip:**
```js
// Disable custom cursor entirely on:
if (window.matchMedia('(pointer: coarse)').matches) return;      // touch devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) disableTrail();
```
Also provide a **"System cursor" toggle in the settings menu**. Custom cursors are a
genuine accessibility barrier for some motor-impaired users; make it escapable.

**Never** hide the native cursor without a working replacement — if the image fails to
load, the user is left with an invisible pointer. Always specify the `, auto` fallback.

### 4.2 Theme system

- Set on `<html data-theme="light|dark">`
- Initial value: chosen at the airlock (S00), persisted to `localStorage['r-theme']`
- Returning visitors skip the airlock (see S00 §edge cases)
- Respect `prefers-color-scheme` as the *pre-selected* airlock door, not an override
- Transition: `transition: background-color 200ms steps(4), color 200ms steps(4)` —
  stepped, never smooth, to stay in register with the pixel aesthetic
- Add `<meta name="theme-color">` updated on toggle so mobile browser chrome matches

**Theme toggle control:** a physical-looking pixel switch in the nav — a 2-position lever
with a sun sprite and a moon sprite. `role="switch"`, `aria-checked`, keyboard operable,
with `aria-label="Switch to dark theme"` that updates with state.

### 4.3 Motion & scroll

**Stack:** GSAP + ScrollTrigger for scroll choreography, Lenis for smooth scroll.

**Motion budget — spend boldness in one place.** The memorable moment is the **airlock
door wipe (S00)**. Everything after it is restrained. Specifically:
- Do NOT put a fade-and-slide-up entrance on every section. Use reveals only on S05, S06,
  and S09 where the content genuinely benefits.
- Do NOT put a hover lift on every card. Cards get a 2px shadow shift, that's all.
- Auto-motion (marquee, floating sprites) is ambient and slow; it must never compete with
  reading.

**Global reduced-motion contract:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Plus in JS: kill Lenis, convert horizontal-scroll sections (S05) to vertical stacks,
pause all marquees, freeze MOCHI to a static sprite. **Test the whole site with reduced
motion on — it must be fully usable and still look intentional, not broken.**

### 4.4 Navigation

**Mobile (< 768px):** bottom dock bar, fixed, 5 slots — Home · Work · Skills · About ·
Contact. Icons are 16px pixel glyphs with a 10px Pixelify label. Active slot gets an
inverted fill + a 4px indicator bar above it. Safe-area inset padding for iOS notch.

**Desktop (≥ 768px):** top bar, initially transparent over the hero, then on scroll past
100vh it docks with `background: var(--bg-raised)`, a 2px bottom border, and a hard
shadow. Contains: `R` logo-mark (left) · section links (center) · theme switch + settings
(right).

**Scroll-spy:** active link mirrors the section in view via IntersectionObserver at
`rootMargin: "-40% 0px -55% 0px"`.

**Skip link:** `Skip to main content`, visually hidden until focused, first tabbable
element on the page. Non-negotiable.

### 4.5 Settings menu (gear icon in nav)

A small `.panel--window` popover. Four toggles:
1. Theme — Day / Night
2. Custom cursor — On / Off
3. Motion — Full / Reduced
4. Sound — On / Off *(if you add UI blips; default OFF, never autoplay audio)*

This menu is itself a portfolio artifact — it proves you think about user control.

---

## 5. TECH STACK & FILE STRUCTURE

**Primary stack:**
```
Vite + React 18 + TypeScript
Tailwind CSS (with the tokens above as CSS custom properties in @layer base)
GSAP 3 + ScrollTrigger
Lenis (smooth scroll)
react-hook-form + zod (contact form validation)
Deploy: Netlify
```

**Tailwind config:** map all tokens from §2.2/§2.3/§2.4 into `theme.extend`. Set
`borderRadius: { DEFAULT: '0', none: '0' }` globally so it's impossible to accidentally
round a corner.

**Structure:**
```
src/
  main.tsx
  App.tsx
  styles/
    tokens.css          # all CSS custom properties, both themes
    base.css            # resets, pixel contract rules, font-face
    dither.css
  components/
    layout/     Nav, MobileDock, Footer, Container, Section
    pixel/      Panel, PixelButton, PixelInput, PixelTag, StatBar,
                WindowChrome, DitherFill, Marquee
    mochi/      Mochi.tsx, MochiSprite.tsx, FloatingBot.tsx, SpeechBubble.tsx
    cursor/     PixelCursor.tsx, useCursorState.ts
    sections/   S00Airlock ... S12Footer   (one folder each)
  hooks/
    useTheme.ts, useReducedMotion.ts, useScrollSpy.ts, useIdle.ts,
    useHorizontalScroll.ts
  data/
    profile.ts, skills.ts, experience.ts, projects.ts,
    education.ts, certifications.ts, languages.ts
  assets/
    sprites/, cursors/, fonts/
public/
  R-Ruby-CV-2026.pdf
```

**All content lives in `src/data/*.ts` as typed arrays.** No copy hardcoded in JSX. This
is what lets Ruby update the site later without touching components.

---

## 6. SECTION BLUEPRINTS

Build these in order. Each is a complete ticket.

---
### S00 — AIRLOCK (theme select gate)
---

**UX rationale:** A splash screen normally costs you visitors, so it has to earn its
place. This one does, because the choice made here is real and persistent — the visitor
customizes the site before they've seen it, which creates immediate investment. It also
front-loads the pixel aesthetic as a statement of intent.

**Layout:** Full viewport, 100dvh, no scroll. Split into two vertical halves.

```
┌─────────────────────────────┬─────────────────────────────┐
│                             │                             │
│      ☀  (pixel sun)         │      ☾  (pixel moon)        │
│                             │                             │
│        DAY  SIDE            │        NIGHT SIDE           │
│                             │                             │
│    moss / paper preview     │    navy / void preview      │
│                             │                             │
│         [  ENTER  ]         │         [  ENTER  ]         │
│                             │                             │
├─────────────────────────────┴─────────────────────────────┤
│              🐰  MOCHI floats on the seam                  │
│                                                            │
│        R // MOON STATION — choose your light               │
│              [ skip → use system setting ]                 │
└────────────────────────────────────────────────────────────┘
```

**Content:**
- Kicker: `R // MOON STATION`
- Prompt: `Choose your light.`
- Left door: `DAY SIDE` / sub: `moss & sunlight`
- Right door: `NIGHT SIDE` / sub: `navy & starfield`
- Bypass: `skip — use my system setting`

**Interaction — the signature moment:**
1. **Hover a half** → that half's palette *floods across the seam* into the opposite
   half over 400ms via a `clip-path` dither wipe. MOCHI's ears tilt toward the hovered
   side. The idle half dims to `.dither-25`.
2. **Leave** → colors retract to the 50/50 split.
3. **Click / Enter** → chosen palette fills the entire viewport, then a **vertical dither
   wipe** (12 steps, 700ms) reveals the hero (S01) underneath. Airlock unmounts.
4. Theme is written to `localStorage`, `<html data-theme>` set.

**States:** default (50/50) · hover-left · hover-right · focus-visible (4px moss outline,
offset 4px) · active (door presses in 4px, shadow collapses) · transitioning (doors
locked, no re-entry).

**Keyboard:** `←`/`→` move between doors, `Enter`/`Space` selects, `Esc` skips.
Autofocus the door matching `prefers-color-scheme`.

**Edge cases:**
- **Returning visitor** (`localStorage['r-theme']` exists) → skip S00 entirely, land
  straight on S01. Do not gate a returning visitor twice.
- **Deep link** (`/#work`, or any URL with a hash) → skip S00, honour the hash.
- **JS disabled** → S00 is hidden by default in CSS and only shown via a JS-added class,
  so no-JS users land directly on S01 in light theme.
- **Reduced motion** → no flood, no wipe. Halves get a static 2px highlight border on
  hover; selection cross-fades in 100ms.
- **Very short viewport (< 500px tall, e.g. landscape phone)** → stack shrinks: hide the
  sub-labels, reduce sprite to 40px, keep both doors reachable.
- **Slow connection** → doors must be interactive before sprites finish loading. Render
  the color blocks and labels first; sprites are progressive enhancement.

---
### S01 — HERO / PROFILE
---

**UX rationale:** After the airlock, the visitor needs orientation in under 3 seconds:
name, role, place, and a way forward. The hero is asymmetric — text left, mascot right —
because centered hero text is the single most common default layout and we have a
character worth giving real estate to.

**Layout (desktop ≥ 1024px):** 12-col grid. Text block cols 1–6, MOCHI + station scene
cols 7–12. Left-aligned throughout — do not center this.

**Layout (mobile):** MOCHI above (240px tall, cropped scene), text below, buttons full-
width stacked.

```
┌──────────────────────────────────────────────────────────────┐
│  ● ● ●   R // MOON STATION                       [☀|☾] [⚙]   │  ← nav
├──────────────────────────────────┬───────────────────────────┤
│                                  │                           │
│  HELLO, I'M                      │        ✦        ✦         │
│                                  │           🐰              │
│  R U B Y                         │     ┌──────────┐          │
│                                  │     │ ▓▓▓▓▓▓▓▓ │          │
│  UI/UX Designer                  │     │ ▓  R   ▓ │  station │
│  & Research Analyst              │     │ ▓▓▓▓▓▓▓▓ │          │
│                                  │     └──────────┘          │
│  I turn messy problems into      │   ✦          ✦        ✦   │
│  clear, kind interfaces.         │                           │
│  Yangon, Myanmar.                │                           │
│                                  │                           │
│  [ VIEW MY WORK ]  [ RÉSUMÉ ]    │                           │
│                                  │                           │
│  ↓ scroll to launch              │                           │
└──────────────────────────────────┴───────────────────────────┘
```

**Content (final copy — use verbatim):**
- Kicker: `HELLO, I'M`
- H1: `RUBY` *(Silkscreen 700, --t-display, letter-spacing 0.04em)*
- H2: `UI/UX Designer & Research Analyst`
- Lead: `I turn messy problems into clear, kind interfaces. Final-year Business
  Computing student, based in Yangon, Myanmar — currently open to junior UI/UX and
  design-research roles.`
- Primary CTA: `View my work` → scrolls to S06
- Secondary CTA: `Download résumé` → `/R-Ruby-CV-2026.pdf`
- Scroll hint: `scroll to launch` with a 3-frame animated pixel chevron

**Motion (restrained — one orchestrated sequence on load, then stop):**
1. Station scene draws in via dither wipe, 400ms
2. MOCHI drops in, 3-frame landing squash, 200ms
3. Headline reveals character-by-character in `steps()`, 500ms total
4. Subhead + lead fade-step in, 200ms
5. Buttons pop in with a 2px shadow snap, 150ms
Total: under 1.5s. **After this, the hero is static** except for ambient starfield drift
and MOCHI's breathing/blink loop.

**Ambient:** 20–30 star pixels drift right-to-left at 3 different parallax speeds
(2px/s, 4px/s, 7px/s). Pure decoration, `aria-hidden="true"`, killed by reduced-motion.

**Edge cases:**
- Name and role must never wrap awkwardly — test at 320px width
- If the résumé PDF is missing, the button becomes disabled with tooltip `coming soon`
  rather than 404-ing
- On landscape mobile (< 500px tall) drop the station scene, keep MOCHI at 80px inline
- The `↓ scroll to launch` hint must hide once the user has scrolled > 100px

---
### S02 — STATUS TICKER (auto-moving marquee)
---

**UX rationale:** A breather between the hero and the content, and a place for
personality that doesn't cost vertical space. Modeled on the "NOW PLAYING" bar in the
reference image. It also silently demonstrates infinite-marquee technique.

**Layout:** Full-bleed horizontal bar, 56px mobile / 72px desktop. `--bg-sunken`
background, 2px border top and bottom. Sits flush against S01 and S03 with no margin.

```
┌────────────────────────────────────────────────────────────────┐
│ [◉] STATUS: ▸ open to work  ✦  based in Yangon (GMT+6:30) ✦ ... │
└────────────────────────────────────────────────────────────────┘
```

**Content — one continuous loop, separated by ✦ pixel-star glyphs:**
```
STATUS: open to junior UI/UX roles
based in Yangon, Myanmar — GMT+6:30
currently: BSc Business Computing & Information Systems, final year
speaks: Burmese · English · 中文 · 日本語 · हिन्दी
now learning: BI & Analytics
thanks for stopping by my space
```

**Implementation:** duplicate the track twice in the DOM, translate the container
`-50%` over 40s `linear infinite`. Second copy is `aria-hidden="true"` so screen readers
read the content once. The whole marquee is inside a `<div role="marquee"
aria-label="Current status">`.

**States:** `running` (default) · `paused` on hover **and on focus-within** — an
un-pausable marquee is a WCAG 2.2.2 failure · `reduced-motion` → static, wraps to two
lines, shows first 3 items only.

**Edge case:** if content is shorter than the viewport, the track won't fill — duplicate
until `trackWidth >= viewportWidth * 2` before animating.

---
### S03 — ABOUT / THE PROCESS
---

**UX rationale:** The one section on the site that is deliberately *quiet* text. After
the noise of the hero and ticker, a calm, well-set column of prose signals that there's
a real person with real thinking behind the pixels. Restraint here makes the rest land
harder.

**Layout:** Asymmetric two-column at ≥ 768px. Left col (5/12): a `.panel--window` titled
`about.txt` containing a pixel portrait-frame with MOCHI's helmet visor reflecting the
starfield — and a small `[R]` avatar badge. Right col (7/12): prose, max 62ch,
left-aligned.

**Content:**

H2: `Design, but make it human`

Body:
> I'm a UI/UX designer and research analyst who came to design through English
> literature, business computing, and a lot of curiosity about why people give up on
> interfaces.
>
> My work runs the whole cycle — competitive analysis, personas, user flows, high-
> fidelity prototypes, usability testing — grounded in the Design Thinking process. I
> care most about the unglamorous parts: information architecture that doesn't need
> explaining, and copy that tells you what just happened.
>
> Outside of design I tutor, translate across three languages, and reorganise things
> that don't need reorganising. I'm happiest helping people find the shorter path.

**Sub-block — "How I work" (4 stages, horizontally arranged on desktop):**
This IS a genuine sequence, so numbered markers are appropriate here (unlike elsewhere).

| # | Stage | Line |
|---|---|---|
| 01 | Empathise | Talk to people. Read the room. Collect the messy truth. |
| 02 | Define | Turn noise into one clear problem statement. |
| 03 | Ideate & Prototype | Sketch fast, build in Figma, break it early. |
| 04 | Test & Refine | Watch someone use it. Fix what I got wrong. |

Rendered as 4 connected pixel nodes with a dotted 2px connector line between them
(vertical on mobile, horizontal on desktop).

**Motion:** the connector line draws left-to-right in `steps(4)` when the block enters
the viewport, once. Nodes light up in sequence. Do not repeat on re-entry.

**Edge cases:** connector line must not render on mobile if the nodes stack — swap to a
vertical dotted rail. If the prose is edited longer, the panel column must not stretch —
give it `align-self: start` and `position: sticky; top: 96px` on desktop.

---
### S04 — SKILLS INVENTORY (tabbed grid)
---

**UX rationale:** Skill lists are the most-skimmed and least-read part of any portfolio.
Making it an inventory screen with tabs turns scanning into browsing, and the tab
structure lets a recruiter jump straight to the category they care about. Content comes
directly from the CV's skills table.

**Layout:** A `.panel--window` titled `INVENTORY` spanning the container. Inside: tab
strip along the top, then a responsive grid of item slots (2 cols mobile → 3 sm → 4 lg).

```
┌─ INVENTORY ─────────────────────────────── [_][□][×] ─┐
│ ┌────────┬────────┬────────┬─────────┐                │
│ │DESIGN  │ CODE   │RESEARCH│LANGUAGES│                │
│ └────────┴────────┴────────┴─────────┘                │
│                                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │  ▣   │ │  ▤   │ │  ◈   │ │  ▥   │                  │
│  │Figma │ │Wire- │ │Proto-│ │Design│                  │
│  │      │ │frames│ │types │ │System│                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Tab 1 — DESIGN:** Figma · Canva · Wireframing · Prototyping · Design Systems ·
Information Architecture · User Flows · Visual Design

**Tab 2 — CODE:** HTML · CSS · JavaScript · Responsive Web Design · Python (basics) ·
Kotlin (basics) · MySQL · PHP / Laravel · Vibe-coding

**Tab 3 — RESEARCH:** Requirement Gathering · Competitive Analysis · SWOT Analysis ·
User Personas · Usability Testing · Process Documentation · Content Strategy ·
Surveys & Interviews

**Tab 4 — TOOLS:** Microsoft Workspace · Google Workspace · MySQL Workbench ·
Draw.io / Diagramming

*(Spoken languages get their own section — S09 — because they deserve better than a chip.)*

**Each slot:** 16×16 pixel icon (custom, moss on navy) + label + on hover a 2px inner
highlight and the item name appearing in a footer status strip at the bottom of the
panel — like a game inventory tooltip.

**States per slot:** default · hover (inner highlight + status strip updates) ·
focus-visible (4px offset outline) · active (presses 2px down).

**Tabs:** proper `role="tablist"` / `role="tab"` / `role="tabpanel"`, arrow-key
navigation, `aria-selected`, roving tabindex. Content swaps with a 150ms dither
transition, no height jump (`min-height` set to tallest panel).

**Edge cases:** tab strip must scroll horizontally on 320px screens rather than wrap —
add a subtle right-edge fade to signal overflow. If a category is empty, show MOCHI
asleep with `nothing here yet`.

---
### S05 — EXPERIENCE (horizontal scroll section)
---

**UX rationale:** Career history is inherently a horizontal timeline, so scroll direction
matches the mental model rather than fighting it. It's also the clearest possible
demonstration of scroll-driven layout skill. Critically: it must *degrade to vertical*
on touch and reduced motion, because horizontal scroll-jacking on a phone is hostile.

**Concept:** A side-scrolling platformer level. The section pins for `4 × 100vh` of
vertical scroll while the track translates horizontally. MOCHI walks along the ground
line as a scroll-position indicator. Each role is a "platform" the visitor passes.

```
     🐰→
 ════╤═══════════╤═══════════╤═══════════╤════════
     │  2023     │  2024     │ 2024–26   │  2024
  ┌──┴────┐  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐
  │ Art of│  │Stand-  │  │Virtual │  │ Green  │
  │ Living│  │first   │  │Assist. │  │  Go    │
  │       │  │Inst.   │  │& Tutor │  │        │
  └───────┘  └────────┘  └────────┘  └────────┘
```

**Content — 4 stations, in chronological order:**

**1 · Digital Media Management Volunteer** — *Art of Living Myanmar* — 2023 — In-person & Remote
- Co-designed a structured content calendar and produced assets in Canva, contributing to an estimated 30–40% lift in campaign engagement
- Ran ads and built relationships with prospective participants
- Expanded reach across 3 multilingual communities (English, Burmese, Hindi) through translation and content writing

**2 · Content Writer & Researcher Volunteer** — *Standfirst Institute* — 2024 — Remote
- Delivered 10+ research reports, blog content, and business assets for the Business Development Department, on time, using structured multi-source research
- Cut average report length ~20% by restructuring information hierarchy — without losing analytical depth

**3 · Virtual Assistant & Academic Guide** — *Private tutoring clients* — Jan 2024 – 2026 — Online & In-person
- Supported 5+ clients with structured research and academic workflows, reducing per-session prep through standardised research frameworks
- Tutored primary, secondary and adult learners in Maths, English and digital skills across state and international curricula, with lesson plans paced to the individual
- Cut weekly prep time ~30% by building a reusable digital template library

**4 · Volunteer Coordinator** — *Green Go Environmental Initiative, NMA University* — 2024 — In-person
- Coordinated 3 community environmental campaigns reaching 50+ student participants, handling logistics, stakeholder comms, and on-ground execution in a cross-functional team

**Interaction:**
- GSAP ScrollTrigger `pin: true`, `scrub: 1`
- MOCHI walk-cycle plays only while scroll velocity ≠ 0, freezes to idle when still
- A progress rail at the bottom shows position through the timeline
- Each card enters with a 2px shadow snap when it crosses 60% viewport width

**Mandatory fallbacks:**
- **Touch devices** → drop the pin entirely, render as a **vertical stack** of the same
  cards with a left rail connector. Do not use `overflow-x` swipe as the mobile
  solution; native vertical scroll is what people expect.
- **Reduced motion** → vertical stack, no pin, no walk cycle
- **Keyboard** → arrow keys move the track one card at a time when the section has
  focus; `Tab` through the cards must scroll them into view (`scrollIntoView` on focus).
  A pinned section that traps keyboard users is a hard accessibility failure — test this.

**Edge cases:** if the pin height calculation runs before fonts load, the track length
will be wrong — call `ScrollTrigger.refresh()` on `document.fonts.ready`. On window
resize, `refresh()` again (debounced 200ms).

---
### S06 — SELECTED WORK (creative slider)
---

**UX rationale:** This is what a hiring manager came for, so it gets the most deliberate
interaction on the site. A **card-deck slider** — cards stacked with rotation and offset,
draggable, like dealing game cards — because a standard 3-across grid of project cards is
the default every portfolio uses.

**Layout:** Centered stack. Active card front and full-size; next 2 cards peek behind at
`-8px y`, `4deg` and `8deg` rotation, `.dither-25` overlay. Drag left/right or use
arrows to advance.

```
        ┌ 01/04 ──────────────────┐ ← rotated peek
       ┌┴────────────────────────┐│
       │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ││
       │  ▓  pixel case cover ▓  ││
       │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ││
       │                         ││
       │  ECOFOOTPRINT           │┘
       │  Eco-tourism UX/UI      │
       │  [UX RESEARCH][PROTOTYPE]│
       │  DEEP Hackathon · 2026  │
       │  ▸ open case study      │
       └─────────────────────────┘
    [ ‹ ]      ● ○ ○ ○      [ › ]
```

**Content — 4 projects:**

**1 · EcoFootPrint — Digital Eco-Tourism Platform**
`UX Research` `Prototyping` `Design System`
DEEP Ideation Hackathon · 2026
> Co-designed an end-to-end web platform tackling booking transparency and environmental
> preservation in Myanmar tourism. I ran full UX discovery and definition — competitive
> analysis, SWOT, personas, end-to-end user flows, plus primary research (surveys,
> interviews) and secondary findings. Built a cohesive design system and interactive
> high-fidelity prototypes, contributed vibe-coded front-end animation to the shipped
> product, and ran usability testing to validate the decisions.

**2 · InfinityGames — Project Management Dashboard**
`UI Design` `Business Analysis` `Wireframing`
Business Analysis Module · 2024–2026
> Mapped user requirement specifications (HSM) and a rich picture diagram using Soft
> Systems Methodology, then translated them into structured user flows. Designed the
> interface components and layout wireframes with a bias toward clean navigation and
> functional density over decoration.

**3 · Retail Camping & Social Media Platforms**
`Front-End` `Full-Stack` `UI/UX`
Web Development Module · 2023–2026
> Designed and built responsive interfaces in HTML, CSS and JavaScript — and went full-
> stack with MySQL and PHP (Laravel) for the social media campaign site. Produced the
> supporting documentation too: user requirements, data flow diagrams, and ERDs.

**4 · Relational Database Designs**
`Systems Design` `Data Modelling` `Documentation`
Database Modules · 2024–2026
> Designed normalised 3NF schemas and EERDs across five business scenarios — game rental,
> talent recruitment, booking and transport management, and kitchen supply — implemented
> in MySQL with full CRUD. Produced use-case diagrams, system requirement specs, and
> stakeholder analysis alongside.

**Interactions:**
- **Drag** — pointer events, card follows with rotation proportional to drag distance;
  release past 25% of card width advances, otherwise springs back
- **Keyboard** — `←`/`→` change card, `Enter` opens case study
- **Arrows + dots** — always visible, always operable. Dots are `role="tablist"`.
- **Autoplay** — none. Do not auto-advance a slider carrying primary content; it's a
  WCAG 2.2.2 problem and it steals reading time.

**Card states:** default · hover (shadow deepens to 6px, card lifts 2px) · dragging
(cursor → grabbing, rotation follows) · active/front · behind (dithered, `inert`,
`aria-hidden`) · focus-visible · loading (dither-filled cover placeholder).

**Case study view:** clicking `open case study` expands the card to a full-screen
`.panel--window` overlay containing Problem · My Role · Process · Outcome · What I'd do
differently. Focus trap, `Esc` to close, returns focus to the trigger card, background
`inert`, body scroll locked.

**Edge cases:**
- Long project titles must wrap to max 2 lines then ellipsis with the full title in
  `title`/`aria-label`
- Cover images missing → dither-filled block with the project initial in Silkscreen
- If only 1 project exists → hide arrows and dots, render a single static card
- Drag must not fire on vertical swipe (touch): only capture if `|Δx| > |Δy| * 1.5`

---
### S07 — EDUCATION & CERTIFICATIONS (save-file slots)
---

**UX rationale:** Credentials are a scanning task, not a reading task — so structure
beats prose. Rendered as game "save file" slots, which gives each entry a consistent
scannable shape (title / institution / date / status) and reads instantly.

**Layout:** 3 stacked save-slot panels for education, then a compact 2-col grid for
certifications at ≥ 640px.

**Education slots:**

```
┌─ SAVE FILE 01 ────────────────────── IN PROGRESS ─┐
│ BSc Business Computing & Information Systems      │
│ Strategy First College — University of Lancashire │
│ Final year · expected early 2027                  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  progress              │
└───────────────────────────────────────────────────┘

┌─ SAVE FILE 02 ─────────────────────── COMPLETE ───┐
│ NCC Level 5 Advanced Diploma                      │
│ Computing with Business Management                │
│ NMA College, Faculty of Information Technology    │
│ 2023 – 2025                                       │
└───────────────────────────────────────────────────┘

┌─ SAVE FILE 03 ─────────────────────── COMPLETE ───┐
│ BA English Literature                             │
│ East Yangon University                            │
│ 2022 – 2025                                       │
└───────────────────────────────────────────────────┘
```

**Certifications — 7 items as compact badge cards:**

| Certification | Provider | Year |
|---|---|---|
| AI-Powered Youth Entrepreneurship | Strategy First International College | 2026 |
| Essential Skills for Business Careers (CSR) | Strategy First International College | 2026 |
| International Trade Basic Course | Trade Training Institute | 2026 |
| BI & Analytics Skill Enhancement | Self-directed | 2026 — ongoing |
| Crash Course: AI & Machine Learning | VIT Chennai, India | 2024 |
| Crash Course: Embedded Systems & IoT Design | VIT Chennai, India | 2024 |
| Youth Leadership & Wellbeing Program | Art of Living Myanmar | 2023 |

Each cert card: 16px pixel medal icon, name (Pixelify 600), provider (Plex Mono small),
year badge top-right. Ongoing items get a pulsing 4px moss dot.

**Motion:** the "in progress" bar fills once on viewport entry, `steps(20)`, 800ms. Once
only.

**Edge cases:** long certification names wrap to 3 lines max — set a `min-height` on all
cert cards so the grid stays even. Provider names longer than the card get `text-wrap:
balance`.

---
### S08 — LANGUAGES (stat bars)
---

**UX rationale:** Five languages is a genuine differentiator and a chip list buries it.
RPG-style proficiency bars make the range immediately legible and are honest about level
— which matters, because inflating language ability is a common CV failure.

**Layout:** A `.panel--window` titled `LANGUAGE STATS`. Rows of label + segmented bar +
level tag. Single column mobile, 2-col at ≥ 768px.

```
┌─ LANGUAGE STATS ──────────────────────────┐
│ Burmese    ▓▓▓▓▓▓▓▓▓▓  NATIVE             │
│ English    ▓▓▓▓▓▓▓▓░░  B2 / C1            │
│ Hindi      ▓▓▓▓▓▓░░░░  INTERMEDIATE       │
│ 日本語      ▓▓▓▓▓░░░░░  JLPT N4            │
│ 中文        ▓▓▓░░░░░░░  HSK 2              │
└───────────────────────────────────────────┘
```

**Bars:** 10 discrete 12px segments with 4px gaps — never a continuous bar. Filled
segments use `--brand`, empty use `.dither-25`.

**Motion:** segments fill one at a time, `steps(1)` per segment, 60ms apart, on viewport
entry. Once. This is the one place ambient motion earns itself — it reads as a stat
screen loading.

**Accessibility:** each bar is `role="meter"` with `aria-valuenow`, `aria-valuemin="0"`,
`aria-valuemax="10"`, and `aria-label="English proficiency: B2 to C1"`. **Never rely on
bar length alone** — the text level tag is required, not decorative.

---
### S09 — KIND WORDS (testimonials) *[optional — see edge case]*
---

Three quote cards in a row (desktop) / swipeable (mobile), matching the reference image's
testimonial band. Each: pixel avatar, quote, name, role, 4 pixel hearts.

**Edge case — the important one:** Ruby is early-career and may not have quotes yet.
**If there are fewer than 2 real testimonials, do not build this section.** Placeholder
or invented testimonials are actively damaging to credibility. Instead, replace with a
**"Currently exploring"** band: 3 cards covering BI & Analytics, Design Systems at scale,
and Front-end animation — an honest signal of trajectory. Ship that version by default;
swap in real quotes later.

---
### S10 — CONTACT / "THE BREAK ROOM"
---

**UX rationale:** The final ask. Most portfolios end with a cold form. This one offers
warmth first and the form second, because the emotional register — you've come a long
way, sit down, have a coffee — makes contacting feel low-stakes rather than transactional.
It's also where MOCHI's moon-rabbit logic pays off.

**Layout:** Two panels side by side at ≥ 768px, stacked on mobile.
Left: the break-room scene + copy. Right: the form.

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  ☕  🍪    🐰                │  │  ┌ SEND A TRANSMISSION ───┐ │
│                             │  │  │ name                   │ │
│  In case you're feeling     │  │  │ [____________________] │ │
│  tired — here are cookies   │  │  │ email                  │ │
│  and coffee.                │  │  │ [____________________] │ │
│                             │  │  │ what's on your mind?   │ │
│  Thank you for stopping by  │  │  │ [                    ] │ │
│  my space.                  │  │  │ [____________________] │ │
│                             │  │  │      [ SEND IT ]       │ │
│  Take a seat, take a break, │  │  └────────────────────────┘ │
│  and say hello.             │  │                             │
└─────────────────────────────┘  └─────────────────────────────┘
```

**Content (use verbatim — this copy is the point of the section):**

H2: `The Break Room`

Left panel:
> In case you're feeling tired — here are cookies and coffee. ☕ 🍪
>
> Thank you for stopping by my space. Take a seat, take a break, and say hello whenever
> you're ready. I read everything.

Form panel title: `SEND A TRANSMISSION`

**Form fields:**
| Field | Type | Label | Placeholder | Validation |
|---|---|---|---|---|
| name | text | `Your name` | `who's there?` | required, 2–60 chars |
| email | email | `Email` | `where do I reply?` | required, valid format |
| subject | select | `About` | — | optional: Job opportunity / Freelance / Collaboration / Just saying hi |
| message | textarea | `What's on your mind?` | `say anything — I read everything` | required, 10–1500 chars, live counter |

Submit button: `Send it`

**Direct contact links** below the form:
- Email → `rubytitanx@gmail.com` *(render obfuscated — see edge cases)*
- LinkedIn → **⚠ TODO: the CV has an incomplete URL (`linkedin.com/in/`). Ruby must
  supply the full handle. Until then, omit the link entirely rather than shipping a
  broken one.**
- Location → `Botahtaung, Yangon, Myanmar`
- **Phone: do NOT publish.** The CV contains `+959755040184`. Publishing a personal
  mobile number on a public site invites spam and worse. Keep it on the CV PDF only.

**Ambient motion:** coffee steam — 3 pixel-puff particles rising and dissipating on a
staggered 4s loop, `steps(4)`. Cookie has a bite taken out on click (swap sprite,
3 stages, then reset after 5s). This is a small reward, not a feature.

**Form states — build all of them:**
| State | Field treatment | Button | MOCHI |
|---|---|---|---|
| default | 2px border, `.panel--sunken` | enabled, amber | idle |
| focus | 4px moss outline, offset 2px, border → `--brand` | — | ears perk |
| filled-valid | 2px moss border + small ✓ pixel glyph | enabled | — |
| error | 2px `--error` border + inline message below + ⚠ glyph | enabled | ears droop |
| disabled | `.dither-25` fill, `--ink-mute` text | `.dither-50`, `not-allowed` | — |
| submitting | fields `readonly`, dimmed | 4-frame pixel loader, label `sending…` | waving |
| success | form replaced by success panel | — | jumps, confetti |
| network fail | fields retained | label `try again` | droops |

**Success panel copy:**
> `Transmission received. ✦`
> I'll get back to you within a couple of days. In the meantime — help yourself to
> another cookie.
> `[ send another ]`

**Error message rules** (per the writing guidance — errors state what happened and how to
fix it, they don't apologise and they're never vague):
- name empty → `Add your name so I know who I'm replying to.`
- email empty → `Add an email so I can write back.`
- email invalid → `That email doesn't look right — check for a typo.`
- message too short → `A few more words would help — 10 characters minimum.`
- message too long → `That's over 1500 characters. Trim it, or email me directly.`
- network fail → `The message didn't send. Check your connection and try again.`

**Accessibility:** every input has a real `<label>` (not a placeholder acting as one).
Errors use `aria-describedby` linking to the message, plus `aria-invalid="true"`. The
error summary is `role="alert"`. On submit failure, move focus to the first invalid
field.

**Edge cases:**
- **Email obfuscation:** render as `rubytitanx [at] gmail [dot] com` and assemble the real
  `mailto:` in JS on click, or use a `data-` attribute reversed at runtime. Plain-text
  mailto links get harvested within days.
- **Spam:** add a honeypot field (visually hidden, `tabindex="-1"`, `autocomplete="off"`)
  plus a minimum 3-second time-to-submit check. **Do not add a CAPTCHA** — it's an
  accessibility barrier and unnecessary at this traffic level.
- **No backend:** use Netlify Forms (`data-netlify="true"`) or Formspree. Both are free
  and need no server.
- **Autofill:** style `:-webkit-autofill` so browser yellow doesn't break the theme.
- **Mobile keyboard:** correct `inputmode` and `autocomplete` on every field
  (`autocomplete="name"`, `"email"`). Scroll the focused field into view above the
  keyboard.

---
### S11 — FOOTER / SIGN-OFF
---

**UX rationale:** The last thing a visitor reads. It should feel like leaving somewhere,
not like hitting the bottom of a page. Warm, brief, and it repeats the one action that
matters — get in touch.

**Layout:** Full-bleed `--bg-sunken`, 2px top border. A horizon line of pixel ground with
MOCHI standing on it waving, stars above. Below the scene: a 3-col link grid on desktop,
stacked on mobile.

```
        ✦        ✦             ✦
                🐰  (waving)
   ═══════════════════════════════════════════
   Come visit again. See you, space traveller.

   NAVIGATE        ELSEWHERE       THIS SITE
   Home            LinkedIn        Built with React
   Work            Email           & too much coffee
   Skills          Résumé (PDF)    Pixel art by R
   Contact

   ─────────────────────────────────────────
   R // MOON STATION            © 2026 Ruby
   [☀|☾]                     made in Yangon 🌙
```

**Content (verbatim):**
- Sign-off headline: `Come visit again. See you, space traveller.`
- Sub-line: `Thanks for stopping by my space. ✦`
- Column heads: `NAVIGATE` · `ELSEWHERE` · `THIS SITE`
- Colophon: `Built with React, Tailwind and too much coffee. Pixel art hand-placed by R.`
- Legal line: `© 2026 Ruby — R // Moon Station · Made in Yangon`
- Easter egg: clicking MOCHI in the footer 5× triggers a small confetti-pixel burst and
  the bubble `you found me! ✦`

**Motion:** MOCHI's wave is a 4-frame `steps(4)` loop, 2s. Stars twinkle at 3 different
random intervals (2–5s). All ambient, all killed by reduced-motion.

**Edge cases:** the ground line must span full-bleed at every width without tiling
seams — use a repeating SVG pattern, not a fixed-width image. On very wide screens
(> 1600px) add 2 more decorative sprites in the margins rather than letting the scene
stretch.

---
### S12 — 404 PAGE
---

Don't skip this — a broken link is a real exit point.

```
        🐰  (floating away, snapped cable)

              4 0 4

    Lost in space. This page drifted off.

        [ back to the station ]
```
Copy: `Lost in space. This page drifted off somewhere — let's get you back.`
Button returns to `/`. Keeps nav, footer, theme, and cursor intact.

---

## 7. COMPONENT STATE MATRIX

**Every interactive component must implement all applicable states.** No exceptions.

| Component | default | hover | focus-visible | active | disabled | loading | error | empty |
|---|---|---|---|---|---|---|---|---|
| PixelButton (primary) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| PixelButton (secondary) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| PixelInput | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| Textarea | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| Select | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Nav link | ✓ | ✓ | ✓ | ✓ (current) | — | — | — | — |
| Theme switch | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| Project card | ✓ | ✓ | ✓ | ✓ (dragging) | — | ✓ | ✓ (img fail) | ✓ |
| Inventory slot | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ |
| Tab | ✓ | ✓ | ✓ | ✓ (selected) | ✓ | — | — | ✓ |
| Slider arrow | ✓ | ✓ | ✓ | ✓ | ✓ (at end) | — | — | — |
| Floating bot | ✓ | ✓ | ✓ | ✓ (open) | — | — | ✓ | — |
| Save-file slot | ✓ | ✓ | ✓ | — | — | ✓ | — | — |

**Button state definitions (apply consistently):**
```
default   → bg: --brand, border 2px --line, shadow 4px 4px 0 --shadow
hover     → shadow 6px 6px 0, translate(-2px,-2px)
active    → shadow 0px 0px 0, translate(4px,4px)          [the "press" — essential]
focus     → outline 4px solid --accent, outline-offset 4px [never remove]
disabled  → .dither-25 fill, --ink-mute text, cursor not-allowed, no shadow
loading   → 4-frame pixel spinner replaces label, aria-busy="true"
```

**Focus rule:** `:focus-visible` must be visible on *every* interactive element, at 4px,
offset 4px, in `--accent`. Never `outline: none` without a replacement. Tab through the
entire site with the mouse untouched as an acceptance test.

---

## 8. GLOBAL EDGE CASES & FAILURE MODES

Handle all of these — this is what separates a portfolio from a demo.

**Content extremes**
- Longest project title, longest cert name, longest job title — set `min-height` on
  card grids so rows stay even
- Empty data array in any `src/data/*.ts` → render the MOCHI-asleep empty state, never a
  blank gap
- A single item in a grid built for 4 → must not stretch full-width; cap at one column's
  width and left-align

**Viewport extremes**
- 320px wide (iPhone SE) — nothing overflows horizontally. Set
  `html { overflow-x: hidden }` only as a last resort; fix the actual overflow first.
- 2560px wide — container caps at 1200px, decorative sprites fill the margins
- Landscape phone (< 500px tall) — S00 and S01 must both remain usable
- Browser zoom to 200% — WCAG requirement, layout must reflow without loss of content

**Capability failures**
- **JS disabled** → all content still readable. Sections render statically, airlock
  hidden, slider becomes a vertical list, form shows a mailto fallback.
- **Fonts fail to load** → `font-display: swap` with a monospace fallback stack;
  layout must not shift more than 0.1 CLS
- **Images fail** → every `<img>` has meaningful `alt`; decorative sprites are
  `alt=""` + `aria-hidden`; broken covers fall back to dither blocks
- **Slow 3G** → hero LCP under 2.5s. Sprites lazy-loaded below the fold. Fonts
  preloaded with `<link rel="preload">`.

**Interaction hazards**
- Pinned horizontal section (S05) must never trap keyboard focus
- Modal case study must trap focus *while open* and release it on close
- Body scroll lock on modal must not cause layout shift (compensate for scrollbar width)
- Marquee and slider both pausable
- Custom cursor disabled on touch, and toggleable everywhere

---

## 9. ACCESSIBILITY ACCEPTANCE CRITERIA (WCAG 2.1 AA)

Ship blockers. Verify each before deploy.

- [ ] All text ≥ 4.5:1 contrast; large text (≥ 24px or ≥ 19px bold) ≥ 3:1
- [ ] UI component borders and focus indicators ≥ 3:1 against adjacent colors
- [ ] Both themes independently verified
- [ ] Full keyboard operability, no traps, logical tab order, visible focus everywhere
- [ ] Skip-to-content link as the first tabbable element
- [ ] One `<h1>`, no heading levels skipped
- [ ] Landmarks: `header`, `nav`, `main`, `footer`, `section[aria-labelledby]`
- [ ] All form inputs have real labels; errors are programmatically associated
- [ ] All auto-moving content (marquee, ambient sprites) is pausable or under 5 seconds
- [ ] No content conveyed by color alone (language bars carry text levels)
- [ ] `prefers-reduced-motion` fully honoured — site remains complete and attractive
- [ ] Touch targets ≥ 44×44px (a 16px pixel icon needs padding to reach this)
- [ ] Page usable at 200% zoom and at 320px width
- [ ] `lang="en"` on `<html>`; `lang` attributes on 日本語 / 中文 / हिन्दी strings
- [ ] Screen-reader pass: nav → hero → each section → form → footer makes sense in order
- [ ] Custom cursor has a system-cursor escape hatch

---

## 10. PERFORMANCE TARGETS

- Lighthouse: Performance ≥ 90, Accessibility **100**, Best Practices ≥ 95, SEO ≥ 95
- LCP < 2.5s · CLS < 0.1 · INP < 200ms
- Total JS bundle < 200KB gzipped (GSAP is the heavy item — import only
  `gsap/ScrollTrigger`, not the full plugin set)
- Sprites as SVG or a single sprite sheet — no per-frame PNG requests
- Fonts: subset to Latin + the specific CJK/Devanagari glyphs used in S02/S08; preload
  the two display faces only

---

## 11. SEO & META

```html
<title>Ruby — UI/UX Designer & Research Analyst | Yangon</title>
<meta name="description" content="Portfolio of Ruby (R), a UI/UX designer and research
analyst in Yangon, Myanmar. End-to-end UX research, prototyping, and front-end work —
in a pixel-art space station.">
```
- Open Graph + Twitter card image: a 1200×630 pixel-art station scene with MOCHI and the
  `R // MOON STATION` wordmark
- `Person` + `CreativeWork` JSON-LD schema
- Favicon set: pixel `R` in a moss square, 16 / 32 / 180 / 512px
- `sitemap.xml` and `robots.txt`

---

## 12. CONTENT SOURCE OF TRUTH

All copy in this spec is final and drawn from the CV. Notes:

- **Name displayed as:** `Ruby` (hero), `R` (logo, footer, mascot patch)
- **Role:** `UI/UX Designer & Research Analyst`
- **Email:** `rubytitanx@gmail.com` — obfuscate on render
- **Location:** `Botahtaung, Yangon, Myanmar`
- **Phone:** in the CV, **not published on the site**
- **LinkedIn:** ⚠ incomplete in the CV — needs the full handle before the link ships
- **Résumé PDF:** place at `/public/R-Ruby-CV-2026.pdf`

**Metrics are quoted as estimates** where the CV does so (`~20%`, `30–40%`). Keep the
hedging language — it's more credible than false precision, and it's honest.

---

## 13. VOICE & MICROCOPY RULES

- Sentence case everywhere except HUD chrome (`STATUS:`, `INVENTORY`, `SAVE FILE 01`),
  where all-caps is the genuine game convention
- Buttons name the outcome: `Send it`, `View my work`, `Download résumé` — never `Submit`
- An action keeps its name through the whole flow: `Send it` → `sending…` → `Sent`
- Errors say what happened and what to do. No apologies, no vagueness.
- Empty states are invitations, not dead ends
- MOCHI speaks in lowercase, short, never more than 6 words
- No exclamation marks outside MOCHI's dialogue

---

## 14. BUILD ORDER

Do not build sections out of order — later phases depend on earlier primitives.

**Phase 1 — Foundation**
Vite + React + TS + Tailwind scaffold · `tokens.css` with both themes · fonts loaded ·
`base.css` pixel contract · `useTheme` hook · `Panel`, `PixelButton`, `PixelInput`,
`Container`, `Section` primitives. **Build a `/styleguide` route showing every component
in every state from the §7 matrix.** Verify contrast here before building any section.

**Phase 2 — Shell**
Nav (desktop + mobile dock) · Footer skeleton · scroll-spy · skip link · Lenis ·
`useReducedMotion` · settings menu · routing + 404.

**Phase 3 — Character & cursor**
MOCHI SVG sprite with all states · `FloatingBot` + speech bubble + state machine ·
`PixelCursor` with all states and both guards. Test on touch and with reduced motion
before moving on.

**Phase 4 — Core content sections**
S01 Hero → S02 Ticker → S03 About → S04 Skills → S07 Education → S08 Languages.
These are the static-layout sections; get them right before adding scroll complexity.

**Phase 5 — Complex interaction**
S05 horizontal scroll (with the vertical fallback built *first*, then the pin added on
top) → S06 card-deck slider + case study modal.

**Phase 6 — The gate**
S00 Airlock. Build last so it transitions into a site that already exists. Include the
returning-visitor and deep-link bypasses from day one.

**Phase 7 — Contact & polish**
S10 form + all 8 states + Netlify Forms wiring · S11 footer scene · S09 decision (real
testimonials or the "Currently exploring" band) · easter egg.

**Phase 8 — Hardening**
Full §9 accessibility checklist · reduced-motion pass · 320px pass · 200% zoom pass ·
no-JS pass · Lighthouse · cross-browser (Safari `clip-path` and `steps()` are the usual
offenders) · deploy to Netlify.

---

## 15. ACCEPTANCE TESTS

The site is done when all of these pass:

1. Tab from the top of the page to the bottom using only the keyboard, in both themes,
   without getting stuck or losing the focus ring
2. Turn on `prefers-reduced-motion` — every section is complete, usable, and still looks
   designed
3. Load at 320px width — nothing overflows horizontally
4. Disable JavaScript — all content is readable and contact is possible
5. Zoom to 200% — no content is lost or clipped
6. Read the whole page with a screen reader — the order makes sense and the marquee
   doesn't repeat itself
7. Load on a real phone — the horizontal section scrolls vertically, the cursor is native,
   the bot doesn't cover the send button
8. Lighthouse accessibility scores 100

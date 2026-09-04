# Phase 1 — build notes and spec queries

Everything below came out of building Section 2 and Section 7 for real and
measuring the result. The `/styleguide` route re-runs the contrast audit on
every load, so these numbers are reproducible, not one-off.

---

## 1. Contrast failures in the spec's own tokens

§14 says "verify contrast here before building any section." Doing that turned
up five pairings that miss WCAG AA. Three are surfaces the spec never assigns a
foreground colour to; two are spec values that don't hold.

### 1a. `--error: #C2543D` fails as body text in both themes

| Surface | Measured | Needs |
|---|---|---|
| light `--bg-raised` | 4.15:1 | 4.5:1 |
| light `--bg` | 3.81:1 | 4.5:1 |
| dark `--bg-raised` | 3.48:1 | 4.5:1 |
| dark `--bg` | 4.04:1 | 4.5:1 |

The same red is fine as a **2px field border**, where the threshold is 3:1.
So rather than change `--error`, I added `--error-ink` for message text only:

- light `#9F4532` — 5.23 / 5.70 / 4.73 on bg / raised / sunken
- dark `#E96549` — 5.60 / 4.82 / 5.95

**Decision needed:** keep this split, or restate `--error` per theme.

### 1b. `--ink-mute` doesn't clear 4.5:1 on `--bg-sunken`

The spec annotates `--ink-mute: #5A6B58` as "5.1:1 ✓ AA". It actually measures
**4.79:1** on `--paper`, and only **4.34:1** on `--bg-sunken`.

> **Revised in Phase 2.** Phase 1 left the token alone and added a separate
> `--ink-placeholder`. That was too narrow — the footer's legal line is also
> `--ink-mute` on `--bg-sunken` and hit the same 4.34:1. The light value is now
> **`#536251`** (5.45 / 5.94 / 4.94 on bg / raised / sunken), so the token is
> safe on every surface, and `--ink-placeholder` is just an alias.
> Dark `--ink-mute` was already fine and is unchanged.

### 1c. The focus ring colour — §7 and S00 contradict each other

§7 says the ring is `--accent`. S00's state list says "4px moss outline". On
the light theme they cannot both be right:

| Ring | on `--bg` | on `--bg-raised` | inside a well |
|---|---|---|---|
| amber-700 (§7) | 3.22 | 3.51 | **2.92** |
| moss-700 (S00) | 6.32 | 6.89 | 5.72 |

Amber misses the 3:1 minimum that §9 lists as a ship blocker. **Light now
follows S00 (moss-700); dark follows §7 (amber-500, 8.14:1 on the void).**
It's one line per theme in `tokens.css` if you'd rather go the other way.

There's a second reason to prefer moss: §2.2's accent discipline caps amber at
four places sitewide, and a focus ring appears on every interactive element.

### 1d. Filled surfaces have no foreground colour in the spec

§7 defines a brand-filled button but never says what colour the label is. Added
and measured: `--on-brand`, `--on-accent`, `--on-line`. Note that the obvious
choice for the light accent button — `--star` on amber-700 — measures 3.48:1
and fails; it uses `--navy-900` (4.77:1) instead.

### 1e. Disabled controls were illegible as specified

§7 says disabled is "`.dither-25` fill, `--ink-mute` text". Built literally, the
pattern and the label are the same colour and the label vanishes. The dither ink
is now knocked back to `--dither-mute` (45% `--ink-mute` over the surface) with
the label left at full `--ink-mute`. Same look, readable label.

**Current status: all 22 audited pairings pass in both themes.**

---

## 2. Smaller things worth knowing

**Silkscreen at fluid sizes.** §2.3 sets `--t-display` and `--t-h1` with
`clamp()`, which produces fractional pixel sizes at most viewport widths.
Silkscreen is a true bitmap face and only stays crisp at whole multiples of its
design size — so on many screens the hero headline will be slightly soft, which
works against §2.1. Built as specified for now. If you want it truly crisp,
the fix is stepped sizes at breakpoints for the two Silkscreen roles only, and
`clamp()` everywhere else. Your call.

**CJK and Devanagari coverage.** §10 asks for the font subset to include the
glyphs used in S02 and S08 — but none of the three chosen families covers
Burmese, Japanese, Chinese or Devanagari. `日本語`, `中文` and `हिन्दी` will fall
back to a system face. Not a Phase 1 problem; it needs a decision before S02.
Options: add Noto Sans JP/SC/Devanagari subsets, or accept the fallback.

**Section numbering.** §3.1 and §3.2 place Contact at S11 and the footer after
it; §6 defines Contact as **S10** and the footer as **S11**. §5's file-structure
comment says `S00Airlock ... S12Footer`, but S12 is the 404. I've followed §6
throughout since it's the one with the actual blueprints.

**Field focus treatment.** The S10 form table specifies "4px moss outline,
offset 2px" for fields, while §7's global focus rule says offset 4px. I used the
global rule everywhere so focus looks identical across the site. Flagging in
case the 2px offset was deliberate for dense form layouts.

---

## 3. Deviations I made without asking

- **Tailwind v3**, not v4 — §5 describes a `theme.extend` config with a
  `borderRadius` override, which is v3's shape.
- `borderRadius`, `boxShadow` and `borderWidth` **replace** rather than extend
  Tailwind's scales, so there is no `rounded-lg`, no blurred `shadow-md` and no
  `border` (1px) utility to reach for by accident. §2.1 rules 1–3 are enforced
  by the toolchain, not by discipline.
- `/styleguide` uses a tighter section rhythm than §2.4. It's a lookup table,
  not a narrative page. `Section` takes a `dense` prop; the site itself will use
  the full rhythm.
- The window-chrome `[_][□][×]` glyphs are `aria-hidden`. They carry no
  behaviour, so announcing them as buttons would be a false affordance.

---

## 4. Automated checks now passing

Run against all 1,129 elements on `/styleguide`:

- 0 non-zero `border-radius`
- 0 `box-shadow` with a blur radius
- 0 gradients other than the dither's `repeating-conic-gradient`
- 0 interactive targets under 44×44
- 37/37 focusable elements show a 4px ring at 4px offset
- no horizontal overflow at 320px (the contrast table scrolls inside its own
  container, which is the §8-sanctioned pattern)
- Silkscreen 400/700, Pixelify Sans 400–700 and IBM Plex Mono 400 all load and
  are applied to the roles §2.3 assigns them

---

## 5. Still open, needs Ruby

- **LinkedIn handle** — §12 flags the CV URL as incomplete. Needed before S10
  and S11 ship, or those links stay omitted.
- **`/public/R-Ruby-CV-2026.pdf`** — not in the repo yet. The résumé button has
  a disabled state ready for it (§S01 edge case).
- The focus-ring decision in **1c** above.

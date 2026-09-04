# Scope

**This is a responsive front-end portfolio. No backend, no server, no
third-party form service.**

Decided 2026-09-04, and it overrides the spec wherever the two disagree.

## What that removes from the spec

- **§S10 "No backend: use Netlify Forms (`data-netlify="true"`) or Formspree."**
  Neither. The contact form is built and validated entirely client-side —
  every field, every rule, and all eight states from the §S10 table — and
  submitting hands off to the visitor's mail client with a prefilled
  `mailto:`. Nothing is posted anywhere.
- **The spam controls that only make sense with a submit endpoint.** No
  honeypot field, no time-to-submit check. There is nothing to spam. (The
  §S10 instruction "do not add a CAPTCHA" still holds, for the same reason it
  always did.)
- **Any suggestion of storing or transmitting messages.** Nothing the visitor
  types leaves their machine except through their own mail client.

## What stays

- Everything visual, interactive and accessible in §§2–9.
- `public/_redirects` — two lines of static-host routing so the S12 404
  resolves instead of the host's own error page. Routing config for a static
  file server, not a backend.
- `localStorage` for theme and settings (§4.2, §4.5) — the visitor's own
  browser, no server involved.

## Consequence for the résumé and links

Unchanged: the résumé is a static file in `/public`, and the email address is
obfuscated in the markup and assembled at click time (§S10). Both are
front-end concerns.

---

## Later decisions recorded here

### The contact form's success copy (Phase 7, decided 2026-09-04)

§S10's success panel says "Transmission received." With no backend, nothing is
received — submitting opens the visitor's mail client with the message
prefilled. **Decision: ship §S10's copy as written for now** (option 3 of
three). The two alternatives stay open and are both small changes:

1. Reword the success panel to describe the mail-client handoff.
2. Add a form service (Formspree free tier), which would make the existing
   copy literally true — at the cost of reintroducing a backend.

Consequence: §S10's eighth form state, *network fail*, cannot occur naturally.
It is built and wired to the compose-throw case, but its copy assumes a send.

### JavaScript disabled (Phase 6/8)

§5 mandates a Vite + React SPA; §8 and §15's fourth acceptance test require
that all content is readable with JS disabled. Those cannot both hold — a
client-rendered SPA serves an empty root element.

**Partial resolution, shipped:** `index.html` carries a `<noscript>` fallback
with Ruby's name, role, the hero lead, a working `mailto:` link, her location,
and a summary of what the site contains. That satisfies §15's "contact is
possible" but **not** full content parity.

**Still open:** prerendering the routes at build time would satisfy §8
literally. It adds a build step and is a real decision, not a default.

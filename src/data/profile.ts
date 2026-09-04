/**
 * §12 — content source of truth. Copy here is verbatim from the spec.
 *
 * One deliberate omission, from §12 and §S10:
 *  - Phone: in the CV, never published on the site. Publishing a personal
 *    mobile invites spam and worse.
 *
 * LinkedIn was the other one — §12 flagged the CV's URL as incomplete, and it
 * has since been supplied, so the link now ships.
 */

export const PROFILE = {
  name: 'Ruby',
  mark: 'R',
  role: 'UI/UX Designer & Research Analyst',
  wordmark: 'R // MOON STATION',
  location: 'Botahtaung, Yangon, Myanmar',
  /** Split so no plain-text mailto ever reaches the markup (§S10). */
  email: { user: 'rubytitanx', domain: 'gmail.com' },
  /** §12 flagged the CV's URL as incomplete; Ruby supplied the full handle. */
  linkedin: 'https://linkedin.com/in/ruby-474067229',
  github: 'https://github.com/ruby9264',
  cv: '/R-Ruby-CV-2026.pdf',
} as const

/** §S10 — assembled at click time, never rendered as a harvestable string. */
export const emailAddress = () => `${PROFILE.email.user}@${PROFILE.email.domain}`
export const emailObfuscated = () =>
  `${PROFILE.email.user} [at] ${PROFILE.email.domain.replace('.', ' [dot] ')}`

/** §S01 — "final copy, use verbatim". */
export const HERO = {
  kicker: "HELLO, I'M",
  name: 'RUBY',
  role: 'UI/UX Designer & Research Analyst',
  lead: 'I turn messy problems into clear, kind interfaces. Final-year Business Computing student, based in Yangon, Myanmar — currently open to junior UI/UX and design-research roles.',
  primaryCta: 'View my work',
  secondaryCta: 'Download CV',
  /** §S01 edge case: the button is disabled with this tooltip if the PDF is absent. */
  cvMissingHint: 'coming soon',
  scrollHint: 'scroll to launch',
} as const

export const FOOTER = {
  signOff: 'Come visit again. See you, space traveller.',
  subLine: 'Thanks for stopping by my space. ✦',
  colophon: 'Built with React, Tailwind and too much coffee. Pixel art hand-placed by R.',
  legal: '© 2026 Ruby — R // Moon Station · Made in Yangon',
  columns: {
    navigate: 'NAVIGATE',
    elsewhere: 'ELSEWHERE',
    thisSite: 'THIS SITE',
  },
} as const

export const NOT_FOUND = {
  code: '404',
  message: "Lost in space. This page drifted off somewhere — let's get you back.",
  cta: 'Back to the station',
} as const

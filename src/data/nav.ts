/**
 * §5 — all content lives in src/data as typed arrays, never in JSX.
 *
 * Order note: §4.4 lists the dock as Home, Work, Skills, About, Contact, but
 * §6 places About at S03, Skills at S04 and Work at S06. Following §4.4 would
 * make the scroll-spy indicator jump backwards as you scroll, so these are in
 * document order instead. See docs/PHASE-2-NOTES.md.
 */

export type NavItem = {
  /** Matches the section's DOM id, and the URL hash. */
  id: string
  /** Nav bar and dock label. Sentence case per §13. */
  label: string
  /** Section this maps to in §6, for reference while the sections get built. */
  section: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', section: 'S01' },
  { id: 'about', label: 'About', section: 'S03' },
  { id: 'skills', label: 'Skills', section: 'S04' },
  { id: 'work', label: 'Work', section: 'S06' },
  { id: 'contact', label: 'Contact', section: 'S10' },
]

export const NAV_IDS = NAV_ITEMS.map((item) => item.id)

/**
 * §S02 — the status board. Four rows, each a category label followed by its
 * own items, every item carrying a tiny pixel glyph.
 *
 * Each row scrolls as its own continuous loop, so the content of a row is
 * written here as one flat list and the section handles the repetition.
 * Text is stored in natural case; the section upper-cases it in CSS, which
 * keeps the string readable to a screen reader (§13 puts all-caps in the
 * chrome layer only).
 */

export type TickerIconName =
  | 'design'
  | 'data'
  | 'tech'
  | 'business'
  | 'languages'
  | 'curious'
  | 'analytical'
  | 'rabbit'
  | 'anime'
  | 'manga'
  | 'gaming'
  | 'reading'
  | 'films'
  | 'analysing'
  | 'learning'
  | 'experimenting'

export type TickerItem = { text: string; icon: TickerIconName }
export type TickerRow = { label: string; items: TickerItem[] }

export const TICKER_ROWS: TickerRow[] = [
  {
    label: 'interests:',
    items: [
      { text: 'design', icon: 'design' },
      { text: 'data', icon: 'data' },
      { text: 'technology', icon: 'tech' },
      { text: 'business', icon: 'business' },
      { text: 'languages', icon: 'languages' },
    ],
  },
  {
    label: 'naturally:',
    items: [
      { text: 'curious', icon: 'curious' },
      { text: 'analytical', icon: 'analytical' },
      { text: 'always down a rabbit hole', icon: 'rabbit' },
    ],
  },
  {
    label: 'hobbies:',
    items: [
      { text: 'anime', icon: 'anime' },
      { text: 'manga & comics', icon: 'manga' },
      { text: 'gaming', icon: 'gaming' },
      { text: 'reading', icon: 'reading' },
      { text: 'films & series', icon: 'films' },
    ],
  },
  {
    label: 'often:',
    items: [
      { text: 'analysing things', icon: 'analysing' },
      { text: 'learning something random', icon: 'learning' },
      { text: 'experimenting with new ideas', icon: 'experimenting' },
    ],
  },
]

export const TICKER_LABEL = 'About Ruby, at a glance'

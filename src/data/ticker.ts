/**
 * §S02 — the status ticker, one continuous loop separated by pixel stars.
 *
 * `parts` exists because §9 requires a `lang` attribute on the CJK and
 * Devanagari strings; a screen reader that reads 日本語 with an English voice
 * produces nonsense. Items without `parts` are plain English.
 */

export type TickerPart = { text: string; lang?: string }
export type TickerItem = { text: string; parts?: TickerPart[] }

export const TICKER_ITEMS: TickerItem[] = [
  { text: 'STATUS: open to junior UI/UX roles' },
  { text: 'based in Yangon, Myanmar — GMT+6:30' },
  { text: 'currently: BSc Business Computing & Information Systems, final year' },
  {
    text: 'speaks: Burmese · English · 中文 · 日本語 · हिन्दी',
    parts: [
      { text: 'speaks: Burmese · English · ' },
      { text: '中文', lang: 'zh' },
      { text: ' · ' },
      { text: '日本語', lang: 'ja' },
      { text: ' · ' },
      { text: 'हिन्दी', lang: 'hi' },
    ],
  },
  { text: 'now learning: BI & Analytics' },
  { text: 'thanks for stopping by my space' },
]

export const TICKER_LABEL = 'Current status'

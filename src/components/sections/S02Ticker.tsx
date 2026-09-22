import { useState } from 'react'
import { Marquee, PauseGlyph, PlayGlyph } from '@/components/pixel/Marquee'
import { GlyphStar } from '@/components/pixel/PixelGlyph'
import { TickerIcon } from '@/components/pixel/TickerIcons'
import { TICKER_LABEL, TICKER_ROWS, type TickerRow } from '@/data/ticker'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/lib/cx'

/**
 * §S02 — full-bleed status board. Sits flush against S01 and S03 with no
 * margin, 2px border top and bottom.
 *
 * Four rows, alternating direction. Alternating is not decoration: four rows
 * travelling the same way at the same speed read as one sliding block and
 * the eye cannot find a line to settle on, whereas opposed rows separate
 * themselves. The banding — sunken, page, sunken, page — does the same job
 * without adding three more 2px rules to a section that already has two.
 *
 * All four rows share one pause state, so hovering anywhere in the board
 * stops the lot (you are trying to read it) and there is one button rather
 * than four stacked down the right edge.
 */
export function S02Ticker() {
  const reducedMotion = useReducedMotion()
  /** The button: a pause that stays put. */
  const [pinned, setPinned] = useState(false)
  /** The pointer: a pause that lasts as long as you are reading. */
  const [hovered, setHovered] = useState(false)

  if (reducedMotion) return <StaticBoard />

  return (
    <section
      aria-label={TICKER_LABEL}
      className="sda-none relative border-y-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Right padding keeps the last item from sliding under the button. */}
      <div className="pr-[44px]">
        {TICKER_ROWS.map((row, i) => (
          <Marquee
            key={row.label}
            label={row.label.replace(':', '')}
            paused={pinned || hovered}
            reverse={i % 2 === 1}
            className={cx(
              'h-[34px] md:h-[40px]',
              i % 2 === 1 && 'bg-[color:var(--bg)]',
            )}
          >
            <RowContent row={row} />
          </Marquee>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        aria-pressed={pinned}
        className={cx(
          'absolute right-0 top-0 flex h-full w-[44px] items-center justify-center',
          'border-l-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
          'text-[color:var(--ink)]',
        )}
      >
        <span className="sr-only">{pinned ? 'Play the status board' : 'Pause the status board'}</span>
        {pinned ? <PlayGlyph /> : <PauseGlyph />}
      </button>
    </section>
  )
}

/**
 * One lap of a row. The sequence is deliberately uniform — label, star, then
 * item-star for every item — so the join between one copy and the next looks
 * exactly like every other gap in the row and the loop point is invisible.
 */
function RowContent({ row }: { row: TickerRow }) {
  return (
    <ul className="flex h-full items-center">
      <li className="flex flex-none items-center">
        <span className="whitespace-nowrap px-5 font-ui text-label font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)]">
          {row.label}
        </span>
        <GlyphStar className="flex-none text-[color:var(--brand)]" />
      </li>
      {row.items.map((item) => (
        <li key={item.text} className="flex flex-none items-center">
          <span className="flex items-center gap-2 px-5">
            <TickerIcon name={item.icon} className="flex-none text-[color:var(--brand)]" />
            <span className="whitespace-nowrap font-ui text-label uppercase tracking-[0.08em] text-[color:var(--ink)]">
              {item.text}
            </span>
          </span>
          <GlyphStar className="flex-none text-[color:var(--brand)]" />
        </li>
      ))}
    </ul>
  )
}

/**
 * §S02 reduced-motion state. The old single-row ticker dropped to its first
 * three items; four labelled rows are a list rather than a sentence, so this
 * keeps all of it and simply wraps — nothing here is worth withholding from
 * someone who asked for less motion.
 */
function StaticBoard() {
  return (
    <section
      aria-label={TICKER_LABEL}
      className="sda-none border-y-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]"
    >
      <ul className="flex flex-col gap-3 px-[var(--gutter-mobile)] py-4 md:px-[var(--gutter-desk)]">
        {TICKER_ROWS.map((row) => (
          <li key={row.label} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-ui text-label font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)]">
              {row.label}
            </span>
            {row.items.map((item) => (
              <span key={item.text} className="flex items-center gap-2">
                <TickerIcon name={item.icon} className="flex-none text-[color:var(--brand)]" />
                <span className="font-ui text-label uppercase tracking-[0.08em] text-[color:var(--ink)]">
                  {item.text}
                </span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}

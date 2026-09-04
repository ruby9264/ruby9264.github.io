import { Fragment } from 'react'
import { Marquee } from '@/components/pixel/Marquee'
import { GlyphStar } from '@/components/pixel/PixelGlyph'
import { TICKER_ITEMS, TICKER_LABEL, type TickerItem } from '@/data/ticker'

/**
 * §S02 — full-bleed status bar. Sits flush against S01 and S03 with no
 * margin, 2px border top and bottom, --bg-sunken.
 */
export function S02Ticker() {
  return (
    <div className="sda-none border-y-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]">
      <Marquee
        label={TICKER_LABEL}
        duration={40}
        className="h-[56px] md:h-[72px]"
        staticFallback={<StaticFallback />}
      >
        <ul className="flex h-[56px] items-center md:h-[72px]">
          {TICKER_ITEMS.map((item, i) => (
            <li key={i} className="flex flex-none items-center">
              <span className="whitespace-nowrap px-6 font-ui text-label uppercase tracking-[0.08em] text-[color:var(--ink)]">
                <ItemText item={item} />
              </span>
              <GlyphStar className="flex-none text-[color:var(--brand)]" />
            </li>
          ))}
        </ul>
      </Marquee>
    </div>
  )
}

/**
 * §9 — the CJK and Devanagari runs carry their own `lang`, so a screen
 * reader switches voice instead of spelling them out in English.
 */
function ItemText({ item }: { item: TickerItem }) {
  if (!item.parts) return <>{item.text}</>
  return (
    <>
      {item.parts.map((part, i) => (
        <Fragment key={i}>
          {part.lang ? <span lang={part.lang}>{part.text}</span> : part.text}
        </Fragment>
      ))}
    </>
  )
}

/** §S02 reduced-motion state: static, wraps, first three items only. */
function StaticFallback() {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 px-[var(--gutter-mobile)] py-4 md:px-[var(--gutter-desk)]">
      {TICKER_ITEMS.slice(0, 3).map((item, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="font-ui text-label uppercase tracking-[0.08em] text-[color:var(--ink)]">
            <ItemText item={item} />
          </span>
          {i < 2 ? <GlyphStar className="flex-none text-[color:var(--brand)]" /> : null}
        </li>
      ))}
    </ul>
  )
}

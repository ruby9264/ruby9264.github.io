import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'

type StatBarProps = {
  value: number
  max: number
  label: string
  /** Announced instead of the raw number, e.g. "English proficiency: B2 to C1". */
  srLabel: string
  /** Segments only fill once this is true (§S08 fills on viewport entry). */
  active: boolean
  /** ms between each segment lighting up. 0 fills them all at once. */
  stagger?: number
}

/**
 * §S08 — ten discrete segments, never a continuous bar.
 *
 * The stagger is driven by React state rather than CSS animation delays.
 * An earlier version used `animation: … steps(1) <delay> both`, which leaves
 * every segment at the `from` value (hidden) until its animation gets a
 * frame — so in a throttled or backgrounded tab the bar stayed empty
 * permanently. Here the finished state is whatever `revealed` says, so a
 * dropped frame costs the animation, never the content.
 *
 * `role="meter"` carries the value; the visible level tag beside it carries
 * the meaning. §S08 is explicit that bar length alone is not enough.
 */
export function StatBar({ value, max, label, srLabel, active, stagger = 60 }: StatBarProps) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (!active) {
      setRevealed(0)
      return
    }
    if (stagger <= 0) {
      setRevealed(value)
      return
    }

    let current = 0
    const id = window.setInterval(() => {
      current += 1
      setRevealed(current)
      if (current >= value) window.clearInterval(id)
    }, stagger)

    return () => window.clearInterval(id)
  }, [active, value, stagger])

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={srLabel}
      className="flex flex-none gap-1"
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx(
            'h-3 w-3 flex-none border-2 border-[color:var(--line)]',
            i < revealed ? 'bg-[color:var(--brand)]' : 'dither dither-25',
          )}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}

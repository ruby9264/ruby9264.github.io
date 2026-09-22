import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type MarqueeProps = {
  /** One copy of the content. The component handles duplication. */
  children: ReactNode
  label: string
  /**
   * Scroll speed in CSS px per second, not a duration. A duration would make
   * a short row travel slowly and a long one race, which is exactly wrong
   * when several rows scroll side by side — the eye reads them as one
   * surface and any difference in speed reads as a fault.
   */
  speed?: number
  /** Right to left by default; `reverse` runs the track the other way. */
  reverse?: boolean
  /**
   * Controlled pause. When supplied the component stops managing its own
   * pause state and renders no button — the caller owns both, which is how
   * several rows share one control instead of growing one button each.
   */
  paused?: boolean
  className?: string
}

/**
 * An infinite marquee that is actually seamless, and actually pausable.
 *
 * SEAM. The track holds `copies` copies of the children and shifts by
 * exactly one of them — `-100 / copies` percent — before repeating. The
 * shared `marquee-scroll` keyframe hardcodes -50%, which is only one copy
 * when there are exactly two; at three or more it lands mid-copy and the row
 * visibly jumps every lap. This uses `marquee-shift`, whose endpoint is a
 * custom property set from here. (Starfield still uses the old keyframe, and
 * correctly: it always has exactly two copies.)
 *
 * PAUSE. §S02 says pause "on hover and on focus-within". Hover alone is not
 * a WCAG 2.2.2 mechanism, and focus-within cannot fire in a ticker with no
 * focusable content — so there is a real button too. Without it the section
 * would fail the criterion the spec cites. See docs/PHASE-4-NOTES.md.
 */
export function Marquee({
  children,
  label,
  speed = 24,
  reverse = false,
  paused,
  className,
}: MarqueeProps) {
  const reducedMotion = useReducedMotion()
  const [selfPaused, setSelfPaused] = useState(false)
  const [copies, setCopies] = useState(2)
  const [copyWidth, setCopyWidth] = useState(0)
  const copyRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const controlled = paused !== undefined
  const isPaused = controlled ? paused : selfPaused

  /**
   * Measured with a ResizeObserver on the first copy rather than by reading
   * widths on resize. The row's width also changes when the two webfonts
   * arrive, and a measurement taken before that leaves both the duration and
   * the copy count wrong — the copies too few to cover the viewport, which
   * shows as a gap sliding past.
   */
  useEffect(() => {
    if (reducedMotion) return
    const copy = copyRef.current
    const viewport = viewportRef.current
    if (!copy || !viewport) return

    const measure = () => {
      const w = copy.getBoundingClientRect().width
      if (w <= 0) return
      setCopyWidth(w)
      // Enough copies to cover the viewport twice: one fills it, the next is
      // already in place when the shift wraps.
      setCopies(Math.max(2, Math.ceil((viewport.clientWidth * 2) / w)))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(copy)
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [reducedMotion, children])

  if (reducedMotion) {
    return (
      <div role="marquee" aria-label={label} className={className}>
        {children}
      </div>
    )
  }

  // Time for the track to travel one copy. Constant px/s whatever the row
  // holds. Zero until the first measurement lands, which is also the frame
  // where a duration would be meaningless.
  const duration = copyWidth > 0 ? copyWidth / speed : 0

  return (
    <div
      role="marquee"
      aria-label={label}
      className={cx('relative', className)}
      onPointerEnter={controlled ? undefined : () => setSelfPaused(true)}
      onPointerLeave={controlled ? undefined : () => setSelfPaused(false)}
    >
      <div ref={viewportRef} className="h-full overflow-hidden">
        <div
          className="flex h-full w-max"
          // Longhands, never the `animation` shorthand. The play state has to
          // be updated on its own every time the pause toggles, and React
          // warns — correctly — that writing a shorthand and one of its
          // longhands from the same style object leaves the result depending
          // on property order. scroll.css avoids the shorthand for its own
          // reason; this is the second one.
          style={{
            // One copy's worth of travel, whatever the copy count.
            ['--marquee-shift' as string]: `-${100 / copies}%`,
            animationName: duration ? 'marquee-shift' : undefined,
            animationDuration: duration ? `${duration}s` : undefined,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: reverse ? 'reverse' : 'normal',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {Array.from({ length: copies }, (_, i) => (
            // Only the first copy is read; the rest exist to fill the loop.
            <div
              key={i}
              ref={i === 0 ? copyRef : undefined}
              className="flex h-full shrink-0"
              aria-hidden={i > 0 || undefined}
            >
              {children}
            </div>
          ))}
        </div>
      </div>

      {controlled ? null : (
        <button
          type="button"
          onClick={() => setSelfPaused((p) => !p)}
          aria-pressed={selfPaused}
          className={cx(
            'absolute right-0 top-0 flex h-full w-[44px] items-center justify-center',
            'border-l-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
            'text-[color:var(--ink)]',
          )}
        >
          <span className="sr-only">{selfPaused ? `Play ${label}` : `Pause ${label}`}</span>
          {selfPaused ? <PlayGlyph /> : <PauseGlyph />}
        </button>
      )}
    </div>
  )
}

export function PauseGlyph() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" />
      <rect x="7" y="1" width="3" height="10" />
    </svg>
  )
}

export function PlayGlyph() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="2" height="10" />
      <rect x="4" y="2" width="2" height="8" />
      <rect x="6" y="3" width="2" height="6" />
      <rect x="8" y="4" width="2" height="4" />
    </svg>
  )
}

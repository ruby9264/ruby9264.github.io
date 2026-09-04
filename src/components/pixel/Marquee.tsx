import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type MarqueeProps = {
  /** One copy of the content. The component handles duplication. */
  children: ReactNode
  label: string
  /** Seconds for one full pass of the track. */
  duration?: number
  className?: string
  /** Rendered instead of the marquee under reduced motion. */
  staticFallback?: ReactNode
}

/**
 * §S02 — an infinite marquee that is actually pausable.
 *
 * The spec says pause "on hover and on focus-within". Hover alone is not a
 * WCAG 2.2.2 mechanism, and focus-within can never fire here because the
 * ticker contains no focusable content — so there is also a real pause
 * button. Without it the section would fail the very criterion the spec
 * cites. See docs/PHASE-4-NOTES.md.
 */
export function Marquee({
  children,
  label,
  duration = 40,
  className,
  staticFallback,
}: MarqueeProps) {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [copies, setCopies] = useState(2)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  /**
   * §S02 edge case: if one copy is narrower than the viewport the track
   * leaves a gap. Duplicate until it is at least twice the viewport.
   */
  useEffect(() => {
    if (reducedMotion) return
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      const oneCopy = track.scrollWidth / copies
      if (oneCopy <= 0) return
      const needed = Math.max(2, Math.ceil((viewport.clientWidth * 2) / oneCopy))
      if (needed !== copies) setCopies(needed)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [copies, reducedMotion, children])

  if (reducedMotion) {
    return (
      <div role="marquee" aria-label={label} className={className}>
        {staticFallback ?? children}
      </div>
    )
  }

  return (
    <div
      role="marquee"
      aria-label={label}
      className={cx('relative', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max"
          style={{
            animation: `marquee-scroll ${duration}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {Array.from({ length: copies }, (_, i) => (
            // Only the first copy is read; the rest exist to fill the loop.
            <div key={i} className="flex shrink-0" aria-hidden={i > 0 || undefined}>
              {children}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className={cx(
          'absolute right-0 top-0 flex h-full w-[44px] items-center justify-center',
          'border-l-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
          'text-[color:var(--ink)]',
        )}
      >
        <span className="sr-only">{paused ? 'Play the status ticker' : 'Pause the status ticker'}</span>
        {paused ? <PlayGlyph /> : <PauseGlyph />}
      </button>
    </div>
  )
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" />
      <rect x="7" y="1" width="3" height="10" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="1" width="2" height="10" />
      <rect x="4" y="2" width="2" height="8" />
      <rect x="6" y="3" width="2" height="6" />
      <rect x="8" y="4" width="2" height="4" />
    </svg>
  )
}

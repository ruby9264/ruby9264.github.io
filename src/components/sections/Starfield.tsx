import { useMemo } from 'react'
import { cx } from '@/lib/cx'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S01 ambient — 20-30 star pixels drifting right to left at three parallax
 * speeds (2, 4 and 7 px/s). Pure decoration, so aria-hidden, and gone
 * entirely under reduced motion.
 *
 * Deliberately slow: §4.3 says auto-motion "must never compete with reading".
 */

const LAYERS = [
  { count: 12, speed: 2, size: 2, tone: 'var(--ink-mute)' },
  { count: 10, speed: 4, size: 2, tone: 'var(--ink-soft)' },
  { count: 6, speed: 7, size: 4, tone: 'var(--ink)' },
]

/** Deterministic, so the field doesn't reshuffle on every render. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

export function Starfield({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  const layers = useMemo(
    () =>
      LAYERS.map((layer, li) => {
        const rand = seeded(li * 9973 + 17)
        return {
          ...layer,
          // One "tile" of stars, repeated twice so the loop is seamless.
          stars: Array.from({ length: layer.count }, () => ({
            left: rand() * 100,
            top: rand() * 100,
          })),
          // A 1000px tile at `speed` px/s.
          duration: 1000 / layer.speed,
        }
      }),
    [],
  )

  if (reducedMotion) return null

  return (
    <div aria-hidden="true" className={cx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {layers.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0 flex w-[200%]"
          style={{ animation: `marquee-scroll ${layer.duration}s linear infinite` }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="relative h-full w-1/2 shrink-0">
              {layer.stars.map((star, i) => (
                <span
                  key={i}
                  className="absolute block"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: layer.size,
                    height: layer.size,
                    background: layer.tone,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

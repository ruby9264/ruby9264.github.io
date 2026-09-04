import { useEffect, useState } from 'react'

/**
 * True while the page is scrolling faster than `threshold` px/s.
 * §3.2 blows MOCHI's ears back above 1200px/s.
 *
 * Velocity is sampled from scroll events rather than rAF so it still works in
 * a backgrounded tab, and it latches off after a short quiet period so the
 * state doesn't strobe during normal scrolling.
 */
export function useScrollVelocity(threshold = 1200, cooldown = 400): boolean {
  const [fast, setFast] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    let off: number

    const onScroll = () => {
      const y = window.scrollY
      const t = performance.now()
      const dt = t - lastT

      // Ignore sub-millisecond gaps; they produce meaningless velocities.
      if (dt > 8) {
        const velocity = (Math.abs(y - lastY) / dt) * 1000
        if (velocity > threshold) {
          setFast(true)
          window.clearTimeout(off)
          off = window.setTimeout(() => setFast(false), cooldown)
        }
        lastY = y
        lastT = t
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(off)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold, cooldown])

  return fast
}

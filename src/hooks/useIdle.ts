import { useEffect, useState } from 'react'

/**
 * True once the visitor has gone `delay` ms without interacting.
 * §3.2 uses 45s to send MOCHI to sleep.
 */
export function useIdle(delay = 45000): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer: number

    const reset = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), delay)
    }

    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [delay])

  return idle
}

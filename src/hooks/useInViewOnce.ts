import { useEffect, useRef, useState } from 'react'

/**
 * Fires true the first time an element enters the viewport, and never resets.
 *
 * Several §6 sections specify motion that runs "once only" and must not
 * repeat on re-entry — the S03 connector, the S07 progress bar, the S08
 * segment fill. Latching here keeps that rule in one place.
 *
 * These sections all render their *pre-animation* state until this flips, and
 * for the stat bars that state is not merely undecorated — an unfilled bar
 * says "0 out of 10", which is false. So the hook is deliberately eager, with
 * three independent ways to become true:
 *
 *   1. a synchronous rect check on mount, for anything already on screen
 *   2. IntersectionObserver, the normal path
 *   3. a scroll listener and a timeout, in case the observer never fires
 *      (backgrounded tabs throttle it, and it may be missing entirely)
 *
 * Being early costs an animation. Being late shows the wrong number.
 */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.25, fallbackMs = 1500) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    const el = ref.current
    if (!el) return

    let done = false
    const mark = () => {
      if (done) return
      done = true
      setSeen(true)
    }

    const isOnScreen = () => {
      const r = el.getBoundingClientRect()
      const h = window.innerHeight || document.documentElement.clientHeight
      return r.top < h && r.bottom > 0
    }

    if (isOnScreen()) {
      mark()
      return
    }

    const onScroll = () => {
      if (isOnScreen()) mark()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const timer = window.setTimeout(mark, fallbackMs)

    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) mark()
        },
        { threshold },
      )
      observer.observe(el)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [seen, threshold, fallbackMs])

  return [ref, seen] as const
}

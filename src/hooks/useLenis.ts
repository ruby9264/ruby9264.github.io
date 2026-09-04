import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

/**
 * §4.3 — smooth scroll, killed entirely under reduced motion.
 *
 * The instance is module-scoped rather than context-held because anchor
 * handling needs to reach it from anywhere, including plain <a href="#id">
 * clicks that never pass through React state.
 */
let instance: Lenis | null = null

export function getLenis(): Lenis | null {
  return instance
}

/** Scroll to a section, through Lenis when it's running and natively when not. */
export function scrollToId(id: string, offset = -80) {
  const el = document.getElementById(id)
  if (!el) {
    // Off the home route (the 404, say) the section isn't in this document.
    // Send the browser to it rather than swallowing the click.
    if (window.location.pathname !== '/') window.location.assign(`/#${id}`)
    return
  }

  if (instance) {
    instance.scrollTo(el, { offset })
    return
  }
  // No Lenis: reduced motion, or it failed to start. Jump, don't animate —
  // base.css has already forced scroll-behavior to auto in that case.
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top })
}

/** Call once, from the layout. */
export function useLenis() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      instance?.destroy()
      instance = null
      return
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    instance = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
    }
  }, [reducedMotion])
}

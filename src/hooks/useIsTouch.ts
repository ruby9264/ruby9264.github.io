import { useEffect, useState } from 'react'

/**
 * True on coarse-pointer devices.
 *
 * §S05 drops the pinned horizontal track entirely on touch — "horizontal
 * scroll-jacking on a phone is hostile" — and §4.1 disables the custom
 * cursor on the same signal.
 *
 * Starts false so the first paint is the simpler layout, then corrects on
 * mount; a touch device briefly rendering the vertical stack is harmless,
 * whereas a desktop briefly rendering a pinned section is not.
 */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return touch
}

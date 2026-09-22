import { useEffect, useRef } from 'react'
import {
  ARROW,
  DISABLED,
  GRAB,
  GRABBING,
  HOTSPOTS,
  HOURGLASS,
  POINTER,
  TEXT,
  renderCursor,
  type CursorColors,
} from './cursorArt'
import { useSettings } from '@/hooks/useSettings'

/**
 * §4.1 — the custom pixel cursor and its trail companion.
 *
 * Three guards, all mandatory:
 *   1. touch devices (`pointer: coarse`) never get a custom cursor at all
 *   2. reduced motion keeps the cursor but kills the trail
 *   3. the §4.5 settings toggle turns the whole thing off
 *
 * Every declaration ends in a real keyword fallback (`, auto`), and the CSS
 * only engages once `data-cursor-ready` is set — so a failed canvas or
 * disabled JS leaves a working system pointer rather than an invisible one.
 */
export function PixelCursor() {
  const { cursor: cursorEnabled, theme, reducedMotion } = useSettings()
  const trailRef = useRef<HTMLDivElement>(null)

  /* ---- generate the cursor images ---- */
  useEffect(() => {
    const root = document.documentElement

    const clear = () => {
      root.removeAttribute('data-cursor-ready')
      for (const name of ['default', 'pointer', 'text', 'grab', 'grabbing', 'disabled', 'loading'])
        root.style.removeProperty(`--cur-${name}`)
    }

    if (!cursorEnabled) {
      clear()
      return
    }
    // Guard 1: a custom cursor on a touch device is meaningless, and the
    // trail would chase taps around the screen.
    if (window.matchMedia?.('(pointer: coarse)').matches) {
      clear()
      return
    }

    const styles = getComputedStyle(root)
    const colors: CursorColors = {
      outline: styles.getPropertyValue('--cursor-outline').trim() || '#234151',
      fill: styles.getPropertyValue('--cursor-fill').trim() || '#2F6B5E',
      highlight: styles.getPropertyValue('--star').trim() || '#FFFBF0',
    }

    const set = (name: keyof typeof HOTSPOTS, url: string | null) => {
      if (!url) return false
      const [hx, hy] = HOTSPOTS[name]
      root.style.setProperty(`--cur-${name}`, `url(${url}) ${hx} ${hy}`)
      return true
    }

    const ok =
      set('default', renderCursor(ARROW, colors)) &&
      set('pointer', renderCursor(POINTER, colors)) &&
      set('text', renderCursor(TEXT, colors)) &&
      set('grab', renderCursor(GRAB, colors)) &&
      set('grabbing', renderCursor(GRABBING, colors)) &&
      set('disabled', renderCursor(DISABLED, colors)) &&
      set('loading', renderCursor(HOURGLASS, colors))

    // Only now does the CSS take over from the system pointer.
    if (ok) root.setAttribute('data-cursor-ready', '')
    else clear()

    return clear
  }, [cursorEnabled, theme])

  /* ---- the 4-frame hourglass, cycled only while something is busy ---- */
  useEffect(() => {
    if (!cursorEnabled || reducedMotion) return

    let frame = 0
    let timer = 0

    const styles = getComputedStyle(document.documentElement)
    const colors: CursorColors = {
      outline: styles.getPropertyValue('--cursor-outline').trim() || '#234151',
      fill: styles.getPropertyValue('--cursor-fill').trim() || '#2F6B5E',
      highlight: styles.getPropertyValue('--star').trim() || '#FFFBF0',
    }

    const tick = () => {
      if (document.querySelector('[aria-busy="true"]')) {
        frame = (frame + 1) % 4
        const url = renderCursor(HOURGLASS, colors, frame)
        if (url) {
          const [hx, hy] = HOTSPOTS.loading
          document.documentElement.style.setProperty('--cur-loading', `url(${url}) ${hx} ${hy}`)
        }
      }
      timer = window.setTimeout(tick, 160)
    }
    timer = window.setTimeout(tick, 160)

    return () => window.clearTimeout(timer)
  }, [cursorEnabled, reducedMotion, theme])

  /* ---- trail companion: 8px moss square, ~120ms behind, snapped to 4px ---- */
  useEffect(() => {
    const el = trailRef.current
    if (!el) return

    // Guard 1 again, and guard 2: reduced motion keeps the cursor, drops the trail.
    if (!cursorEnabled || reducedMotion || window.matchMedia?.('(pointer: coarse)').matches) {
      el.style.opacity = '0'
      return
    }

    let targetX = -100
    let targetY = -100
    let x = -100
    let y = -100
    let frame = 0
    let seen = false

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!seen) {
        seen = true
        x = targetX
        y = targetY
        el.style.opacity = '1'
      }
    }

    const onLeave = () => {
      el.style.opacity = '0'
      seen = false
    }

    // A spring that settles in roughly 120ms at 60fps.
    const EASE = 0.18

    const loop = () => {
      x += (targetX - x) * EASE
      y += (targetY - y) * EASE
      // §4.1: snap in 4px increments — the trail never slides between pixels.
      const sx = Math.round(x / 4) * 4
      const sy = Math.round(y / 4) * 4
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [cursorEnabled, reducedMotion])

  return (
    <div
      ref={trailRef}
      aria-hidden="true"
      className="pixel-cursor-trail"
      style={{ opacity: 0 }}
    />
  )
}

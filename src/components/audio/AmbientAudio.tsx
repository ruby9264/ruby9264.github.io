import { useEffect, useRef } from 'react'
import { useSettings } from '@/hooks/useSettings'

/**
 * Ambient background music, tied to the §4.5 Sound setting.
 *
 * DEVIATION FROM §4.5. The spec says "default OFF, audio is never
 * autoplayed". Ruby asked for the opposite: the track should be playing when
 * the page opens, faint, with the setting as the way out. So the default is
 * now on and this component tries to start immediately. Everything below is
 * about doing that honestly rather than sneakily.
 *
 * AUTOPLAY IS NOT OURS TO DECIDE. Chrome, Safari and Firefox all refuse
 * unmuted playback until the visitor has interacted with the page, and no
 * amount of markup changes that. `play()` rejects, so the fallback is the
 * only legitimate one there is: wait for the first real gesture and start
 * then. On a first visit that gesture is the S00 airlock door — the music
 * comes up as the gate wipes away, which is the best version of this anyway.
 * A returning visitor skips the gate and hears it on their first click.
 * Scrolling is deliberately not in the list: browsers do not count it as a
 * gesture, and listening for it would just burn a listener.
 *
 * WCAG 1.4.2. Audio that starts on its own and runs past three seconds needs
 * a way to stop it. There are two, both within reach without scrolling: the
 * settings gear in the nav, and MOCHI's menu — which is the one a visitor
 * who is already reaching for the bot will find first.
 *
 * COST. The file is 2.2MB, so the element is not built until sound is
 * actually on. Someone who has turned it off never downloads it.
 */

/** BASE_URL, not a bare '/', so the track still resolves under a project-site base. */
const SRC = `${import.meta.env.BASE_URL}303pm.mp3`

/** Faint on purpose — this sits under reading, it is not the content. */
const TARGET_VOLUME = 0.12
const FADE_MS = 2000
const FADE_STEP_MS = 50

export function AmbientAudio() {
  const { sound } = useSettings()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)

  useEffect(() => {
    const clearFade = () => {
      if (fadeRef.current) {
        window.clearInterval(fadeRef.current)
        fadeRef.current = 0
      }
    }

    /**
     * A ramp, not a step. §2.1 rule 7 is about pixels — a stepped fade on
     * audio is just a series of clicks.
     *
     * Driven by the clock rather than by counting ticks. Background tabs
     * clamp setInterval to about once a second, so a 40-tick count-based
     * ramp would take 40 seconds there instead of two, and a visitor coming
     * back to the tab would find it still almost silent.
     */
    const fadeTo = (el: HTMLAudioElement, target: number, done?: () => void) => {
      clearFade()
      const from = el.volume
      const startedAt = performance.now()
      fadeRef.current = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - startedAt) / FADE_MS)
        el.volume = Math.min(1, Math.max(0, from + (target - from) * t))
        if (t >= 1) {
          clearFade()
          done?.()
        }
      }, FADE_STEP_MS)
    }

    if (!sound) {
      const el = audioRef.current
      clearFade()
      // Fade out rather than cut, so turning it off is not itself a noise.
      if (el && !el.paused) fadeTo(el, 0, () => el.pause())
      return clearFade
    }

    let el = audioRef.current
    if (!el) {
      el = new Audio(SRC)
      el.loop = true
      el.preload = 'auto'
      audioRef.current = el
    }
    // Idempotent, and load-bearing: an element that has lost its source still
    // reports `paused === false` after play(), so a missing src does not look
    // like a failure — it looks like silent success with currentTime frozen
    // at 0. Cheaper to re-assert it than to debug that twice.
    if (el.getAttribute('src') !== SRC) el.src = SRC
    el.volume = 0

    let cancelled = false

    const onGesture = () => {
      disarm()
      start()
    }
    const arm = () => {
      document.addEventListener('pointerdown', onGesture)
      document.addEventListener('keydown', onGesture)
      document.addEventListener('touchend', onGesture)
    }
    const disarm = () => {
      document.removeEventListener('pointerdown', onGesture)
      document.removeEventListener('keydown', onGesture)
      document.removeEventListener('touchend', onGesture)
    }

    function start() {
      const node = audioRef.current
      if (cancelled || !node) return
      node
        .play()
        .then(() => {
          if (!cancelled) fadeTo(node, TARGET_VOLUME)
        })
        // The only expected rejection is the autoplay policy, and the answer
        // to it is to wait rather than to retry.
        .catch(arm)
    }

    start()

    return () => {
      cancelled = true
      disarm()
      clearFade()
    }
  }, [sound])

  /**
   * Stop on unmount. Only stop: an earlier version also cleared the src to
   * release the buffer, which StrictMode turned into a permanent mute —
   * React runs this cleanup between its two development mounts, so the
   * element the second mount reused had already had its source taken away.
   * Dropping the ref is enough for the buffer; the GC does the rest.
   */
  useEffect(
    () => () => {
      audioRef.current?.pause()
    },
    [],
  )

  return null
}

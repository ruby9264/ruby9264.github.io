import { useSyncExternalStore } from 'react'

/**
 * A tiny store for the two MOCHI states that are driven by something far away
 * in the tree — §3.2's `form-success` and `form-error`.
 *
 * The Phase 7 contact form calls `setMochiMood('form-success')`; the bot picks
 * it up without the form needing to know the bot exists. These are the only
 * two states announced to screen readers, so they are also the only two that
 * warrant a channel of their own.
 */
export type MochiMood = 'none' | 'form-success' | 'form-error'

let mood: MochiMood = 'none'
const listeners = new Set<() => void>()

export function setMochiMood(next: MochiMood, autoClearMs = 6000) {
  mood = next
  listeners.forEach((l) => l())

  if (next !== 'none' && autoClearMs > 0) {
    window.setTimeout(() => {
      // Only clear if nothing else has changed it in the meantime.
      if (mood === next) {
        mood = 'none'
        listeners.forEach((l) => l())
      }
    }, autoClearMs)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useMochiMood(): MochiMood {
  return useSyncExternalStore(
    subscribe,
    () => mood,
    () => 'none' as MochiMood,
  )
}

import { useSettings } from './useSettings'

/**
 * §4.3 — the single source of truth for whether motion runs.
 *
 * Combines the OS preference with the §4.5 override, so JS-driven motion
 * (Lenis, GSAP, sprite loops) makes the same decision the CSS contract in
 * base.css does. Never read `matchMedia` directly in a component.
 */
export function useReducedMotion(): boolean {
  return useSettings().reducedMotion
}

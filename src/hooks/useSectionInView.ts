import { useEffect, useState } from 'react'

/**
 * Which of `ids` is currently occupying most of the viewport, if any.
 * §3.2 uses this to give MOCHI a clipboard in S06 and coffee in S10.
 *
 * Looser than useScrollSpy's narrow band: the mascot should react while a
 * section is on screen at all, not only while it crosses the middle.
 */
export function useSectionInView(ids: string[], threshold = 0.4): string | null {
  const [inView, setInView] = useState<string | null>(null)

  useEffect(() => {
    if (ids.length === 0 || typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setInView(ids.find((id) => visible.has(id)) ?? null)
      },
      { threshold },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, threshold])

  return inView
}

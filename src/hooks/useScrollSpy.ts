import { useEffect, useState } from 'react'

/**
 * §4.4 — the active nav link mirrors the section in view.
 *
 * The rootMargin carves a band across the middle of the viewport; a section
 * is "current" while it occupies that band. Ties are broken by document
 * order so the reading position wins over whichever observer fired last.
 */
export function useScrollSpy(ids: string[], rootMargin = '-40% 0px -55% 0px') {
  const [activeId, setActiveId] = useState<string | null>(null)

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
        // Document order, not observer-callback order.
        const first = ids.find((id) => visible.has(id))
        if (first) setActiveId(first)
      },
      { rootMargin, threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return activeId
}

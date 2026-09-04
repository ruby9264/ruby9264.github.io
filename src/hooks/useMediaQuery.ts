import { useEffect, useState } from 'react'

/**
 * Reactive media query. Starts false and corrects on mount, so the first
 * paint is always the simpler layout — a large screen briefly showing the
 * small-screen version is harmless; the reverse is not.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

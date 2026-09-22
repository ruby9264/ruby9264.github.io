import { useEffect, useState, type ReactNode } from 'react'
import { SkipLink } from './SkipLink'
import { Nav } from './Nav'
import { MobileDock } from './MobileDock'
import { Footer } from './Footer'
import { FloatingBot } from '@/components/mochi/FloatingBot'
import { PixelCursor } from '@/components/cursor/PixelCursor'
import { LotusField } from '@/components/lotus/LotusField'
import { AmbientAudio } from '@/components/audio/AmbientAudio'
import { S00Airlock } from '@/components/sections/S00Airlock'
import { storedTheme } from '@/hooks/useSettings'
import { NAV_IDS } from '@/data/nav'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useLenis, scrollToId } from '@/hooks/useLenis'

type SiteLayoutProps = {
  children: ReactNode
  /** Home floats the nav over its hero; other routes dock it immediately. */
  hasHero?: boolean
  /** Routes with no in-page sections (404) hide the dock rather than show dead slots. */
  showDock?: boolean
  /** §3.1 places the bot "from S01 onward" — the 404 has its own MOCHI. */
  showBot?: boolean
  /** S00 gates the home route only. */
  gate?: boolean
}

/**
 * The shell every route sits inside, so the skip link is genuinely the first
 * tabbable element and the nav/footer never get forgotten on a new route.
 */
export function SiteLayout({
  children,
  hasHero = false,
  showDock = true,
  showBot = true,
  gate = false,
}: SiteLayoutProps) {
  /**
   * §S00's two bypasses, decided once from a snapshot taken before the gate
   * can change anything:
   *   - a returning visitor already has a stored theme, and must not be
   *     gated twice
   *   - any URL carrying a hash is a deep link, and the hash wins
   */
  const [gateOpen, setGateOpen] = useState(
    () => gate && storedTheme() === null && !window.location.hash,
  )
  useLenis()
  const activeId = useScrollSpy(NAV_IDS)

  // §S00 edge case: a deep link like /#work must land on that section. The
  // browser's own hash jump fires before React has mounted the sections, so
  // it has to be redone once they exist.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    // setTimeout, not requestAnimationFrame: rAF is throttled in a
    // backgrounded tab, and a deep link opened in a background tab must still
    // be at the right section when the visitor switches to it.
    const t = setTimeout(() => scrollToId(id), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <SkipLink />
      <Nav activeId={activeId} hasHero={hasHero} />

      {/* Bottom padding clears the mobile dock; top padding clears the docked
          bar on routes where it never floats. */}
      <main id="main" className={showDock ? 'pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0' : ''}>
        {children}
      </main>

      <Footer />

      {showDock ? <MobileDock activeId={activeId} /> : null}
      {showBot ? <FloatingBot /> : null}

      {/* Ambient, and decorative in the aria sense — it plants itself in the
          page gutters and stays out of the reading column. Mounted in the
          shell so the field is continuous across routes. */}
      <LotusField />

      {/* Renders the trail square; the cursor images themselves are set as
          custom properties on <html>. Guards live inside the component. */}
      <PixelCursor />

      {/* Renders nothing. Lives in the shell rather than in App so the
          /styleguide route — a build tool, not the site — stays silent. */}
      <AmbientAudio />

      {gateOpen ? <S00Airlock onDone={() => setGateOpen(false)} /> : null}
    </>
  )
}

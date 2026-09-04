import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { Container } from '@/components/layout/Container'
import { PixelButton } from '@/components/pixel/PixelButton'
import { GlyphChevronDown } from '@/components/pixel/PixelGlyph'
import { IconDoc } from '@/components/pixel/NavIcons'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { Starfield } from './Starfield'
import { StationScene } from './StationScene'
import { HERO, PROFILE } from '@/data/profile'
import { CV_AVAILABLE } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scrollToId } from '@/hooks/useLenis'

/**
 * §S01 — asymmetric hero. Text left (cols 1-6), MOCHI and the station right
 * (cols 7-12), left-aligned throughout. Explicitly not centred.
 *
 * The load sequence runs once and then stops; after it the only motion is the
 * starfield drift and MOCHI's breathing, both killed by reduced motion.
 */
export function S01Hero() {
  const reducedMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)

  // §S01 edge case: the scroll hint hides once past 100px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="sda-none relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16"
    >
      <Starfield />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---- MOCHI + station.
               On mobile this comes first (§S01: "MOCHI above, text below"),
               so it is ordered before the text and moved right at lg. ---- */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <SceneBlock reducedMotion={reducedMotion} />
          </div>

          {/* ---- text ---- */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className={cx('hud text-[color:var(--ink-mute)]', !reducedMotion && 'hero-step')}>
              {HERO.kicker}
            </p>

            <h1
              id="home-title"
              className="mt-4 font-display text-display font-bold tracking-[0.04em]"
            >
              {reducedMotion ? (
                HERO.name
              ) : (
                <>
                  {/* Character-by-character reveal in steps(), 500ms total. */}
                  <span aria-hidden="true">
                    {HERO.name.split('').map((char, i) => (
                      <span
                        key={i}
                        className="hero-char"
                        style={{ animationDelay: `${600 + i * 100}ms` }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  <span className="sr-only">{HERO.name}</span>
                </>
              )}
            </h1>

            <p
              className={cx(
                'mt-4 font-ui text-h3 font-bold text-[color:var(--ink-soft)]',
                !reducedMotion && 'hero-step',
              )}
              style={!reducedMotion ? { animationDelay: '1100ms' } : undefined}
            >
              {HERO.role}
            </p>

            <p
              className={cx(
                'mt-6 max-w-measure text-lead text-[color:var(--ink-soft)]',
                !reducedMotion && 'hero-step',
              )}
              style={!reducedMotion ? { animationDelay: '1150ms' } : undefined}
            >
              {HERO.lead}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <PixelButton
                tone="accent"
                onClick={() => scrollToId('work')}
                className={cx('w-full sm:w-auto', !reducedMotion && 'hero-pop')}
              >
                {HERO.primaryCta}
              </PixelButton>

              {/* §S01 edge case: no CV means a disabled button with a
                  "coming soon" tooltip, never a link that 404s. */}
              {CV_AVAILABLE ? (
                <PixelButton
                  href={PROFILE.cv}
                  tone="secondary"
                  download
                  icon={<IconDoc />}
                  className={cx('w-full sm:w-auto', !reducedMotion && 'hero-pop')}
                >
                  {HERO.secondaryCta}
                </PixelButton>
              ) : (
                <PixelButton
                  tone="secondary"
                  disabled
                  icon={<IconDoc />}
                  title={HERO.cvMissingHint}
                  className={cx('w-full sm:w-auto', !reducedMotion && 'hero-pop')}
                >
                  {HERO.secondaryCta}
                </PixelButton>
              )}
            </div>

            <p
              className={cx(
                'mt-12 flex items-center gap-3 font-ui text-label uppercase tracking-[0.08em] text-[color:var(--ink-mute)]',
                'transition-opacity duration-150 ease-steps-4',
                scrolled && 'invisible opacity-0',
              )}
              aria-hidden={scrolled || undefined}
            >
              <GlyphChevronDown className={cx(!reducedMotion && 'chevron-bob')} />
              {HERO.scrollHint}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function SceneBlock({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative flex items-end justify-center gap-4 lg:justify-end">
      {/* §S01 edge case: on a landscape phone the station scene is dropped
          and MOCHI stays inline at 80px. */}
      <StationScene
        className={cx(
          'h-auto w-[min(360px,70vw)] max-lg:w-[min(280px,60vw)]',
          'hide-on-short-landscape',
          !reducedMotion && 'hero-station',
        )}
      />
      <div className={cx('flex-none', !reducedMotion && 'hero-mochi')}>
        <MochiSprite size={96} className="lg:hidden" />
        <MochiSprite size={128} className="hidden lg:block" />
      </div>
    </div>
  )
}

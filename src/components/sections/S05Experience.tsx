import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Panel } from '@/components/pixel/Panel'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { EXPERIENCE, EXPERIENCE_HEADING, type Station } from '@/data/experience'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getLenis } from '@/hooks/useLenis'

/**
 * §S05 — career history as a side-scrolling platformer level.
 *
 * Built in the order §S05 demands: the vertical stack is the real component
 * and the default. The pinned horizontal track is an enhancement layered on
 * top, and it only engages on a large viewport with a fine pointer and motion
 * allowed. Touch, reduced motion, small screens, or a GSAP failure all land on
 * the vertical stack — which is a complete, finished layout, not a fallback
 * that looks like one.
 */
export function S05Experience() {
  const touch = useIsTouch()
  const reducedMotion = useReducedMotion()
  const isLarge = useMediaQuery('(min-width: 1024px)')

  const canPin = isLarge && !touch && !reducedMotion

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 lg:py-40">
      {canPin ? <HorizontalTrack /> : <VerticalStack />}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* The card, shared by both layouts                                    */
/* ------------------------------------------------------------------ */

function StationCard({ station, index }: { station: Station; index: number }) {
  return (
    <Panel variant="window" title={`${station.year} — ${station.organisation}`}>
      <h3 className="font-ui text-h3 font-bold">
        <span className="sr-only">Role {index + 1}: </span>
        {station.role}
      </h3>
      <p className="mt-2 text-[color:var(--ink-soft)]">{station.organisation}</p>
      <p className="mt-1 text-small text-[color:var(--ink-mute)]">
        {station.period} · {station.mode}
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {station.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-3 text-[color:var(--ink-soft)]">
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 flex-none bg-[color:var(--brand)]"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
/* Vertical stack — the default                                        */
/* ------------------------------------------------------------------ */

function VerticalStack() {
  return (
    <Container>
      <h2 id="experience-title" className="mb-8 font-display text-h2">
        {EXPERIENCE_HEADING}
      </h2>

      <ol className="relative flex flex-col gap-12 pl-10">
        {/* §S05: a left rail connector, not a horizontal line pointing nowhere. */}
        <span
          aria-hidden="true"
          className="dither dither-50 absolute bottom-0 left-[15px] top-0 w-[2px]"
        />
        {EXPERIENCE.map((station, i) => (
          <li key={station.role} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center border-2 border-[color:var(--line)] bg-[color:var(--brand)] font-ui text-label font-semibold text-[color:var(--on-brand)]"
            >
              {i + 1}
            </span>
            <StationCard station={station} index={i} />
          </li>
        ))}
      </ol>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/* Pinned horizontal track — the enhancement                           */
/* ------------------------------------------------------------------ */

function HorizontalTrack() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [moving, setMoving] = useState(false)
  const [walkFrame, setWalkFrame] = useState(false)
  /** Set if GSAP can't start, so we fall back rather than show a broken track. */
  const [failed, setFailed] = useState(false)

  const stillTimer = useRef<number>(0)

  /**
   * Arrow keys and Tab both need to move the *page*, because the horizontal
   * position is a pure function of vertical scroll. Scrolling the window is
   * what keeps a pinned section from trapping anyone (§S05).
   */
  const scrollToCard = useCallback((index: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const clamped = Math.max(0, Math.min(EXPERIENCE.length - 1, index))
    const start = wrapper.offsetTop
    const distance = wrapper.offsetHeight - window.innerHeight
    const target = start + (distance * clamped) / Math.max(1, EXPERIENCE.length - 1)
    window.scrollTo({ top: target, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          // §10: only the plugin we use, never the full set.
          import('gsap/ScrollTrigger'),
        ])
        if (cancelled) return

        gsap.registerPlugin(ScrollTrigger)

        const wrapper = wrapperRef.current
        const pin = pinRef.current
        const track = trackRef.current
        if (!wrapper || !pin || !track) return

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${window.innerHeight * EXPERIENCE.length}`,
            pin,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress)
              setMoving(true)
              window.clearTimeout(stillTimer.current)
              // §S05: the walk cycle freezes to idle when the scroll stops.
              stillTimer.current = window.setTimeout(() => setMoving(false), 120)
            },
          },
        })

        // Lenis drives the scroll position, so ScrollTrigger has to be told
        // to recompute on its ticks rather than only on native scroll events.
        const lenis = getLenis()
        lenis?.on('scroll', ScrollTrigger.update)

        // §S05 edge case: a pin measured before the fonts land is the wrong
        // length, so remeasure once they're ready and again on resize.
        const refresh = () => ScrollTrigger.refresh()
        document.fonts?.ready.then(refresh).catch(() => {})

        let resizeTimer = 0
        const onResize = () => {
          window.clearTimeout(resizeTimer)
          resizeTimer = window.setTimeout(refresh, 200)
        }
        window.addEventListener('resize', onResize)

        cleanup = () => {
          window.removeEventListener('resize', onResize)
          window.clearTimeout(resizeTimer)
          lenis?.off('scroll', ScrollTrigger.update)
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      } catch {
        // GSAP unavailable or threw — show the vertical stack instead.
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
      window.clearTimeout(stillTimer.current)
      cleanup?.()
    }
  }, [])

  /* Two-frame walk cycle, only while the scroll is actually moving. */
  useEffect(() => {
    if (!moving) return
    const id = window.setInterval(() => setWalkFrame((f) => !f), 140)
    return () => window.clearInterval(id)
  }, [moving])

  if (failed) return <VerticalStack />

  const activeIndex = Math.round(progress * (EXPERIENCE.length - 1))

  return (
    <div ref={wrapperRef} style={{ height: `${(EXPERIENCE.length + 1) * 100}vh` }}>
      <div ref={pinRef} className="sda-none relative h-[100dvh] overflow-hidden">
        <Container className="pt-24">
          <h2 id="experience-title" className="font-display text-h2">
            {EXPERIENCE_HEADING}
          </h2>
        </Container>

        <div
          role="group"
          aria-label="Experience timeline. Use the left and right arrow keys to move between roles."
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              scrollToCard(activeIndex + 1)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              scrollToCard(activeIndex - 1)
            }
          }}
          className="mt-12"
        >
          <div ref={trackRef} className="flex w-max items-stretch gap-12 px-[var(--gutter-desk)]">
            {EXPERIENCE.map((station, i) => (
              <div
                key={station.role}
                className="w-[min(420px,80vw)] flex-none"
                // §S05: focusing a card must bring it into view rather than
                // leaving the visitor looking at the wrong part of the track.
                onFocusCapture={() => scrollToCard(i)}
              >
                <StationCard station={station} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Ground line, with MOCHI walking it as the position indicator. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16">
          <div
            aria-hidden="true"
            className="relative mx-[var(--gutter-desk)] border-t-2 border-[color:var(--line)]"
          >
            <div
              className="absolute bottom-0 -translate-x-1/2"
              style={{ left: `${progress * 100}%` }}
            >
              <MochiSprite
                size={56}
                legs={moving ? (walkFrame ? 'walkA' : 'walkB') : 'stand'}
                ears={moving ? 'back' : 'normal'}
              />
            </div>
          </div>

          {/* Progress rail (§S05). */}
          <div className="mx-[var(--gutter-desk)] mt-6">
            <div
              role="progressbar"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress through the experience timeline"
              className="dither dither-25 h-3 w-full border-2 border-[color:var(--line)]"
            >
              <span
                aria-hidden="true"
                className="block h-full bg-[color:var(--brand)]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

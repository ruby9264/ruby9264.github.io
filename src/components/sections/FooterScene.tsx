import { useEffect, useMemo, useState } from 'react'
import { cx } from '@/lib/cx'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { SpeechBubble } from '@/components/mochi/SpeechBubble'
import { ConfettiBurst } from './BreakRoomScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** §S11 easter egg: five clicks on MOCHI. */
const EGG_CLICKS = 5
const EGG_MS = 4000
const EGG_COPY = 'you found me! ✦'

/**
 * §S11 — the horizon MOCHI waves from, with stars above.
 *
 * The ground is a repeating SVG pattern rather than a fixed-width image, so
 * it spans full-bleed at any width without a tiling seam (§S11 edge case).
 */
export function FooterScene() {
  const reducedMotion = useReducedMotion()
  const [waveFrame, setWaveFrame] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [egg, setEgg] = useState(false)

  /* §S11: a 4-frame wave over 2s. The sprite has two wave frames, so it
     alternates every 500ms — the same cadence, half the drawings. */
  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => setWaveFrame((f) => !f), 500)
    return () => window.clearInterval(id)
  }, [reducedMotion])

  useEffect(() => {
    if (!egg) return
    const t = window.setTimeout(() => {
      setEgg(false)
      setClicks(0)
    }, EGG_MS)
    return () => window.clearTimeout(t)
  }, [egg])

  /* §S11: stars twinkle at three different random intervals, 2-5s.
     Seeded once so they don't reshuffle on every render. */
  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: ((i * 37) % 97) + 1,
        top: ((i * 53) % 70) + 4,
        size: i % 5 === 0 ? 4 : 2,
        duration: 2 + ((i * 7) % 30) / 10,
      })),
    [],
  )

  const onPoke = () => {
    const next = clicks + 1
    if (next >= EGG_CLICKS) setEgg(true)
    else setClicks(next)
  }

  return (
    <div className="relative h-[220px] w-full overflow-hidden">
      {/* stars */}
      <div aria-hidden="true" className="absolute inset-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className={cx('absolute block bg-[color:var(--ink-mute)]', !reducedMotion && 'twinkle')}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              ['--twinkle-dur' as string]: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* §S11: on very wide screens the margins get their own sprites rather
          than the scene stretching. */}
      <div aria-hidden="true" className="absolute bottom-[46px] left-[6%] hidden 2xl:block">
        <MochiSprite size={40} ears="droop" eyes="closed" />
      </div>
      <div aria-hidden="true" className="absolute bottom-[46px] right-[6%] hidden 2xl:block">
        <MochiSprite size={40} arms="hold" accessory="coffee" />
      </div>

      {/* MOCHI, standing on the horizon and waving goodbye. */}
      <div className="absolute bottom-[46px] left-1/2 -translate-x-1/2">
        {egg ? (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <SpeechBubble live>{EGG_COPY}</SpeechBubble>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onPoke}
          className="relative flex h-[88px] w-[72px] items-end justify-center"
        >
          <span className="sr-only">
            {egg ? EGG_COPY : 'Wave back at MOCHI'}
          </span>
          {egg ? <ConfettiBurst /> : null}
          <MochiSprite size={64} arms={!reducedMotion && waveFrame ? 'waveAlt' : 'wave'} />
        </button>
      </div>

      {/* ground */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[48px] w-full"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* userSpaceOnUse keeps the tile a fixed 16px whatever the width,
              so the horizon never stretches or seams. */}
          <pattern id="ground-tile" width="16" height="48" patternUnits="userSpaceOnUse">
            <rect x="0" y="6" width="16" height="42" fill="var(--bg-raised)" />
            <rect x="0" y="6" width="16" height="2" fill="var(--line)" />
            <rect x="2" y="12" width="4" height="2" fill="var(--line)" />
            <rect x="10" y="18" width="4" height="2" fill="var(--line)" />
            <rect x="5" y="26" width="3" height="2" fill="var(--line)" />
            <rect x="12" y="34" width="3" height="2" fill="var(--line)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ground-tile)" />
      </svg>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S10 ambient — the break room. MOCHI with a coffee, three pixel steam puffs
 * on a staggered loop, and a cookie that loses a bite when you click it.
 *
 * "This is a small reward, not a feature" — so it is decoration, it never
 * traps focus, and reduced motion stills all of it.
 */
export function BreakRoomScene() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative flex items-end justify-center gap-6 border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)] p-8">
      <div className="relative">
        {/* Steam rises from the mug MOCHI is holding. */}
        {!reducedMotion ? <Steam /> : null}
        <MochiSprite size={112} arms="hold" accessory="coffee" />
      </div>

      <Cookie />
    </div>
  )
}

/** Three puffs, staggered on a 4s loop in steps(4) (§S10). */
function Steam() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -top-6 left-2 h-12 w-12">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="steam-puff"
          style={{ left: i * 6, animationDelay: `${i * 1.3}s` }}
        />
      ))}
    </span>
  )
}

const BITE_STAGES = 3
const RESET_MS = 5000

/**
 * §S10: "Cookie has a bite taken out on click (swap sprite, 3 stages, then
 * reset after 5s)."
 *
 * It's a button because it responds to clicks — making it a div with an
 * onClick would hide a real interaction from keyboard users. Its label says
 * plainly that it does nothing but be a cookie.
 */
function Cookie() {
  const [bites, setBites] = useState(0)

  useEffect(() => {
    if (bites === 0) return
    const t = window.setTimeout(() => setBites(0), RESET_MS)
    return () => window.clearTimeout(t)
  }, [bites])

  return (
    <button
      type="button"
      onClick={() => setBites((b) => (b + 1) % (BITE_STAGES + 1))}
      className="flex h-[64px] w-[64px] flex-none items-center justify-center"
    >
      <span className="sr-only">
        {bites === 0 ? 'Take a bite of the cookie' : `Cookie, ${bites} of 3 bites taken`}
      </span>
      <CookieSprite bites={bites} />
    </button>
  )
}

/**
 * Each bite is a wedge removed from the cookie's edge, drawn as whole
 * pixels — not a rotated or scaled sprite, which would soften the edges.
 */
function CookieSprite({ bites }: { bites: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={48}
      height={48}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {/* body */}
      <rect x="4" y="1" width="8" height="2" fill="var(--mochi-patch)" />
      <rect x="2" y="3" width="12" height="2" fill="var(--mochi-patch)" />
      <rect x="1" y="5" width="14" height="6" fill="var(--mochi-patch)" />
      <rect x="2" y="11" width="12" height="2" fill="var(--mochi-patch)" />
      <rect x="4" y="13" width="8" height="2" fill="var(--mochi-patch)" />

      {/* chips */}
      <rect x="4" y="5" width="2" height="2" fill="var(--mochi-dark)" />
      <rect x="9" y="4" width="2" height="2" fill="var(--mochi-dark)" />
      <rect x="6" y="9" width="2" height="2" fill="var(--mochi-dark)" />
      <rect x="11" y="8" width="2" height="2" fill="var(--mochi-dark)" />

      {/* bites, knocked out in the surface colour behind the cookie */}
      {bites >= 1 ? (
        <>
          <rect x="12" y="3" width="4" height="4" fill="var(--bg-sunken)" />
          <rect x="11" y="4" width="2" height="2" fill="var(--bg-sunken)" />
        </>
      ) : null}
      {bites >= 2 ? (
        <>
          <rect x="12" y="9" width="4" height="4" fill="var(--bg-sunken)" />
          <rect x="10" y="10" width="3" height="2" fill="var(--bg-sunken)" />
        </>
      ) : null}
      {bites >= 3 ? (
        <>
          <rect x="0" y="4" width="4" height="4" fill="var(--bg-sunken)" />
          <rect x="3" y="6" width="2" height="3" fill="var(--bg-sunken)" />
        </>
      ) : null}
    </svg>
  )
}

/** Shared by the footer easter egg — a burst of pixel confetti. */
export function ConfettiBurst({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null

  return (
    <span aria-hidden="true" className={cx('pointer-events-none absolute inset-0', className)}>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="confetti-bit"
          style={{
            // Deterministic spray, so the burst looks designed rather than random.
            ['--dx' as string]: `${(i % 4) * 24 - 36}px`,
            ['--dy' as string]: `${-24 - (i % 3) * 20}px`,
            background:
              i % 3 === 0 ? 'var(--accent)' : i % 3 === 1 ? 'var(--brand)' : 'var(--ink)',
            animationDelay: `${(i % 4) * 40}ms`,
          }}
        />
      ))}
    </span>
  )
}

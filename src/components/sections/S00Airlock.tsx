import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { GlyphMoon, GlyphSun } from '@/components/pixel/PixelGlyph'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { AIRLOCK } from '@/data/airlock'
import { useSettings, systemTheme, type Theme } from '@/hooks/useSettings'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getLenis } from '@/hooks/useLenis'

type Side = 'day' | 'night'
type Phase = 'open' | 'closing'

/** §S00: 12 steps over 700ms for the reveal wipe; 100ms when motion is reduced. */
const WIPE_MS = 700
const REDUCED_MS = 100
const FLOOD = 'clip-path 400ms steps(8)'

/**
 * S00 — the airlock. A splash screen normally costs you visitors, so this one
 * earns its place: the choice made here is real and persists.
 *
 * Built last, so it opens onto a site that already exists — the hero is
 * rendered underneath the whole time and the wipe simply uncovers it.
 */
export function S00Airlock({ onDone }: { onDone: () => void }) {
  const { setTheme } = useSettings()
  const reducedMotion = useReducedMotion()

  const [hovered, setHovered] = useState<Side | null>(null)
  const [phase, setPhase] = useState<Phase>('open')
  const [chosen, setChosen] = useState<Theme>('light')

  const dayRef = useRef<HTMLButtonElement>(null)
  const nightRef = useRef<HTMLButtonElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  /* ---- lock the page behind the gate ---- */
  useEffect(() => {
    const body = document.body
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const lenis = getLenis()
    lenis?.stop()

    // §S00 edge case: hidden by default in CSS, shown only once JS says so —
    // so a no-JS visitor is never gated by a door they cannot open.
    document.documentElement.setAttribute('data-airlock', 'open')

    const behind = [
      document.getElementById('main'),
      document.querySelector('footer'),
      document.querySelector('header'),
    ].filter(Boolean) as HTMLElement[]
    behind.forEach((el) => el.setAttribute('inert', ''))

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      lenis?.start()
      document.documentElement.removeAttribute('data-airlock')
      behind.forEach((el) => el.removeAttribute('inert'))
    }
  }, [])

  /* ---- §S00: autofocus the door matching prefers-color-scheme ---- */
  useEffect(() => {
    const preferred = systemTheme()
    // Focus only. §S00 lists hover and focus-visible as separate states, so
    // focusing a door must not trigger the flood.
    ;(preferred === 'dark' ? nightRef.current : dayRef.current)?.focus()
  }, [])

  const choose = (theme: Theme, persist: boolean) => {
    // §S00: once transitioning, the doors are locked — no re-entry.
    if (phase !== 'open') return

    setChosen(theme)
    // Set immediately so the site revealed by the wipe is already correct.
    setTheme(theme, persist)
    setPhase('closing')

    window.setTimeout(onDone, reducedMotion ? REDUCED_MS : WIPE_MS)
  }

  /* ---- §S00 keyboard: arrows move, Enter/Space selects, Esc skips ---- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'open') return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        dayRef.current?.focus()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nightRef.current?.focus()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        // Skip means "use my system setting", so the choice is not persisted.
        choose(systemTheme(), false)
      } else if (e.key === 'Tab') {
        // The skip link lives outside the inerted regions, so Tab is trapped
        // here rather than relying on `inert` alone.
        const focusable = rootRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  /**
   * The seam. 50% at rest; the hovered half floods across it. Under reduced
   * motion the seam never moves — §S00 swaps the flood for a static border.
   */
  const seam = reducedMotion || hovered === null ? '50%' : hovered === 'day' ? '0%' : '100%'
  const dayClip = `inset(0 ${seam} 0 0)`

  const doors = (interactive: boolean) => (
    <>
      <Door
        ref={interactive ? dayRef : undefined}
        interactive={interactive}
        title={AIRLOCK.day.title}
        sub={AIRLOCK.day.sub}
        icon={<GlyphSun width={48} height={48} />}
        highlighted={reducedMotion && hovered === 'day'}
        onEnter={() => setHovered('day')}
        onLeave={() => setHovered(null)}
        onSelect={() => choose('light', true)}
      />
      <Door
        ref={interactive ? nightRef : undefined}
        interactive={interactive}
        title={AIRLOCK.night.title}
        sub={AIRLOCK.night.sub}
        icon={<GlyphMoon width={48} height={48} />}
        highlighted={reducedMotion && hovered === 'night'}
        onEnter={() => setHovered('night')}
        onLeave={() => setHovered(null)}
        onSelect={() => choose('dark', true)}
      />
    </>
  )

  return (
    <div
      ref={rootRef}
      className="airlock"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your theme to enter"
    >
      {/* Night is the base; day is clipped over it, so moving the clip edge
          is what makes one palette flood across the seam (§S00 step 1). */}
      <div className="airlock__night" aria-hidden="true" />
      <div
        className="airlock__day"
        aria-hidden="true"
        style={{ clipPath: dayClip, transition: reducedMotion ? undefined : FLOOD }}
      />
      <div
        className="airlock__seam dither dither-ink dither-50"
        aria-hidden="true"
        style={{ left: seam, transition: reducedMotion ? undefined : 'left 400ms steps(8)' }}
      />

      {/* §S00: the idle half dims to dither-25. */}
      {!reducedMotion && hovered ? (
        <div
          className={cx(
            'airlock__idle dither dither-ink dither-25',
            hovered === 'day' ? 'right-0' : 'left-0',
          )}
          aria-hidden="true"
          // Dim with the *idle* mood's own shadow. Both palettes are
          // dark-ground, so inking one half with the other's accent would
          // lighten it — the opposite of dimming.
          style={{
            ['--dither-ink' as string]:
              hovered === 'day' ? 'var(--night-shadow)' : 'var(--day-shadow)',
          }}
        />
      ) : null}

      <div className="airlock__content">
        <div className="airlock__doorsWrap">
          {/* The real, interactive doors, inked for the night palette. */}
          <div className="airlock__doors airlock__doors--night">{doors(true)}</div>

          {/*
            A decorative copy inked for the day palette, clipped to exactly the
            same edge as the day background. The labels therefore change colour
            *at the flood edge* rather than all at once — without this, the far
            door sits at night text on day bg — cream on cream, 1.03:1 — for
            the whole 400ms of the wipe. aria-hidden with pointer-events off, so it adds no tab stop.
          */}
          <div
            className="airlock__doors airlock__doors--day airlock__doors--ghost"
            aria-hidden="true"
            style={{ clipPath: dayClip, transition: reducedMotion ? undefined : FLOOD }}
          >
            {doors(false)}
          </div>
        </div>

        {/* MOCHI floats on the seam, ears tilting toward the hovered side. */}
        <div className="airlock__mochi" aria-hidden="true">
          <MochiSprite
            size={64}
            ears={hovered === 'day' ? 'tiltLeft' : hovered === 'night' ? 'tiltRight' : 'normal'}
          />
        </div>

        <footer className="airlock__bar">
          {/* The bar is night ground throughout, so its kicker takes the
              night accent: orchid on charcoal, 6.47:1. */}
          <p className="hud text-[color:var(--night-sec)]">{AIRLOCK.kicker}</p>
          {/* Not an <h1>: the hero already owns the page's only one (§9), and
              the dialog's aria-label already states its purpose. */}
          <p className="airlock__prompt">{AIRLOCK.prompt}</p>
          <button
            type="button"
            className="airlock__skip"
            onClick={() => choose(systemTheme(), false)}
          >
            {AIRLOCK.skip}
          </button>
        </footer>
      </div>

      {/* The reveal: a vertical dither wipe in 12 steps that uncovers the hero
          already rendered underneath. Unmounting is driven by a timer, not by
          animationend, so a dropped frame can never leave the gate stuck. */}
      {phase === 'closing' ? (
        <div
          aria-hidden="true"
          className={cx('airlock__wipe', chosen === 'dark' ? 'is-night' : 'is-day')}
          style={
            reducedMotion
              ? { animation: `airlock-fade ${REDUCED_MS}ms steps(2) forwards` }
              : { animation: `airlock-wipe ${WIPE_MS}ms steps(12) forwards` }
          }
        />
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */

type DoorProps = {
  title: string
  sub: string
  icon: ReactNode
  /** False for the clipped decorative copy. */
  interactive: boolean
  highlighted: boolean
  onEnter: () => void
  onLeave: () => void
  onSelect: () => void
}

/**
 * forwardRef: on React 18 a plain `ref` prop is not forwarded, and the airlock
 * has to focus a door for both autofocus and the arrow keys.
 */
const Door = forwardRef<HTMLButtonElement, DoorProps>(function Door(
  { title, sub, icon, interactive, highlighted, onEnter, onLeave, onSelect },
  ref,
) {
  const face = (
    <>
      <span className="airlock__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="airlock__title">{title}</span>
      {/* §S00 edge case: sub-labels are dropped on a very short viewport. */}
      <span className="airlock__sub">{sub}</span>
      <span className={cx('airlock__enter', highlighted && 'is-highlighted')}>Enter</span>
    </>
  )

  if (!interactive) return <span className="airlock__door">{face}</span>

  return (
    <button
      ref={ref}
      type="button"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onSelect}
      className="airlock__door"
    >
      {face}
    </button>
  )
})

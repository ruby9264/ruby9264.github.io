import { cx } from '@/lib/cx'
import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { Starfield } from './Starfield'
import { ABOUT, PROCESS, PROCESS_HEADING } from '@/data/about'
import { PROFILE } from '@/data/profile'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S03 — the deliberately quiet section. Asymmetric two columns at md:
 * a portrait panel on the left (5/12) and prose on the right (7/12),
 * capped at 62ch.
 */
export function S03About() {
  return (
    <Section id="about" title={ABOUT.heading}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        {/* §S03: the panel must not stretch with the prose. */}
        <div className="md:col-span-5 md:self-start lg:sticky lg:top-24">
          <PortraitPanel />
        </div>

        <div className="md:col-span-7">
          {ABOUT.body.map((paragraph, i) => (
            <p key={i} className="mb-6 max-w-measure text-lead text-[color:var(--ink-soft)] last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ProcessRail />
    </Section>
  )
}

/** The about.txt window: MOCHI's visor reflecting the starfield, plus an [R] badge. */
function PortraitPanel() {
  return (
    <Panel variant="window" title={ABOUT.panelTitle}>
      <div className="relative flex items-center justify-center overflow-hidden border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)] py-8">
        <Starfield />
        <MochiSprite size={128} eyes="open" className="relative" />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 flex-none items-center justify-center border-2 border-[color:var(--line)] bg-[color:var(--brand)] font-display text-small font-bold text-[color:var(--on-brand)]"
        >
          {PROFILE.mark}
        </span>
        <span className="font-ui text-small text-[color:var(--ink-soft)]">
          {PROFILE.name} — {PROFILE.location}
        </span>
      </div>
    </Panel>
  )
}

/**
 * §S03 — four connected pixel nodes. Horizontal on desktop with a dotted
 * connector that draws once in steps(4); a vertical rail on mobile, because
 * a horizontal line between stacked nodes would point at nothing.
 */
function ProcessRail() {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.3)
  const reducedMotion = useReducedMotion()
  const animate = seen && !reducedMotion

  return (
    <div ref={ref} className="mt-24">
      <h3 className="font-ui text-h3 font-bold">{PROCESS_HEADING}</h3>

      <ol className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
        {/* Desktop: one horizontal rail behind the nodes. */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute left-0 right-0 top-[16px] hidden h-[2px] md:block',
            'dither dither-50',
            animate && 'rail-draw',
          )}
        />

        {PROCESS.map((stage, i) => (
          <li key={stage.number} className="relative pl-10 md:pl-0">
            {/* Mobile: a vertical dotted rail down the left. */}
            {i < PROCESS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cx(
                  'absolute left-[15px] top-8 h-full w-[2px] md:hidden',
                  'dither dither-50',
                  animate && 'rail-draw-y',
                )}
              />
            ) : null}

            <span
              aria-hidden="true"
              className={cx(
                'absolute left-0 top-0 flex h-8 w-8 items-center justify-center md:relative',
                'border-2 border-[color:var(--line)] font-ui text-label font-semibold',
                animate || reducedMotion
                  ? 'bg-[color:var(--brand)] text-[color:var(--on-brand)]'
                  : 'bg-[color:var(--bg-raised)] text-[color:var(--ink-mute)]',
              )}
              style={animate ? { transitionDelay: `${i * 150}ms` } : undefined}
            >
              {stage.number}
            </span>

            <h4 className="mt-0 font-ui text-h3 font-bold md:mt-6">
              <span className="sr-only">Stage {stage.number}: </span>
              {stage.stage}
            </h4>
            <p className="mt-2 text-[color:var(--ink-soft)]">{stage.line}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

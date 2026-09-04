import { useEffect, useState } from 'react'
import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { GlyphMedal } from '@/components/pixel/SkillIcons'
import {
  CERTIFICATIONS,
  CERTIFICATIONS_HEADING,
  EDUCATION,
  EDUCATION_HEADING,
  type EducationSlot,
} from '@/data/education'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S07 — credentials as game save-file slots, because this is a scanning
 * task rather than a reading one and a consistent shape reads instantly.
 */
export function S07Education() {
  return (
    <Section id="education" title={EDUCATION_HEADING}>
      <ol className="flex flex-col gap-8">
        {EDUCATION.map((slot) => (
          <li key={slot.slot}>
            <SaveSlot slot={slot} />
          </li>
        ))}
      </ol>

      <h3 className="mt-24 font-ui text-h3 font-bold">{CERTIFICATIONS_HEADING}</h3>
      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {CERTIFICATIONS.map((cert) => (
          <li key={cert.name}>
            {/* §S07 edge case: a min-height keeps the grid even when names
                wrap to different line counts. */}
            <Panel className="flex h-full min-h-[140px] gap-4">
              <span aria-hidden="true" className="mt-1 flex-none text-[color:var(--brand)]">
                <GlyphMedal />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-ui text-body font-semibold text-balance">{cert.name}</h4>
                  <span className="hud flex-none border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)] px-2 py-1 text-[color:var(--ink-soft)]">
                    {cert.year.split(' — ')[0]}
                  </span>
                </div>

                <p className="mt-2 text-small text-balance text-[color:var(--ink-mute)]">
                  {cert.provider}
                </p>

                {cert.ongoing ? (
                  <p className="mt-3 flex items-center gap-2 text-small text-[color:var(--ink-soft)]">
                    <span
                      aria-hidden="true"
                      className="dot-pulse block h-1 w-1 flex-none bg-[color:var(--brand)]"
                    />
                    Ongoing
                  </p>
                ) : null}
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function SaveSlot({ slot }: { slot: EducationSlot }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.4)
  const reducedMotion = useReducedMotion()
  const hasBar = typeof slot.progress === 'number'
  const [filled, setFilled] = useState(false)

  // §S07: the bar fills once on entry, in steps(20) over 800ms. The *width*
  // is state, not an animation end-state — if the transition never runs the
  // bar still shows the real figure instead of an empty trough.
  useEffect(() => {
    if (!seen) return
    const t = setTimeout(() => setFilled(true), 0)
    return () => clearTimeout(t)
  }, [seen])

  return (
    <div ref={ref}>
      <Panel variant="window" title={`${slot.slot} — ${slot.status}`}>
        <h3 className="font-ui text-h3 font-bold">{slot.title}</h3>
        {slot.subtitle ? (
          <p className="mt-1 font-ui text-body text-[color:var(--ink-soft)]">{slot.subtitle}</p>
        ) : null}
        <p className="mt-3 text-[color:var(--ink-soft)]">{slot.institution}</p>
        <p className="mt-1 text-small text-[color:var(--ink-mute)]">{slot.dates}</p>

        {hasBar ? (
          <div className="mt-6">
            <div
              role="progressbar"
              aria-valuenow={slot.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${slot.title} progress`}
              className="dither dither-25 h-4 w-full border-2 border-[color:var(--line)]"
            >
              <span
                aria-hidden="true"
                className="block h-full bg-[color:var(--brand)]"
                style={{
                  width: filled ? `${slot.progress}%` : '0%',
                  transition: reducedMotion ? undefined : 'width 800ms steps(20)',
                }}
              />
            </div>
            <p className="mt-2 text-small text-[color:var(--ink-mute)]">
              {slot.progress}% complete
            </p>
          </div>
        ) : null}
      </Panel>
    </div>
  )
}

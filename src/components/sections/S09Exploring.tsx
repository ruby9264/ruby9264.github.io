import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { EXPLORING, EXPLORING_HEADING } from '@/data/exploring'

/**
 * §S09 — the "Currently exploring" band.
 *
 * The spec's own edge case decides this: testimonials only ship if there are
 * at least two real ones, because "placeholder or invented testimonials are
 * actively damaging to credibility". There are none, so this band ships
 * instead — an honest signal of trajectory rather than a fabricated one of
 * reputation.
 */
export function S09Exploring() {
  return (
    <Section id="exploring" title={EXPLORING_HEADING}>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {EXPLORING.map((card) => (
          <li key={card.title}>
            <Panel className="h-full">
              <h3 className="font-ui text-h3 font-bold">{card.title}</h3>
              <p className="mt-3 text-[color:var(--ink-soft)]">{card.line}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </Section>
  )
}

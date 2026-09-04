import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { StatBar } from '@/components/pixel/StatBar'
import {
  LANGUAGES,
  LANGUAGES_HEADING,
  LANGUAGES_PANEL_TITLE,
  LANGUAGE_SEGMENTS,
} from '@/data/languages'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S08 — RPG-style proficiency bars. Five languages is a real differentiator
 * and a chip list buries it.
 *
 * The level tag beside each bar is required, not decorative: §S08 and §9 both
 * forbid conveying the level by bar length alone.
 */
export function S08Languages() {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.3)
  const reducedMotion = useReducedMotion()

  return (
    <Section id="languages" title={LANGUAGES_HEADING}>
      <div ref={ref}>
        <Panel variant="window" title={LANGUAGES_PANEL_TITLE}>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-12">
            {LANGUAGES.map((language) => (
              <li
                key={language.name}
                className="flex flex-wrap items-center gap-x-4 gap-y-2"
              >
                <span
                  lang={language.lang}
                  className="min-w-[7ch] font-ui text-body font-semibold text-[color:var(--ink)]"
                >
                  {language.name}
                </span>

                <StatBar
                  value={language.value}
                  max={LANGUAGE_SEGMENTS}
                  label={language.srLabel}
                  srLabel={language.srLabel}
                  active={seen || reducedMotion}
                  stagger={reducedMotion ? 0 : 60}
                />

                <span className="hud ml-auto flex-none text-[color:var(--ink-soft)]">
                  {language.level}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}

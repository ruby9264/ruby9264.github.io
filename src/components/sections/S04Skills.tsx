import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { SKILL_ICONS } from '@/components/pixel/SkillIcons'
import { SKILL_TABS, SKILLS_PANEL_TITLE } from '@/data/skills'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * §S04 — the inventory screen.
 *
 * A real tablist: roving tabindex, arrow keys, aria-selected, and a status
 * strip along the bottom that mirrors the focused or hovered slot the way a
 * game inventory tooltip does.
 */
export function S04Skills() {
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [swapping, setSwapping] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const reducedMotion = useReducedMotion()

  const tabId = (i: number) => `${baseId}-tab-${i}`
  const panelId = (i: number) => `${baseId}-panel-${i}`

  // §S04: content swaps behind a 150ms dither, with no height jump.
  useEffect(() => {
    if (reducedMotion) return
    setSwapping(true)
    const t = setTimeout(() => setSwapping(false), 150)
    return () => clearTimeout(t)
  }, [active, reducedMotion])

  const move = (delta: number) => {
    const next = (active + delta + SKILL_TABS.length) % SKILL_TABS.length
    setActive(next)
    setStatus(null)
    tabRefs.current[next]?.focus()
  }

  const tab = SKILL_TABS[active]

  return (
    <Section id="skills" title="Skills">
      <Panel variant="window" title={SKILLS_PANEL_TITLE}>
        {/* §S04: the strip scrolls rather than wrapping at 320px. */}
        <div
          role="tablist"
          aria-label="Skill categories"
          className="tabstrip -mx-6 -mt-6 mb-6 border-b-2 border-[color:var(--line)]"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              move(1)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              move(-1)
            } else if (e.key === 'Home') {
              e.preventDefault()
              setActive(0)
              tabRefs.current[0]?.focus()
            } else if (e.key === 'End') {
              e.preventDefault()
              const last = SKILL_TABS.length - 1
              setActive(last)
              tabRefs.current[last]?.focus()
            }
          }}
        >
          {SKILL_TABS.map((t, i) => {
            const selected = i === active
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={selected}
                aria-controls={panelId(i)}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setActive(i)
                  setStatus(null)
                }}
                className={cx(
                  'flex min-h-[44px] flex-none items-center whitespace-nowrap px-6',
                  'border-r-2 border-[color:var(--line)]',
                  'font-ui text-label font-semibold uppercase tracking-[0.08em]',
                  selected
                    ? 'bg-[color:var(--brand)] text-[color:var(--on-brand)]'
                    : 'bg-[color:var(--bg-raised)] text-[color:var(--ink)] hover:bg-[color:var(--bg-sunken)]',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {SKILL_TABS.map((t, i) => (
          <div
            key={t.id}
            role="tabpanel"
            id={panelId(i)}
            aria-labelledby={tabId(i)}
            hidden={i !== active}
            // §S04: no height jump between tabs.
            className="relative min-h-[280px]"
          >
            {i === active && swapping ? <span aria-hidden="true" className="dither-swap" /> : null}
            {t.items.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {t.items.map((skill) => {
                  const Icon = SKILL_ICONS[skill.icon]
                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        onMouseEnter={() => setStatus(skill.name)}
                        onMouseLeave={() => setStatus(null)}
                        onFocus={() => setStatus(skill.name)}
                        onBlur={() => setStatus(null)}
                        className={cx(
                          'flex h-full w-full min-h-[96px] flex-col items-center justify-center gap-3 p-4 text-center',
                          'border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]',
                          'transition-[box-shadow,transform] duration-100 ease-steps-4',
                          // hover: 2px inner highlight. active: presses 2px down.
                          'hover:shadow-[inset_0_0_0_2px_var(--brand)]',
                          'active:translate-x-[2px] active:translate-y-[2px]',
                        )}
                      >
                        <span aria-hidden="true" className="text-[color:var(--brand)]">
                          <Icon />
                        </span>
                        <span className="font-ui text-small leading-tight text-[color:var(--ink)]">
                          {skill.name}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}

        {/* Inventory status strip. Not a live region: it mirrors what the
            visitor is already pointing at or focused on, and the slot's own
            label is announced anyway. */}
        <div className="-mx-6 -mb-6 mt-6 flex min-h-[44px] items-center border-t-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)] px-6">
          <span className="font-ui text-small text-[color:var(--ink-soft)]" aria-hidden="true">
            {status ?? `${tab.items.length} items in ${tab.label.toLowerCase()}`}
          </span>
        </div>
      </Panel>
    </Section>
  )
}

/** §S04 edge case: an empty category shows MOCHI asleep, never a blank grid. */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <MochiSprite ears="droop" eyes="closed" accessory="zzz" size={96} />
      <p className="font-ui text-small text-[color:var(--ink-mute)]">nothing here yet</p>
    </div>
  )
}

import { cx } from '@/lib/cx'
import { NAV_ITEMS } from '@/data/nav'
import { NAV_ICONS } from '@/components/pixel/NavIcons'
import { scrollToId } from '@/hooks/useLenis'

/**
 * §4.4 — fixed bottom dock under 768px. Five slots, 16px glyphs, 10px
 * Pixelify labels, an inverted fill plus a 4px indicator bar on the active
 * slot, and safe-area padding so iOS's home indicator doesn't sit on it.
 *
 * The label is not decorative: §9 forbids conveying the active slot by fill
 * alone, and a bare icon row is unreadable to anyone who doesn't already know
 * the icons.
 */
export function MobileDock({ activeId }: { activeId: string | null }) {
  return (
    <nav
      aria-label="Sections"
      className={cx(
        'fixed inset-x-0 bottom-0 z-[900] md:hidden',
        'border-t-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <ul className="flex">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.id]
          const current = activeId === item.id
          return (
            <li key={item.id} className="flex-1">
              <a
                href={`#${item.id}`}
                aria-current={current ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(item.id)
                }}
                className={cx(
                  'relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 no-underline',
                  current
                    ? 'bg-[color:var(--brand)] text-[color:var(--on-brand)]'
                    : 'text-[color:var(--ink)]',
                )}
              >
                {/* 4px indicator bar across the top of the active slot.
                    Not amber: the slot beneath it is already --brand, and
                    amber on moss measures 1.96:1 — invisible. --on-brand is
                    6.83:1, and it keeps amber inside §2.2's four-use cap. */}
                <span
                  aria-hidden="true"
                  className={cx(
                    'absolute inset-x-0 top-0 h-[4px]',
                    current ? 'bg-[color:var(--on-brand)]' : 'bg-transparent',
                  )}
                />
                {Icon ? <Icon /> : null}
                <span className="font-ui text-[10px] uppercase leading-none tracking-[0.06em]">
                  {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

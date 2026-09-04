import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { Container } from './Container'
import { SettingsMenu } from './SettingsMenu'
import { ThemeSwitch } from '@/components/pixel/ThemeSwitch'
import { NAV_ITEMS } from '@/data/nav'
import { PROFILE } from '@/data/profile'
import { useTheme } from '@/hooks/useTheme'
import { scrollToId } from '@/hooks/useLenis'

type NavProps = {
  activeId: string | null
  /**
   * Home has a full-viewport hero to float over; every other route does not,
   * so the bar docks immediately there rather than floating invisibly.
   */
  hasHero: boolean
}

/** §4.4 — desktop top bar, md and up. The dock bar covers mobile. */
export function Nav({ activeId, hasHero }: NavProps) {
  const { theme, toggleTheme } = useTheme()
  const [docked, setDocked] = useState(!hasHero)

  useEffect(() => {
    if (!hasHero) {
      setDocked(true)
      return
    }
    const onScroll = () => setDocked(window.scrollY > window.innerHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasHero])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-[900] hidden md:block',
        'transition-[background-color,box-shadow] duration-200 ease-steps-4',
        docked
          ? 'border-b-2 border-[color:var(--line)] bg-[color:var(--bg-raised)] shadow-[0_4px_0_var(--shadow)]'
          : 'border-b-2 border-transparent bg-transparent',
      )}
    >
      <Container className="flex items-center justify-between gap-6 py-3">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('home')
          }}
          className="hud flex h-[44px] w-[44px] flex-none items-center justify-center text-[color:var(--ink)] no-underline"
        >
          {PROFILE.mark}
          <span className="sr-only"> — {PROFILE.wordmark}, back to top</span>
        </a>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const current = activeId === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(item.id)
                    }}
                    className={cx(
                      'flex min-h-[44px] items-center px-3 font-ui text-label font-semibold uppercase tracking-[0.08em] no-underline',
                      'border-2 transition-colors duration-100 ease-steps-4',
                      current
                        ? 'border-[color:var(--line)] bg-[color:var(--brand)] text-[color:var(--on-brand)]'
                        : 'border-transparent text-[color:var(--ink)] hover:border-[color:var(--line)] hover:bg-[color:var(--bg-sunken)]',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-none items-center gap-3">
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
          <SettingsMenu />
        </div>
      </Container>
    </header>
  )
}

import { cx } from '@/lib/cx'
import { Container } from './Container'
import { FooterScene } from '@/components/sections/FooterScene'
import { IconContact, IconDoc, IconGitHub, IconLinkedIn, IconPin } from '@/components/pixel/NavIcons'
import { ThemeSwitch } from '@/components/pixel/ThemeSwitch'
import { NAV_ITEMS } from '@/data/nav'
import { FOOTER, PROFILE, emailAddress, emailObfuscated } from '@/data/profile'
import { CV_AVAILABLE } from '@/data/site'
import { useTheme } from '@/hooks/useTheme'
import { scrollToId } from '@/hooks/useLenis'

/* §9 — 44x44 minimum. min-w extends the hit area to the right of short
   labels without shifting the text off the column's left edge. */
const linkClass =
  'inline-flex min-h-[44px] min-w-[44px] items-center text-[color:var(--ink-soft)] no-underline hover:text-[color:var(--ink)] hover:underline'

/**
 * §S11 — the sign-off. The horizon scene sits above a three-column link grid,
 * and it should feel like leaving somewhere rather than hitting the bottom
 * of a page.
 */
export function Footer() {
  const { theme, toggleTheme } = useTheme()

  return (
    <footer className="border-t-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]">
      <FooterScene />

      <Container className="pb-16 pt-12 lg:pb-24">
        <p className="font-display text-h2">{FOOTER.signOff}</p>
        <p className="mt-4 text-lead text-[color:var(--ink-soft)]">{FOOTER.subLine}</p>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="hud mb-3 text-[color:var(--ink)]">{FOOTER.columns.navigate}</h2>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(item.id)
                    }}
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="hud mb-3 text-[color:var(--ink)]">{FOOTER.columns.elsewhere}</h2>
            <ul>
              <li>
                <EmailLink />
              </li>
              <li>
                <a
                  href={PROFILE.linkedin}
                  className={cx(linkClass, 'gap-3')}
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  <IconLinkedIn className="flex-none text-[color:var(--brand)]" />
                  LinkedIn
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.github}
                  className={cx(linkClass, 'gap-3')}
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  <IconGitHub className="flex-none text-[color:var(--brand)]" />
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                {CV_AVAILABLE ? (
                  <a href={PROFILE.cv} className={cx(linkClass, 'gap-3')} download>
                    <IconDoc className="flex-none text-[color:var(--brand)]" />
                    CV (PDF)
                  </a>
                ) : (
                  <span className="inline-flex min-h-[44px] items-center gap-3 text-[color:var(--ink-mute)]">
                    <IconDoc className="flex-none" />
                    CV (PDF) — coming soon
                  </span>
                )}
              </li>
              <li>
                <span className="inline-flex min-h-[44px] items-center gap-3 text-[color:var(--ink-soft)]">
                  <IconPin className="flex-none text-[color:var(--brand)]" />
                  {PROFILE.location}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="hud mb-3 text-[color:var(--ink)]">{FOOTER.columns.thisSite}</h2>
            <p className="max-w-measure pt-2 text-[color:var(--ink-soft)]">{FOOTER.colophon}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t-2 border-[color:var(--line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-[color:var(--ink-mute)]">{FOOTER.legal}</p>
          <ThemeSwitch theme={theme} onToggle={toggleTheme} className="flex-none" />
        </div>
      </Container>
    </footer>
  )
}

/**
 * §S10 — a plain mailto in the markup gets harvested within days, so the
 * address is displayed obfuscated and assembled at click time.
 */
function EmailLink() {
  return (
    <a
      href="#email"
      className={cx(linkClass, 'gap-3 no-underline hover:no-underline')}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${emailAddress()}`
      }}
    >
      <IconContact className="flex-none text-[color:var(--brand)]" />
      <span aria-hidden="true" className="underline">
        {emailObfuscated()}
      </span>
      <span className="sr-only">Email Ruby</span>
    </a>
  )
}

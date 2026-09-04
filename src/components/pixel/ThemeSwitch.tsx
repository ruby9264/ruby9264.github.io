import type { Theme } from '@/hooks/useTheme'
import { cx } from '@/lib/cx'
import { GlyphMoon, GlyphSun } from './PixelGlyph'

type ThemeSwitchProps = {
  theme: Theme
  onToggle: () => void
  className?: string
}

/**
 * §4.2 — a physical-looking two-position lever, sun on one side, moon on
 * the other. `role="switch"` with `aria-checked`, and an aria-label that
 * describes the *result* of pressing it, not the current state.
 *
 * The sprites are `aria-hidden`: state is carried by aria-checked, so
 * announcing "sun moon" as well would just be noise.
 */
export function ThemeSwitch({ theme, onToggle, className }: ThemeSwitchProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to day theme' : 'Switch to night theme'}
      onClick={onToggle}
      className={cx(
        'relative inline-flex h-[44px] w-[88px] flex-none items-center',
        'border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]',
        'shadow-[inset_2px_2px_0_var(--shadow)] p-1',
        className,
      )}
    >
      {/* Track icons mark the two positions. The lever parks over one of
          them, so the icon left showing is always the *other* setting —
          which is what the aria-label promises too. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-[10px] text-[color:var(--ink-mute)]"
      >
        <GlyphSun />
        <GlyphMoon />
      </span>

      {/* The lever — carries the *current* setting's icon so the switch is
          readable at a glance, and snaps 40px with no easing. */}
      <span
        aria-hidden="true"
        className={cx(
          'relative z-10 flex h-[32px] w-[36px] items-center justify-center',
          'border-2 border-[color:var(--line)] text-[color:var(--on-brand)]',
          'bg-[color:var(--brand)] shadow-[2px_2px_0_var(--shadow)]',
          'transition-transform duration-150 ease-steps-4',
          isDark ? 'translate-x-[40px]' : 'translate-x-0',
        )}
      >
        {isDark ? <GlyphMoon /> : <GlyphSun />}
      </span>
    </button>
  )
}

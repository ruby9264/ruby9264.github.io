import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * The four §4.5 controls, in one place.
 *
 * Phase 1 had `useTheme` as a plain hook with local state, which only worked
 * because a single component called it at a time. The nav, the settings menu
 * and the footer all need theme at once, so it lives in context now.
 */

export type Theme = 'light' | 'dark'

/**
 * §4.5 offers Full / Reduced, but the OS preference is a third input. If the
 * system says "reduce" and the toggle says "full", one of them has to win —
 * so the setting is tri-state and defaults to following the system.
 */
export type MotionSetting = 'system' | 'full' | 'reduced'

export type Settings = {
  theme: Theme
  motion: MotionSetting
  /** §4.1 — the custom cursor must always be escapable. */
  cursor: boolean
  /**
   * Ambient background music.
   *
   * §4.5 says "default OFF, audio is never autoplayed"; Ruby asked for the
   * reverse, so this now defaults ON and AmbientAudio starts the track as
   * early as the browser permits. The escape hatches the criterion actually
   * needs are the settings menu and MOCHI's menu — see AmbientAudio for the
   * autoplay-policy handling and the WCAG 1.4.2 note.
   */
  sound: boolean
}

const THEME_KEY = 'r-theme' // §4.2 names this key; S00 reads it.
const SETTINGS_KEY = 'r-settings'

/* --bg-primary for each mood, literal because <meta> cannot read a token.
   The pre-paint script in index.html carries the same two values. */
const META_COLOR: Record<Theme, string> = {
  light: '#FFF2D4',
  dark: '#234151',
}

const DEFAULTS: Omit<Settings, 'theme'> = {
  motion: 'system',
  cursor: true,
  // On by default — see the note on Settings['sound']. A visitor who has
  // already turned it off keeps that: readSettings() prefers what is stored.
  sound: true,
}

export function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function systemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function systemPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readSettings(): Omit<Settings, 'theme'> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      motion:
        parsed.motion === 'full' || parsed.motion === 'reduced' || parsed.motion === 'system'
          ? parsed.motion
          : DEFAULTS.motion,
      cursor: typeof parsed.cursor === 'boolean' ? parsed.cursor : DEFAULTS.cursor,
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULTS.sound,
    }
  } catch {
    return DEFAULTS
  }
}

type SettingsContextValue = Settings & {
  /** True when motion should actually be suppressed, setting + system combined. */
  reducedMotion: boolean
  /** Has the visitor made an explicit theme choice? S00 skips the gate if so. */
  hasChosenTheme: boolean
  setTheme: (theme: Theme, persist?: boolean) => void
  toggleTheme: () => void
  setMotion: (motion: MotionSetting) => void
  setCursor: (on: boolean) => void
  setSound: (on: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => storedTheme() ?? systemTheme())
  const [hasChosenTheme, setHasChosenTheme] = useState(() => storedTheme() !== null)
  const [rest, setRest] = useState<Omit<Settings, 'theme'>>(readSettings)
  const [systemReduced, setSystemReduced] = useState(systemPrefersReducedMotion)

  const reducedMotion =
    rest.motion === 'reduced' || (rest.motion === 'system' && systemReduced)

  // ---- apply to the document ----
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', META_COLOR[theme])
  }, [theme])

  useEffect(() => {
    // base.css keys off both: `reduced` forces the contract on, `full` opts
    // out of the prefers-reduced-motion media query.
    const el = document.documentElement
    if (reducedMotion) el.setAttribute('data-motion', 'reduced')
    else if (rest.motion === 'full') el.setAttribute('data-motion', 'full')
    else el.removeAttribute('data-motion')
  }, [reducedMotion, rest.motion])

  useEffect(() => {
    document.documentElement.setAttribute('data-cursor', rest.cursor ? 'custom' : 'system')
  }, [rest.cursor])

  // ---- persist ----
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(rest))
    } catch {
      /* private mode — settings still apply for this session */
    }
  }, [rest])

  // ---- track system preferences ----
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    // §4.2 — the system scheme is the pre-selected door, not an override, so
    // it only drives the theme while no explicit choice exists.
    if (hasChosenTheme || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setThemeState(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [hasChosenTheme])

  const setTheme = useCallback((next: Theme, persist = true) => {
    setThemeState(next)
    if (!persist) return
    setHasChosenTheme(true)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light'
      setHasChosenTheme(true)
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = useMemo<SettingsContextValue>(
    () => ({
      theme,
      ...rest,
      reducedMotion,
      hasChosenTheme,
      setTheme,
      toggleTheme,
      setMotion: (motion) => setRest((s) => ({ ...s, motion })),
      setCursor: (cursor) => setRest((s) => ({ ...s, cursor })),
      setSound: (sound) => setRest((s) => ({ ...s, sound })),
    }),
    [theme, rest, reducedMotion, hasChosenTheme, setTheme, toggleTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}

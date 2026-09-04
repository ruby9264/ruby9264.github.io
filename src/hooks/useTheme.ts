import { useSettings } from './useSettings'

export type { Theme } from './useSettings'
export { storedTheme, systemTheme } from './useSettings'

/**
 * Kept as its own hook so components that only care about theme don't reach
 * for the whole settings object. The state itself lives in SettingsProvider.
 */
export function useTheme() {
  const { theme, setTheme, toggleTheme, hasChosenTheme } = useSettings()
  return { theme, setTheme, toggleTheme, hasChosen: hasChosenTheme }
}

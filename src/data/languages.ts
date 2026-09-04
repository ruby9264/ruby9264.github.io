/**
 * §S08 — language stat bars.
 *
 * `level` is not decorative. §S08: "Never rely on bar length alone — the text
 * level tag is required." `srLabel` spells the level out for the meter, since
 * "B2 / C1" read aloud as characters is not useful.
 */

export type Language = {
  name: string
  /** BCP-47 tag for the name itself, where it isn't English (§9). */
  lang?: string
  /** 0-10, matching the ten segments. */
  value: number
  level: string
  srLabel: string
}

export const LANGUAGES: Language[] = [
  { name: 'Burmese', value: 10, level: 'NATIVE', srLabel: 'Burmese proficiency: native' },
  { name: 'English', value: 8, level: 'B2 / C1', srLabel: 'English proficiency: B2 to C1' },
  { name: 'Hindi', value: 6, level: 'INTERMEDIATE', srLabel: 'Hindi proficiency: intermediate' },
  { name: '日本語', lang: 'ja', value: 5, level: 'JLPT N4', srLabel: 'Japanese proficiency: JLPT N4' },
  { name: '中文', lang: 'zh', value: 3, level: 'HSK 2', srLabel: 'Chinese proficiency: HSK 2' },
]

export const LANGUAGES_PANEL_TITLE = 'LANGUAGE STATS'
export const LANGUAGES_HEADING = 'Languages'
export const LANGUAGE_SEGMENTS = 10

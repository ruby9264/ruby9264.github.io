/** §S00 — copy verbatim from the spec, except the two door subtitles, which
    name the palette and move with it: day is now ink on cream paper and
    night is the deep teal. */

export const AIRLOCK = {
  kicker: 'R // MOON STATION',
  prompt: 'Choose your light.',
  day: { title: 'DAY SIDE', sub: 'cream & sunlight' },
  night: { title: 'NIGHT SIDE', sub: 'teal & starlight' },
  skip: 'skip — use my system setting',
} as const

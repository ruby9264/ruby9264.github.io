/**
 * LOTUS — the pixel art itself.
 *
 * Six frames on an 11x9 grid, closed bud to full bloom. Like MOCHI (§3.3)
 * the art is data, not an image file: no sprite PNG to keep in sync with the
 * palette, and every colour is a live token, so the flowers re-ink themselves
 * when the theme flips.
 *
 * The frames are a strict progression — frame N is always more open than
 * frame N-1 — because the animation plays them forwards to bloom and
 * backwards to close, and a non-monotonic frame reads as a stutter.
 */

export const LOTUS_W = 11
export const LOTUS_H = 9

/** Character -> ink key. '.' is transparent and never drawn. */
export type Ink = 'petal' | 'petalDeep' | 'core' | 'pad' | 'padDark'

export const INK_FOR: Record<string, Ink> = {
  a: 'petal', // cream (day) / light orchid (night)
  b: 'petalDeep', // amber gold / orchid lavender
  c: 'core', // the seed head
  g: 'pad', // lily pad
  h: 'padDark', // the pad's shadowed underside
}

/**
 * Rows are hand-drawn, so their width is checked rather than trusted —
 * hand-counting 11 characters nine times over is how pixel art quietly
 * goes crooked (the same reason MOCHI builds its rows from spans).
 */
function frame(rows: string[]): readonly string[] {
  if (import.meta.env.DEV) {
    if (rows.length !== LOTUS_H) {
      throw new Error(`lotus frame has ${rows.length} rows, expected ${LOTUS_H}`)
    }
    const bad = rows.findIndex((r) => r.length !== LOTUS_W)
    if (bad !== -1) {
      throw new Error(`lotus row ${bad} is ${rows[bad].length} wide, expected ${LOTUS_W}`)
    }
  }
  return rows
}

export const FRAMES: readonly (readonly string[])[] = [
  // 0 — closed bud: a teardrop, tapered at the tip and again at the pad.
  // A straight 3-wide column reads as a candle, not a flower.
  frame([
    '...........',
    '.....b.....',
    '....aba....',
    '...aabaa...',
    '...aabaa...',
    '....aba....',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
  // 1 — the tip splits and the body swells.
  frame([
    '...........',
    '....b.b....',
    '....aba....',
    '...aabaa...',
    '..aaabaaa..',
    '...aabaa...',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
  // 2 — the inner petals lift away and the seed head appears.
  frame([
    '.....b.....',
    '...b.a.b...',
    '...aabaa...',
    '..aaabaaa..',
    '..aaabaaa..',
    '...aacaa...',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
  // 3 — half open.
  frame([
    '.....b.....',
    '...b.a.b...',
    '..baaaaab..',
    '..aaabaaa..',
    '.aaacccaaa.',
    '..aacccaa..',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
  // 4 — the outer petals reach the edges of the grid.
  frame([
    '.....b.....',
    '...b.a.b...',
    '.b.aabaa.b.',
    '.baaabaaab.',
    '.aaacccaaa.',
    '..aacccaa..',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
  // 5 — full bloom.
  frame([
    '.....b.....',
    '...b.a.b...',
    '.b.aabaa.b.',
    'baaaabaaaab',
    'baaacccaaab',
    '.aaacccaaa.',
    '....ggg....',
    '..ggggggg..',
    '...hhhhh...',
  ]),
]

export const FULL_BLOOM = FRAMES.length - 1

/** Grid cell the sparkles burst from — the centre of the seed head. */
export const CORE_CELL = { x: 5, y: 4 }

/**
 * MOCHI · Unit R-01 — the pixel art itself.
 *
 * §3.3 asks for SVG built from unit squares with crispEdges, animated by
 * swapping groups rather than by shipping a PNG per frame. So the sprite is
 * a set of LAYERS, each a sparse map of "row index -> row of characters".
 * A pose is a choice of one layer per slot: ears, eyes, arms, accessory.
 *
 * Rows are built with `span()` rather than typed as literal strings, because
 * hand-counting 24 characters per row is how pixel art quietly goes crooked.
 */

export const ART_W = 24
export const ART_H = 32

/** Character -> CSS colour. '.' is transparent and never drawn. */
export const PALETTE: Record<string, string> = {
  F: 'var(--mochi-fur)',
  H: 'var(--mochi-helmet)',
  V: 'var(--mochi-visor)',
  K: 'var(--mochi-dark)',
  S: 'var(--mochi-suit)',
  P: 'var(--mochi-patch)',
  A: 'var(--accent)',
  W: 'var(--star)',
}

/** row index -> a full ART_W-character row */
export type Layer = Record<number, string>

type Span = [start: number, length: number, ch: string]

/** Build one row from spans. Overlapping spans are applied left to right. */
function span(...spans: Span[]): string {
  const row = new Array<string>(ART_W).fill('.')
  for (const [start, length, ch] of spans) {
    for (let i = start; i < start + length && i < ART_W; i++) row[i] = ch
  }
  return row.join('')
}

/* ------------------------------------------------------------------ */
/* BODY — helmet, visor, suit, R patch, feet. Constant across poses.   */
/* ------------------------------------------------------------------ */

export const BODY: Layer = {
  // helmet dome
  6: span([8, 8, 'H']),
  7: span([6, 12, 'H']),
  8: span([5, 14, 'H']),
  // visor band (moss green, §3)
  9: span([5, 14, 'H'], [7, 10, 'V']),
  10: span([5, 14, 'H'], [7, 10, 'V']),
  11: span([5, 14, 'H'], [7, 10, 'V']),
  12: span([5, 14, 'H'], [7, 10, 'V']),
  13: span([5, 14, 'H'], [7, 10, 'V']),
  14: span([5, 14, 'H'], [7, 10, 'V']),
  15: span([5, 14, 'H']),
  16: span([6, 12, 'H']),
  17: span([7, 10, 'H']),
  // pressure suit
  18: span([7, 10, 'S']),
  19: span([6, 12, 'S']),
  // The embroidered R patch (§3). The badge is a 5x7 block of --mochi-patch
  // with a full pixel of padding on every side, and the R is a 3x5 glyph in
  // --mochi-dark inside it. The padding matters: without it the badge's own
  // edge columns read as strokes and the letter turns to mush.
  20: span([6, 12, 'S'], [9, 5, 'P']),
  21: span([6, 12, 'S'], [9, 5, 'P'], [10, 2, 'K']),
  22: span([6, 12, 'S'], [9, 5, 'P'], [10, 1, 'K'], [12, 1, 'K']),
  23: span([6, 12, 'S'], [9, 5, 'P'], [10, 2, 'K']),
  24: span([6, 12, 'S'], [9, 5, 'P'], [10, 1, 'K'], [12, 1, 'K']),
  25: span([6, 12, 'S'], [9, 5, 'P'], [10, 1, 'K'], [12, 1, 'K']),
  26: span([6, 12, 'S'], [9, 5, 'P']),
  27: span([6, 12, 'S']),
}

/* ------------------------------------------------------------------ */
/* LEGS — a slot of their own, so §S05 can walk MOCHI along the ground */
/* ------------------------------------------------------------------ */

export const LEGS_STAND: Layer = {
  28: span([6, 5, 'S'], [13, 5, 'S']),
  29: span([5, 6, 'F'], [13, 6, 'F']),
  30: span([5, 6, 'F'], [13, 6, 'F']),
}

/** Stride open. */
export const LEGS_WALK_A: Layer = {
  28: span([4, 5, 'S'], [15, 5, 'S']),
  29: span([3, 6, 'F'], [15, 6, 'F']),
  30: span([3, 6, 'F'], [15, 6, 'F']),
}

/** Stride closed. Two frames is all a pixel walk needs. */
export const LEGS_WALK_B: Layer = {
  28: span([7, 4, 'S'], [13, 4, 'S']),
  29: span([6, 5, 'F'], [13, 5, 'F']),
  30: span([6, 5, 'F'], [13, 5, 'F']),
}

/* ------------------------------------------------------------------ */
/* EARS — "long ears that don't fit in the helmet, so they fold" (§3)  */
/* ------------------------------------------------------------------ */

export const EARS_NORMAL: Layer = {
  0: span([5, 3, 'F'], [16, 3, 'F']),
  1: span([6, 3, 'F'], [15, 3, 'F']),
  2: span([7, 3, 'F'], [14, 3, 'F']),
  3: span([7, 3, 'F'], [14, 3, 'F']),
  4: span([8, 3, 'F'], [13, 3, 'F']),
  5: span([8, 3, 'F'], [13, 3, 'F']),
}

/** Perked — straight up. Hover, and "ears perk" on form focus. */
export const EARS_PERKED: Layer = {
  0: span([8, 3, 'F'], [13, 3, 'F']),
  1: span([8, 3, 'F'], [13, 3, 'F']),
  2: span([8, 3, 'F'], [13, 3, 'F']),
  3: span([8, 3, 'F'], [13, 3, 'F']),
  4: span([8, 3, 'F'], [13, 3, 'F']),
  5: span([8, 3, 'F'], [13, 3, 'F']),
}

/** Blown back — the scroll-fast state. */
export const EARS_BACK: Layer = {
  0: span([2, 3, 'F'], [9, 3, 'F']),
  1: span([3, 3, 'F'], [10, 3, 'F']),
  2: span([5, 3, 'F'], [11, 3, 'F']),
  3: span([6, 3, 'F'], [12, 3, 'F']),
  4: span([8, 3, 'F'], [13, 3, 'F']),
  5: span([8, 3, 'F'], [13, 3, 'F']),
}

/** Drooped — flopped down and out. Form error, and asleep. */
export const EARS_DROOP: Layer = {
  4: span([8, 2, 'F'], [14, 2, 'F']),
  5: span([6, 4, 'F'], [14, 4, 'F']),
  6: span([4, 4, 'F'], [16, 4, 'F']),
  7: span([3, 3, 'F'], [18, 3, 'F']),
}

/** Tilted toward one side — the S00 airlock behaviour (§3.1). */
export const EARS_TILT_LEFT: Layer = {
  0: span([4, 3, 'F']),
  1: span([5, 3, 'F'], [13, 2, 'F']),
  2: span([6, 3, 'F'], [13, 3, 'F']),
  3: span([7, 3, 'F'], [13, 2, 'F']),
  4: span([8, 2, 'F'], [14, 2, 'F']),
  5: span([8, 3, 'F'], [13, 3, 'F']),
}

export const EARS_TILT_RIGHT: Layer = {
  0: span([17, 3, 'F']),
  1: span([9, 2, 'F'], [16, 3, 'F']),
  2: span([8, 3, 'F'], [15, 3, 'F']),
  3: span([9, 2, 'F'], [14, 3, 'F']),
  4: span([8, 2, 'F'], [14, 2, 'F']),
  5: span([8, 3, 'F'], [13, 3, 'F']),
}

/* ------------------------------------------------------------------ */
/* EYES — behind the visor                                            */
/* ------------------------------------------------------------------ */

export const EYES_OPEN: Layer = {
  10: span([9, 2, 'K'], [13, 2, 'K']),
  11: span([9, 2, 'K'], [13, 2, 'K']),
}

/** Blink and sleep are the same shape: a closed lid line. */
export const EYES_CLOSED: Layer = {
  11: span([8, 3, 'K'], [13, 3, 'K']),
}

/** Squint — the scroll-fast state. */
export const EYES_SQUINT: Layer = {
  10: span([8, 3, 'K'], [13, 3, 'K']),
}

/** Wide — the form-success jump. */
export const EYES_WIDE: Layer = {
  9: span([9, 2, 'K'], [13, 2, 'K']),
  10: span([9, 2, 'K'], [13, 2, 'K']),
  11: span([9, 2, 'K'], [13, 2, 'K']),
}

/* ------------------------------------------------------------------ */
/* ARMS                                                               */
/* ------------------------------------------------------------------ */

export const ARMS_REST: Layer = {
  20: span([4, 2, 'S'], [18, 2, 'S']),
  21: span([4, 2, 'S'], [18, 2, 'S']),
  22: span([4, 2, 'S'], [18, 2, 'S']),
  23: span([4, 2, 'S'], [18, 2, 'S']),
  24: span([4, 2, 'S'], [18, 2, 'S']),
  25: span([4, 2, 'S'], [18, 2, 'S']),
  26: span([4, 2, 'S'], [18, 2, 'S']),
  27: span([4, 2, 'F'], [18, 2, 'F']),
}

/** One paw raised — hover wave, and the footer goodbye. */
export const ARMS_WAVE: Layer = {
  15: span([20, 2, 'F']),
  16: span([19, 2, 'S']),
  17: span([19, 2, 'S']),
  18: span([18, 2, 'S']),
  19: span([17, 2, 'S']),
  20: span([4, 2, 'S']),
  21: span([4, 2, 'S']),
  22: span([4, 2, 'S']),
  23: span([4, 2, 'S']),
  24: span([4, 2, 'S']),
  25: span([4, 2, 'S']),
  26: span([4, 2, 'S']),
  27: span([4, 2, 'F']),
}

/** Wave, second frame — the paw crosses over. steps(2) between the two. */
export const ARMS_WAVE_ALT: Layer = {
  14: span([21, 2, 'F']),
  15: span([20, 2, 'S']),
  16: span([20, 2, 'S']),
  17: span([19, 2, 'S']),
  18: span([18, 2, 'S']),
  19: span([17, 2, 'S']),
  20: span([4, 2, 'S']),
  21: span([4, 2, 'S']),
  22: span([4, 2, 'S']),
  23: span([4, 2, 'S']),
  24: span([4, 2, 'S']),
  25: span([4, 2, 'S']),
  26: span([4, 2, 'S']),
  27: span([4, 2, 'F']),
}

/** Both paws forward — for holding things. */
export const ARMS_HOLD: Layer = {
  20: span([4, 2, 'S'], [18, 2, 'S']),
  21: span([3, 3, 'S'], [18, 3, 'S']),
  22: span([2, 3, 'F'], [19, 3, 'F']),
}

/* ------------------------------------------------------------------ */
/* ACCESSORIES                                                        */
/* ------------------------------------------------------------------ */

/** Coffee cup — one of the four sanctioned amber moments (§2.2). */
export const ACC_COFFEE: Layer = {
  16: span([1, 2, 'W']),
  17: span([2, 2, 'W']),
  18: span([1, 5, 'K']),
  19: span([1, 1, 'K'], [2, 3, 'A'], [5, 1, 'K']),
  20: span([1, 1, 'K'], [2, 3, 'A'], [5, 1, 'K']),
  21: span([1, 5, 'K']),
}

export const ACC_COOKIE: Layer = {
  19: span([19, 4, 'P']),
  20: span([18, 6, 'P'], [20, 1, 'K']),
  21: span([18, 6, 'P'], [19, 1, 'K'], [22, 1, 'K']),
  22: span([19, 4, 'P'], [21, 1, 'K']),
}

export const ACC_CLIPBOARD: Layer = {
  17: span([18, 4, 'K']),
  18: span([17, 6, 'W'], [19, 2, 'K']),
  19: span([17, 6, 'W']),
  20: span([17, 6, 'W'], [18, 4, 'K']),
  21: span([17, 6, 'W']),
  22: span([17, 6, 'W'], [18, 3, 'K']),
  23: span([17, 6, 'W']),
}

/** The snapped tether — S12, MOCHI adrift. */
export const ACC_CABLE: Layer = {
  24: span([2, 2, 'K']),
  25: span([1, 2, 'K']),
  26: span([0, 2, 'K']),
  27: span([1, 1, 'K']),
  28: span([0, 2, 'K']),
}

/** z z z — the idle-long sleep state. */
export const ACC_ZZZ: Layer = {
  0: span([19, 3, 'K']),
  1: span([21, 1, 'K']),
  2: span([19, 3, 'K']),
  4: span([17, 2, 'K']),
  5: span([18, 1, 'K']),
  6: span([17, 2, 'K']),
}

/* ------------------------------------------------------------------ */

export type LegPose = 'stand' | 'walkA' | 'walkB'
export type EarPose = 'normal' | 'perked' | 'back' | 'droop' | 'tiltLeft' | 'tiltRight'
export type EyePose = 'open' | 'closed' | 'squint' | 'wide'
export type ArmPose = 'rest' | 'wave' | 'waveAlt' | 'hold'
export type Accessory = 'none' | 'coffee' | 'cookie' | 'clipboard' | 'cable' | 'zzz'

export const LEGS: Record<LegPose, Layer> = {
  stand: LEGS_STAND,
  walkA: LEGS_WALK_A,
  walkB: LEGS_WALK_B,
}

export const EARS: Record<EarPose, Layer> = {
  normal: EARS_NORMAL,
  perked: EARS_PERKED,
  back: EARS_BACK,
  droop: EARS_DROOP,
  tiltLeft: EARS_TILT_LEFT,
  tiltRight: EARS_TILT_RIGHT,
}

export const EYES: Record<EyePose, Layer> = {
  open: EYES_OPEN,
  closed: EYES_CLOSED,
  squint: EYES_SQUINT,
  wide: EYES_WIDE,
}

export const ARMS: Record<ArmPose, Layer> = {
  rest: ARMS_REST,
  wave: ARMS_WAVE,
  waveAlt: ARMS_WAVE_ALT,
  hold: ARMS_HOLD,
}

export const ACCESSORIES: Record<Accessory, Layer | null> = {
  none: null,
  coffee: ACC_COFFEE,
  cookie: ACC_COOKIE,
  clipboard: ACC_CLIPBOARD,
  cable: ACC_CABLE,
  zzz: ACC_ZZZ,
}

/* ------------------------------------------------------------------ */
/* Rendering                                                          */
/* ------------------------------------------------------------------ */

export type Rect = { x: number; y: number; w: number; ch: string }

/**
 * Flatten layers into horizontal runs. Run-length encoding keeps the DOM to
 * roughly 60 <rect>s instead of ~400 individual squares, which matters when
 * several MOCHIs are on the page at once.
 */
export function layersToRects(layers: Array<Layer | null | undefined>): Rect[] {
  const grid: string[][] = Array.from({ length: ART_H }, () =>
    new Array<string>(ART_W).fill('.'),
  )

  for (const layer of layers) {
    if (!layer) continue
    for (const [rowKey, row] of Object.entries(layer)) {
      const y = Number(rowKey)
      for (let x = 0; x < ART_W; x++) {
        const ch = row[x]
        if (ch && ch !== '.') grid[y][x] = ch
      }
    }
  }

  const rects: Rect[] = []
  for (let y = 0; y < ART_H; y++) {
    let x = 0
    while (x < ART_W) {
      const ch = grid[y][x]
      if (ch === '.') {
        x++
        continue
      }
      let w = 1
      while (x + w < ART_W && grid[y][x + w] === ch) w++
      rects.push({ x, y, w, ch })
      x += w
    }
  }
  return rects
}

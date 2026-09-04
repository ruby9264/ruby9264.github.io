/**
 * §4.1 — the pixel cursor set.
 *
 * The spec asks for `cursor: url('/cursors/arrow.png')`. Rather than ship
 * binary PNGs that can't follow the theme, each cursor is drawn on a canvas
 * at runtime and exported as a data URL. Same result, but the art lives in
 * this file as readable pixels, it recolours when the theme flips, and there
 * are no extra network requests (§10).
 *
 * SVG cursors were the other option and are rejected: Safari's support for
 * `cursor: url(*.svg)` is unreliable, and a cursor that silently fails to
 * load leaves the visitor with an invisible pointer.
 */

/** O = outline, F = fill, W = highlight, '.' = transparent */
type Art = string[]

export const ARROW: Art = [
  'O...............',
  'OO..............',
  'OFO.............',
  'OFFO............',
  'OFFFO...........',
  'OFFFFO..........',
  'OFFFFFO.........',
  'OFFFFFFO........',
  'OFFFFFFFO.......',
  'OFFFFFFFFO......',
  'OFFFFFOOOO......',
  'OFFOFFO.........',
  'OFO.OFFO........',
  'OO...OFFO.......',
  '.....OFFO.......',
  '......OO........',
]

export const POINTER: Art = [
  '....OO..........',
  '...OFFO.........',
  '...OFFO.........',
  '...OFFO.........',
  '...OFFO.........',
  '...OFFOOO.......',
  '...OFFOFFOO.....',
  '...OFFOFFOFFO...',
  'OO.OFFFFFFFFFO..',
  'OFFOFFFFFFFFFO..',
  'OFFFFFFFFFFFFO..',
  '.OFFFFFFFFFFFO..',
  '..OFFFFFFFFFFO..',
  '...OFFFFFFFFO...',
  '....OFFFFFFFO...',
  '....OOOOOOOO....',
]

export const TEXT: Art = [
  '....OOOOO.......',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '......O.........',
  '....OOOOO.......',
  '................',
]

export const GRAB: Art = [
  '................',
  '................',
  '...OO.OO.OO.....',
  '..OFFOFFOFFO....',
  '..OFFOFFOFFO....',
  'OO.OFFFFFFFFO...',
  'OFFOFFFFFFFFO...',
  'OFFFFFFFFFFFO...',
  '.OFFFFFFFFFFO...',
  '..OFFFFFFFFFO...',
  '..OFFFFFFFFO....',
  '...OFFFFFFFO....',
  '....OOOOOOO.....',
  '................',
  '................',
  '................',
]

export const GRABBING: Art = [
  '................',
  '................',
  '................',
  '................',
  '...OOOOOO.......',
  '..OFFFFFFO......',
  '..OFFFFFFFO.....',
  '.OFFFFFFFFO.....',
  '.OFFFFFFFFO.....',
  '.OFFFFFFFFO.....',
  '..OFFFFFFO......',
  '...OOOOOO.......',
  '................',
  '................',
  '................',
  '................',
]

export const DISABLED: Art = [
  'O...............',
  'OO..............',
  'OFO.............',
  'OFFO............',
  'OFFFO...........',
  'OFFFFO..O....O..',
  'OFFFFFO..O..O...',
  'OFFFFFFO..OO....',
  'OFFFFFFFO.OO....',
  'OFFFFFFFFO..O...',
  'OFFFFFOOOO...O..',
  'OFFOFFO.........',
  'OFO.OFFO........',
  'OO...OFFO.......',
  '.....OFFO.......',
  '......OO........',
]

/** The hourglass body; the four frames are 90-degree rotations of it. */
export const HOURGLASS: Art = [
  '................',
  '................',
  '..OOOOOOOO......',
  '..OFFFFFFO......',
  '...OFFFFO.......',
  '....OFFO........',
  '.....OO.........',
  '.....OO.........',
  '....OFFO........',
  '...OFFFFO.......',
  '..OFFFFFFO......',
  '..OOOOOOOO......',
  '................',
  '................',
  '................',
  '................',
]

export type CursorColors = { outline: string; fill: string; highlight: string }

const SCALE = 2 // 16 art px -> a 32x32 image, as §4.1 specifies

/**
 * Draw one art map to a data URL. Every pixel is a filled rect on an
 * integer grid, so there is nothing to anti-alias.
 */
export function renderCursor(
  art: Art,
  colors: CursorColors,
  rotateQuarterTurns = 0,
): string | null {
  const size = 16 * SCALE
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.imageSmoothingEnabled = false

  if (rotateQuarterTurns % 4 !== 0) {
    // Exact right angles only, so the rotation stays pixel-lossless.
    ctx.translate(size / 2, size / 2)
    ctx.rotate((Math.PI / 2) * rotateQuarterTurns)
    ctx.translate(-size / 2, -size / 2)
  }

  const paint: Record<string, string> = {
    O: colors.outline,
    F: colors.fill,
    W: colors.highlight,
  }

  for (let y = 0; y < art.length; y++) {
    const row = art[y]
    for (let x = 0; x < row.length; x++) {
      const colour = paint[row[x]]
      if (!colour) continue
      ctx.fillStyle = colour
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
    }
  }

  try {
    return canvas.toDataURL('image/png')
  } catch {
    // Tainted or blocked canvas — the caller keeps the system cursor.
    return null
  }
}

/** Hotspot in image pixels, per cursor. */
export const HOTSPOTS = {
  default: [0, 0],
  pointer: [8, 0],
  text: [12, 14],
  grab: [12, 12],
  grabbing: [12, 12],
  disabled: [0, 0],
  loading: [12, 12],
} as const

/**
 * Generates the §11 image assets: the favicon set and the 1200x630 Open Graph
 * card. Run with `npm run assets`.
 *
 * Everything is drawn pixel by pixel and written as PNG here rather than
 * committed as binaries, so the art stays reviewable in a diff and the moss/
 * navy palette can never drift from tokens.css. No image libraries: PNG is a
 * handful of CRC'd chunks around a zlib stream, and Node ships zlib.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')

/* ---- palette, mirroring src/styles/tokens.css ---- */
const MOSS_500 = [0x6b, 0x8f, 0x4e, 255]
const MOSS_100 = [0xd6, 0xe4, 0xbf, 255]
const MOSS_300 = [0x9d, 0xbe, 0x72, 255]
const NAVY_900 = [0x0b, 0x15, 0x24, 255]
const NAVY_700 = [0x14, 0x23, 0x3a, 255]
const NAVY_300 = [0x4a, 0x6a, 0x9b, 255]
const NAVY_100 = [0xc3, 0xd0, 0xe4, 255]
const STAR = [0xf2, 0xf5, 0xec, 255]

/* ------------------------------------------------------------------ */
/* Minimal PNG writer                                                  */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(canvas) {
  const { width, height, data } = canvas

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // truecolour with alpha
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  // Filter type 0 on every scanline: no prediction, which keeps hard pixel
  // edges trivially reproducible.
  const raw = Buffer.alloc(height * (width * 4 + 1))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1)
    raw[rowStart] = 0
    data.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function createCanvas(width, height, fill = [0, 0, 0, 0]) {
  const data = Buffer.alloc(width * height * 4)
  const canvas = { width, height, data }
  rect(canvas, 0, 0, width, height, fill)
  return canvas
}

function rect(canvas, x, y, w, h, colour) {
  const { width, height, data } = canvas
  for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++) {
    for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
      const i = (yy * width + xx) * 4
      data[i] = colour[0]
      data[i + 1] = colour[1]
      data[i + 2] = colour[2]
      data[i + 3] = colour[3]
    }
  }
}

/** Draws a sparse pixel map: rows of characters, one char per art pixel. */
function stamp(canvas, map, originX, originY, scale, palette) {
  map.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      const colour = palette[ch]
      if (!colour) return
      rect(canvas, originX + x * scale, originY + y * scale, scale, scale, colour)
    })
  })
}

/* ---- 5x7 uppercase glyphs, only the letters the wordmark needs ---- */
const FONT = {
  R: ['####.', '#...#', '#...#', '####.', '#..#.', '#...#', '#...#'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
}

function text(canvas, string, x, y, scale, colour) {
  let cursor = x
  for (const ch of string.toUpperCase()) {
    const glyph = FONT[ch]
    if (glyph) stamp(canvas, glyph, cursor, y, scale, { '#': colour })
    cursor += 6 * scale
  }
  return cursor
}

/* ---- the R mark, used by every favicon ---- */
const R_GLYPH = FONT.R

function drawFavicon(size) {
  const canvas = createCanvas(size, size, MOSS_500)
  // The glyph is 5x7; scale it to fill most of the square on a whole-pixel
  // grid so it stays crisp at 16px.
  const scale = Math.max(1, Math.floor(size / 9))
  const w = 5 * scale
  const h = 7 * scale
  stamp(canvas, R_GLYPH, Math.round((size - w) / 2), Math.round((size - h) / 2), scale, {
    '#': NAVY_900,
  })
  return canvas
}

/* ---- MOCHI, trimmed to the shapes that read at card size ---- */
const MOCHI = [
  '.....FF........FF.......',
  '.....FFF......FFF.......',
  '......FFF....FFF........',
  '......FFF....FFF........',
  '.......FFF..FFF.........',
  '.......FFF..FFF.........',
  '........HHHHHHHH........',
  '......HHHHHHHHHHHH......',
  '.....HHHHHHHHHHHHHH.....',
  '.....HHVVVVVVVVVVHH.....',
  '.....HHVVKKVVKKVVHH.....',
  '.....HHVVKKVVKKVVHH.....',
  '.....HHVVVVVVVVVVHH.....',
  '.....HHVVVVVVVVVVHH.....',
  '.....HHVVVVVVVVVVHH.....',
  '.....HHHHHHHHHHHHHH.....',
  '......HHHHHHHHHHHH......',
  '.......HHHHHHHHHH.......',
  '.......SSSSSSSSSS.......',
  '......SSSSSSSSSSSS......',
  '......SSSPPPPPSSSS......',
  '......SSSPKKPPSSSS......',
  '......SSSPKPKPSSSS......',
  '......SSSPKKPPSSSS......',
  '......SSSPKPKPSSSS......',
  '......SSSPKPKPSSSS......',
  '......SSSPPPPPSSSS......',
  '......SSSSSSSSSSSS......',
  '......SSSSS..SSSSS......',
  '.....FFFFFF..FFFFFF.....',
  '.....FFFFFF..FFFFFF.....',
]

const MOCHI_PALETTE = {
  F: MOSS_100,
  H: NAVY_300,
  V: MOSS_500,
  K: NAVY_900,
  S: NAVY_700,
  P: MOSS_300,
}

function drawOgCard() {
  const W = 1200
  const H = 630
  const canvas = createCanvas(W, H, NAVY_900)

  // starfield — deterministic, so the card is reproducible byte for byte
  let seed = 20260904
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  for (let i = 0; i < 140; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * H)
    const s = rand() > 0.85 ? 6 : 3
    rect(canvas, x, y, s, s, rand() > 0.6 ? MOSS_300 : NAVY_300)
  }

  /* ---- left column: wordmark over MOCHI ---- */
  text(canvas, 'R // MOON', 80, 130, 10, STAR)
  text(canvas, 'STATION', 80, 230, 10, MOSS_300)
  rect(canvas, 80, 330, 340, 8, MOSS_500)

  stamp(canvas, MOCHI, 110, 380, 6, MOCHI_PALETTE)

  /* ---- right column: the station module ---- */
  const cx = 800
  const cy = 175

  // solar wings, on struts either side of the hull
  rect(canvas, cx - 40, cy + 130, 40, 14, MOSS_500)
  rect(canvas, cx + 260, cy + 130, 40, 14, MOSS_500)
  for (const wx of [cx - 130, cx + 300]) {
    rect(canvas, wx, cy + 55, 90, 170, MOSS_500)
    rect(canvas, wx + 8, cy + 63, 74, 154, NAVY_700)
    for (let i = 0; i < 4; i++) rect(canvas, wx + 8, cy + 63 + i * 40, 74, 6, MOSS_500)
  }

  // hull
  rect(canvas, cx, cy, 260, 280, MOSS_500)
  rect(canvas, cx + 10, cy + 10, 240, 260, NAVY_700)

  // window with the R
  rect(canvas, cx + 45, cy + 55, 170, 150, NAVY_100)
  rect(canvas, cx + 60, cy + 70, 140, 120, MOSS_500)
  text(canvas, 'R', cx + 105, cy + 92, 11, NAVY_900)

  // antenna
  rect(canvas, cx + 120, cy - 60, 16, 60, MOSS_500)
  rect(canvas, cx + 90, cy - 72, 76, 14, MOSS_500)

  // frame
  rect(canvas, 0, 0, W, 8, MOSS_500)
  rect(canvas, 0, H - 8, W, 8, MOSS_500)
  rect(canvas, 0, 0, 8, H, MOSS_500)
  rect(canvas, W - 8, 0, 8, H, MOSS_500)

  return canvas
}

/* ------------------------------------------------------------------ */

mkdirSync(OUT, { recursive: true })

const outputs = [
  ['favicon-16.png', drawFavicon(16)],
  ['favicon-32.png', drawFavicon(32)],
  ['apple-touch-icon.png', drawFavicon(180)],
  ['icon-512.png', drawFavicon(512)],
  ['og-image.png', drawOgCard()],
]

for (const [name, canvas] of outputs) {
  const png = encodePng(canvas)
  writeFileSync(resolve(OUT, name), png)
  console.log(`${name.padEnd(22)} ${canvas.width}x${canvas.height}  ${(png.length / 1024).toFixed(1)} KB`)
}

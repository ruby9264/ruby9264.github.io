import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { parseColor } from '@/lib/contrast'
import { useTheme } from '@/hooks/useTheme'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  CORE_CELL,
  FRAMES,
  FULL_BLOOM,
  INK_FOR,
  LOTUS_H,
  LOTUS_W,
  type Ink,
} from './lotusArt'

/**
 * LOTUS FIELD — tiny pixel lotuses scattered down the page gutters. Hovering
 * one opens it slowly; clicking one snaps it open, and at night the bloom
 * throws a handful of gold sparks.
 *
 * Four decisions worth knowing before changing anything here:
 *
 * 1. WHERE. The flowers are placed only in the margins either side of the
 *    1200px content column, never behind it. A dim cream pixel sitting under
 *    body copy costs real contrast, and §9's 4.5:1 is a ship blocker — so the
 *    field simply does not exist on viewports too narrow to have margins.
 *
 * 2. POINTER EVENTS. The layer paints *above* the content (z-index 800), not
 *    below it, because <main> spans the full width and would otherwise
 *    swallow every hover in the gutter. It is safe up there because the
 *    wrapper and the canvas are both `pointer-events: none` — only the small
 *    per-flower hit boxes are `auto`, and those sit in empty gutter space.
 *
 * 3. WORK DONE. Nothing animates at rest. The rAF loop starts when a flower
 *    is mid-bloom or a spark is alive and stops the moment neither is true,
 *    so an idle page pays for one canvas and zero frames. Each drawn frame is
 *    a handful of drawImage calls off a pre-rendered sheet rather than ~40
 *    fillRects per flower.
 *
 * 4. REDUCED MOTION. §4.3 stops the tweening, not the interaction: a step
 *    duration of 0 means the flower jumps straight to the target frame. It
 *    still opens, it still holds, it just never plays.
 */

/* ---- timing ---- */
const HOVER_STEP = 130 // ms per frame — hover is the long, unhurried bloom
const CLICK_STEP = 45 // ms per frame — a click snaps
const CLOSE_STEP = 110 // ms per frame, playing the frames backwards
const HOLD_MS = 1400 // a clicked flower stays open this long before closing
const SPARK_STEP = 70 // ms per sparkle step — a clock, not one step per frame
const SPARK_LIFE = 7 // sparkle steps before it winks out
const SPARK_COUNT = 9

/* ---- placement ---- */
const MIN_BAND = 46 // px of margin below which the field renders nothing
const BIG_BAND = 110 // px of margin above which the flowers draw at 3x
const EDGE_GAP = 8 // px kept clear at both ends of the margin
const ROW_HEIGHT = 130 // one flower per this much viewport height, per side
const TOP_INSET = 72 // clears the docked nav bar
const BOTTOM_INSET = 96 // clears the mobile dock and the floating bot

/** How far an idle bud is knocked back toward the page ground. Tuned by eye
    against the gutter: high enough that a bud reads as background rather than
    content, low enough that it is still visible enough to invite a hover. */
const DIM_MAX = 0.45

type Placed = {
  id: number
  /** CSS px, top-left of the sprite, relative to the viewport. */
  x: number
  y: number
}

type Lotus = Placed & {
  frame: number
  target: number
  /** ms per frame for the transition currently running; 0 means jump. */
  step: number
  /** timestamp of the next frame advance. */
  next: number
  /** while non-zero, a clicked flower is holding at full bloom until then. */
  hold: number
  /** ms of hold a click has bought but not yet started; see the loop. */
  holdFor: number
  hovered: boolean
  /** set by a click; spends itself into sparks when the bloom completes. */
  pendingSpark: boolean
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number }

/** Deterministic, so the field doesn't reshuffle on every render. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

/** Blend `from` toward `to` by t. Returns a flat colour — never an alpha. */
function mix(from: string, to: string, t: number): string {
  const a = parseColor(from)
  const b = parseColor(to)
  if (!a || !b) return from
  const c = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `rgb(${c(a.r, b.r)},${c(a.g, b.g)},${c(a.b, b.b)})`
}

/**
 * One canvas per frame, pre-inked and pre-dimmed. Buds are knocked back
 * toward --bg and recover their full colour as they open, so the bloom reads
 * as a light coming on — done by blending flat colours rather than with
 * globalAlpha, which would put a soft edge on a hard pixel (§2.1 rule 8).
 */
function buildSheets(cell: number, ink: Record<Ink, string>, ground: string) {
  return FRAMES.map((rows, f) => {
    const dim = DIM_MAX * (1 - f / FULL_BLOOM)
    const sheet = document.createElement('canvas')
    sheet.width = LOTUS_W * cell
    sheet.height = LOTUS_H * cell
    const ctx = sheet.getContext('2d')
    if (!ctx) return sheet

    const shade = {} as Record<Ink, string>
    for (const key of Object.keys(ink) as Ink[]) shade[key] = mix(ink[key], ground, dim)

    let current = ''
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y]
      for (let x = 0; x < row.length; x++) {
        const key = INK_FOR[row[x]]
        if (!key) continue
        if (shade[key] !== current) {
          current = shade[key]
          ctx.fillStyle = current
        }
        ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }
    return sheet
  })
}

export function LotusField() {
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)
  const lotusesRef = useRef<Lotus[]>([])
  const sparksRef = useRef<Spark[]>([])
  const sheetsRef = useRef<HTMLCanvasElement[]>([])
  const sparkInkRef = useRef('')
  const rafRef = useRef(0)
  const sparkNextRef = useRef(0)
  /** Device pixels per CSS pixel, floored — with image-rendering: pixelated a
      whole-number backing store is always crisp and a 1.5x one never is. */
  const dprRef = useRef(1)
  const scaleRef = useRef(2)

  /** The only state React sees. The animation itself lives in refs. */
  const [placed, setPlaced] = useState<Placed[]>([])

  const scale = scaleRef.current
  const spriteW = LOTUS_W * scale
  const spriteH = LOTUS_H * scale

  /* ---------------- paint ---------------- */

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const d = dprRef.current
    const cell = scaleRef.current * d
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sheets = sheetsRef.current
    if (sheets.length === 0) return

    for (const l of lotusesRef.current) {
      ctx.drawImage(sheets[l.frame], Math.round(l.x * d), Math.round(l.y * d))
    }

    const sparks = sparksRef.current
    if (sparks.length > 0) {
      ctx.fillStyle = sparkInkRef.current
      for (const s of sparks) {
        // Quantised onto the sprite's own pixel lattice, so a spark is the
        // same size and on the same grid as the petals it came off.
        const x = Math.round((s.x * d) / cell) * cell
        const y = Math.round((s.y * d) / cell) * cell
        ctx.fillRect(x, y, cell, cell)
      }
    }
  }, [])

  /* ---------------- the loop ---------------- */

  /** Night only — a pixelated brass burst off the seed head, seven steps. */
  const spawnSparks = useCallback((l: Lotus) => {
    // Start the clock with the burst, so the first step is a full step away
    // rather than however long is left of the previous burst's.
    sparkNextRef.current = performance.now() + SPARK_STEP
    const s = scaleRef.current
    const cx = l.x + CORE_CELL.x * s
    const cy = l.y + CORE_CELL.y * s
    const rand = seeded(l.id * 7717 + Math.round(cx))
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = (i / SPARK_COUNT) * Math.PI * 2 + rand()
      const speed = 1.6 + rand() * 2.2
      sparksRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 4 + Math.round(rand() * (SPARK_LIFE - 4)),
      })
    }
  }, [])

  const tick = useCallback(
    (now: number) => {
      rafRef.current = 0
      let busy = false
      let dirty = false

      for (const l of lotusesRef.current) {
        // A click's hold is counted from the moment the flower is OPEN, not
        // from the click. Measured from the click, a bloom slowed by a
        // throttled tab can still be opening when its own hold expires — the
        // flower then shuts halfway and the burst never fires.
        if (l.holdFor !== 0 && l.frame === FULL_BLOOM) {
          l.hold = now + l.holdFor
          l.holdFor = 0
          if (l.pendingSpark) {
            l.pendingSpark = false
            spawnSparks(l)
            dirty = true
          }
        }
        if (l.holdFor !== 0) busy = true

        if (l.hold !== 0 && now >= l.hold) {
          l.hold = 0
          // A flower still under the pointer when its hold expires stays open.
          l.target = l.hovered ? FULL_BLOOM : 0
          l.step = l.step === 0 ? 0 : CLOSE_STEP
        }
        if (l.hold !== 0) busy = true

        if (l.frame !== l.target) {
          busy = true
          if (l.step === 0) {
            l.frame = l.target
            dirty = true
          } else if (now >= l.next) {
            l.frame += l.target > l.frame ? 1 : -1
            l.next = now + l.step
            dirty = true
          }
        }
      }

      // The sparks move on their own clock. Advancing them once per animation
      // frame would make the burst twice as fast on a 120Hz display as on a
      // 60Hz one, and about eight times too fast to see at all.
      const sparks = sparksRef.current
      if (sparks.length > 0) {
        busy = true
        if (now >= sparkNextRef.current) {
          sparkNextRef.current = now + SPARK_STEP
          let alive = 0
          for (const s of sparks) {
            s.x += s.vx
            s.y += s.vy
            s.vy += 0.9 // they arc and fall back
            s.life -= 1
            if (s.life > 0) sparks[alive++] = s
          }
          sparks.length = alive
          dirty = true
        }
      }

      if (dirty) draw()
      if (busy) rafRef.current = requestAnimationFrame(tick)
    },
    [draw, spawnSparks],
  )

  const kick = useCallback(() => {
    if (rafRef.current === 0) rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  /* ---------------- layout ---------------- */

  const layout = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    // The clear margin either side of the text, measured the way the layout
    // actually builds it: the container box is min(vw, --container) centred in
    // the viewport, and the gutter is padding *inside* that box. So the empty
    // strip is the leftover viewport plus the gutter — not the gutter alone,
    // which is what an earlier version measured and why flowers landed on the
    // paragraph at 1024px.
    const styles = getComputedStyle(document.documentElement)
    const container = parseFloat(styles.getPropertyValue('--container')) || 1200
    const gutter =
      parseFloat(styles.getPropertyValue(vw >= 768 ? '--gutter-desk' : '--gutter-mobile')) || 20
    const band = (vw - Math.min(container, vw)) / 2 + gutter

    // No margins to plant in, no field. Phones and narrow laptops get nothing
    // rather than flowers laid over the text.
    if (band < MIN_BAND) {
      lotusesRef.current = []
      sparksRef.current = []
      setPlaced([])
      return
    }

    const s = band >= BIG_BAND ? 3 : 2
    scaleRef.current = s
    dprRef.current = Math.max(1, Math.floor(window.devicePixelRatio || 1))

    const w = LOTUS_W * s
    const h = LOTUS_H * s
    // Keep clear of the docked nav at the top and the dock/bot at the bottom:
    // those sit at z-index 900 and would eat the hover of any flower under
    // them, leaving a bud that looks live and isn't.
    const top = TOP_INSET
    const usable = Math.max(h, vh - TOP_INSET - BOTTOM_INSET)
    const perSide = Math.max(3, Math.min(7, Math.round(usable / ROW_HEIGHT)))
    const rowH = usable / perSide
    const rand = seeded(1301)
    const next: Lotus[] = []
    let id = 0

    for (const side of [0, 1]) {
      for (let i = 0; i < perSide; i++) {
        // Jittered inside its own row, so the column never reads as a list.
        const y = top + i * rowH + rowH * 0.2 + rand() * Math.max(0, rowH - h - rowH * 0.4)
        // EDGE_GAP at both ends, so a flower never touches the viewport
        // edge or crowds the first character of the paragraph beside it.
        const offset = EDGE_GAP + rand() * Math.max(0, band - w - EDGE_GAP * 2)
        const x = side === 0 ? offset : vw - band + offset
        next.push({
          id: id++,
          x: Math.round(x),
          y: Math.round(Math.min(y, vh - h - BOTTOM_INSET)),
          frame: 0,
          target: 0,
          step: HOVER_STEP,
          next: 0,
          hold: 0,
          holdFor: 0,
          hovered: false,
          pendingSpark: false,
        })
      }
    }

    lotusesRef.current = next
    sparksRef.current = []
    setPlaced(next.map(({ id: i, x, y }) => ({ id: i, x, y })))
  }, [])

  useEffect(() => {
    layout()
    let pending = 0
    const onResize = () => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        layout()
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (pending) cancelAnimationFrame(pending)
    }
  }, [layout])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  /* ---------------- backing store ----------------
     Sized in a layout effect so the canvas is never briefly the wrong size
     on screen. No token is read here — see the effect below for why. */

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || placed.length === 0) return

    const d = dprRef.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    canvas.width = vw * d
    canvas.height = vh * d
    canvas.style.width = `${vw}px`
    canvas.style.height = `${vh}px`
    // Resizing the backing store resets context state, so this belongs here
    // rather than anywhere it could be set once.
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.imageSmoothingEnabled = false
  }, [placed])

  /* ---------------- ink ----------------
     Re-cut after every re-placement and every theme flip: a resize can change
     the scale the sheets are drawn at, and a flip changes every colour in
     them.

     The tokens are read off `probeRef` — a hidden element in this component
     carrying its own [data-theme] — and never off <html>. SettingsProvider
     writes the attribute on <html> from an effect, and a child's effects
     always run before its parent's, so at this point <html> is still wearing
     the theme the page just left. Reading from an element whose attribute
     this component sets itself removes the ordering question entirely rather
     than papering over it with a frame's delay. */

  useEffect(() => {
    const probe = probeRef.current
    if (!probe || placed.length === 0) return
    const styles = getComputedStyle(probe)
    const token = (name: string) => styles.getPropertyValue(name).trim()
    sparkInkRef.current = token('--lotus-spark')
    sheetsRef.current = buildSheets(
      scaleRef.current * dprRef.current,
      {
        petal: token('--lotus-petal'),
        petalDeep: token('--lotus-petal-deep'),
        core: token('--lotus-core'),
        pad: token('--lotus-pad'),
        padDark: token('--lotus-pad-dark'),
      },
      token('--bg'),
    )
    draw()
  }, [placed, theme, draw])

  /* ---------------- interaction ---------------- */

  const find = (id: number) => lotusesRef.current.find((l) => l.id === id)
  /** §4.3 — a step of 0 makes the transition a jump instead of an animation. */
  const stepOf = (ms: number) => (reducedMotion ? 0 : ms)
  /**
   * True from the click until the hold runs out. A click outranks the
   * pointer: the flower finishes opening and serves its hold even if the
   * pointer has moved on. Leaving this out is not just a cosmetic bug — a
   * pointer leaving mid-bloom would send the flower back to a closed frame
   * it can now never leave, `holdFor` would stay armed waiting for a full
   * bloom that never arrives, and the loop would spin forever on a flower
   * that has stopped moving.
   */
  const claimed = (l: Lotus) => l.hold !== 0 || l.holdFor !== 0

  const onEnter = (id: number) => {
    const l = find(id)
    if (!l) return
    l.hovered = true
    if (claimed(l)) return
    l.target = FULL_BLOOM
    l.step = stepOf(HOVER_STEP)
    l.next = 0
    kick()
  }

  const onLeave = (id: number) => {
    const l = find(id)
    if (!l) return
    l.hovered = false
    if (claimed(l)) return
    l.target = 0
    l.step = stepOf(CLOSE_STEP)
    l.next = 0
    kick()
  }

  const onPress = (id: number) => {
    const l = find(id)
    if (!l) return
    l.target = FULL_BLOOM
    l.step = stepOf(CLICK_STEP)
    // Claimed here, started by the loop once the flower is actually open —
    // which is also what fires the burst, so clicking a flower the pointer
    // had already opened still sparks.
    l.holdFor = HOLD_MS
    // Night blooms throw sparks. Day does not, and neither does a page that
    // asked for less motion.
    l.pendingSpark = theme === 'dark' && !reducedMotion
    l.next = 0
    kick()
  }

  if (placed.length === 0) return null

  return (
    <div className="lotus-field" aria-hidden="true">
      {/* The palette probe. It renders nothing; it exists so the sprite ink
          can be read from an element that is definitively wearing the current
          theme. See the ink effect above. */}
      <div ref={probeRef} data-theme={theme} hidden />
      <canvas ref={canvasRef} className="lotus-field__canvas" />
      {placed.map((p) => (
        <div
          key={p.id}
          className="lotus-field__hit"
          style={{
            left: p.x - scale * 2,
            top: p.y - scale * 2,
            width: spriteW + scale * 4,
            height: spriteH + scale * 4,
          }}
          onPointerEnter={() => onEnter(p.id)}
          onPointerLeave={() => onLeave(p.id)}
          onPointerDown={() => onPress(p.id)}
        />
      ))}
    </div>
  )
}

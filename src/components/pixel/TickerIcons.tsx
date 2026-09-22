import type { SVGProps } from 'react'
import type { TickerIconName } from '@/data/ticker'

/**
 * §S02 — one 16px glyph per ticker item.
 *
 * Same construction as SkillIcons and PixelGlyph: whole rects on the 16-unit
 * grid, `currentColor`, crispEdges, outlines only so nothing has to know its
 * own background. Sixteen items, sixteen marks — unlike §S04's inventory the
 * list is short enough that each one can be its own thing, and a repeated
 * glyph two rows apart would read as a mistake.
 *
 * Every mark is distinct at 16px: no two share a silhouette, which is the
 * only thing that matters at this size. That is why "curious" is a question
 * mark rather than a second magnifier, and why the magnifier belongs to
 * "analysing things".
 */

type P = SVGProps<SVGSVGElement>

function base(props: P) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 16 16',
    width: 16,
    height: 16,
    fill: 'currentColor',
    shapeRendering: 'crispEdges' as const,
    focusable: false,
    'aria-hidden': true,
    ...props,
  }
}

/* ---------------- interests ---------------- */

/** Pencil, drawn corner to corner. */
const Design = (p: P) => (
  <svg {...base(p)}>
    <rect x="10" y="1" width="4" height="2" />
    <rect x="8" y="3" width="4" height="2" />
    <rect x="6" y="5" width="4" height="2" />
    <rect x="4" y="7" width="4" height="2" />
    <rect x="2" y="9" width="4" height="2" />
    <rect x="2" y="11" width="3" height="2" />
    <rect x="1" y="13" width="3" height="2" />
  </svg>
)

/** Three rising bars on a baseline. */
const Data = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="8" width="4" height="5" />
    <rect x="6" y="5" width="4" height="8" />
    <rect x="11" y="2" width="4" height="11" />
    <rect x="0" y="13" width="16" height="2" />
  </svg>
)

/** A chip: square die, eight legs. */
const Tech = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="10" height="2" />
    <rect x="3" y="11" width="10" height="2" />
    <rect x="3" y="3" width="2" height="10" />
    <rect x="11" y="3" width="2" height="10" />
    <rect x="6" y="6" width="4" height="4" />
    <rect x="0" y="5" width="3" height="2" />
    <rect x="0" y="9" width="3" height="2" />
    <rect x="13" y="5" width="3" height="2" />
    <rect x="13" y="9" width="3" height="2" />
    <rect x="5" y="0" width="2" height="3" />
    <rect x="9" y="0" width="2" height="3" />
    <rect x="5" y="13" width="2" height="3" />
    <rect x="9" y="13" width="2" height="3" />
  </svg>
)

/** Briefcase. */
const Business = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="1" width="4" height="2" />
    <rect x="5" y="2" width="2" height="2" />
    <rect x="9" y="2" width="2" height="2" />
    <rect x="1" y="4" width="14" height="2" />
    <rect x="1" y="12" width="14" height="2" />
    <rect x="1" y="4" width="2" height="10" />
    <rect x="13" y="4" width="2" height="10" />
    <rect x="7" y="8" width="2" height="2" />
  </svg>
)

/** Globe: meridian and equator across a stepped circle. */
const Languages = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="1" width="6" height="2" />
    <rect x="3" y="3" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="1" y="5" width="2" height="6" />
    <rect x="13" y="5" width="2" height="6" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="5" y="13" width="6" height="2" />
    <rect x="7" y="3" width="2" height="10" />
    <rect x="2" y="7" width="12" height="2" />
  </svg>
)

/* ---------------- naturally ---------------- */

/** Question mark. */
const Curious = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="1" width="8" height="2" />
    <rect x="3" y="3" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="10" y="5" width="3" height="2" />
    <rect x="7" y="7" width="4" height="2" />
    <rect x="7" y="9" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />
  </svg>
)

/** A node splitting into two — taking a thing apart. */
const Analytical = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="0" width="4" height="4" />
    <rect x="7" y="4" width="2" height="3" />
    <rect x="2" y="7" width="12" height="2" />
    <rect x="2" y="9" width="2" height="2" />
    <rect x="12" y="9" width="2" height="2" />
    <rect x="1" y="11" width="4" height="4" />
    <rect x="11" y="11" width="4" height="4" />
  </svg>
)

/** A rabbit, looking up. MOCHI's cousin. */
const Rabbit = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="0" width="2" height="6" />
    <rect x="10" y="0" width="2" height="6" />
    <rect x="3" y="6" width="10" height="2" />
    <rect x="3" y="8" width="2" height="5" />
    <rect x="11" y="8" width="2" height="5" />
    <rect x="3" y="13" width="10" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
  </svg>
)

/* ---------------- hobbies ---------------- */

/** A wide anime eye. */
const Anime = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="2" width="8" height="2" />
    <rect x="2" y="4" width="2" height="2" />
    <rect x="12" y="4" width="2" height="2" />
    <rect x="0" y="6" width="2" height="4" />
    <rect x="14" y="6" width="2" height="4" />
    <rect x="2" y="10" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="4" y="12" width="8" height="2" />
    <rect x="6" y="5" width="4" height="6" />
  </svg>
)

/** Speech balloon with a tail. */
const Manga = (p: P) => (
  <svg {...base(p)}>
    <rect x="2" y="1" width="12" height="2" />
    <rect x="2" y="9" width="12" height="2" />
    <rect x="2" y="1" width="2" height="8" />
    <rect x="12" y="1" width="2" height="8" />
    <rect x="5" y="11" width="2" height="2" />
    <rect x="4" y="13" width="2" height="2" />
  </svg>
)

/** Gamepad: d-pad left, two buttons right. */
const Gaming = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="4" width="14" height="2" />
    <rect x="1" y="10" width="14" height="2" />
    <rect x="1" y="4" width="2" height="8" />
    <rect x="13" y="4" width="2" height="8" />
    <rect x="4" y="7" width="2" height="2" />
    <rect x="3" y="6" width="4" height="1" />
    <rect x="3" y="9" width="4" height="1" />
    <rect x="9" y="6" width="2" height="2" />
    <rect x="11" y="8" width="2" height="2" />
  </svg>
)

/** Open book. */
const Reading = (p: P) => (
  <svg {...base(p)}>
    <rect x="7" y="3" width="2" height="11" />
    <rect x="1" y="3" width="6" height="2" />
    <rect x="1" y="3" width="2" height="11" />
    <rect x="1" y="12" width="6" height="2" />
    <rect x="9" y="3" width="6" height="2" />
    <rect x="13" y="3" width="2" height="11" />
    <rect x="9" y="12" width="6" height="2" />
  </svg>
)

/** Film strip: two frames between sprocket rails. */
const Films = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="1" width="8" height="2" />
    <rect x="4" y="13" width="8" height="2" />
    <rect x="4" y="1" width="2" height="14" />
    <rect x="10" y="1" width="2" height="14" />
    <rect x="4" y="7" width="8" height="2" />
    <rect x="1" y="2" width="2" height="2" />
    <rect x="1" y="7" width="2" height="2" />
    <rect x="1" y="12" width="2" height="2" />
    <rect x="13" y="2" width="2" height="2" />
    <rect x="13" y="7" width="2" height="2" />
    <rect x="13" y="12" width="2" height="2" />
  </svg>
)

/* ---------------- often ---------------- */

/** Magnifying glass. */
const Analysing = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="1" width="6" height="2" />
    <rect x="2" y="3" width="2" height="6" />
    <rect x="10" y="3" width="2" height="6" />
    <rect x="4" y="9" width="6" height="2" />
    <rect x="9" y="11" width="2" height="2" />
    <rect x="11" y="13" width="3" height="2" />
  </svg>
)

/** Mortarboard with a tassel. */
const Learning = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="1" width="4" height="2" />
    <rect x="3" y="3" width="10" height="2" />
    <rect x="0" y="5" width="16" height="2" />
    <rect x="3" y="7" width="10" height="4" />
    <rect x="13" y="7" width="2" height="5" />
    <rect x="12" y="12" width="4" height="2" />
  </svg>
)

/** Conical flask, part filled. */
const Experimenting = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="0" width="6" height="2" />
    <rect x="6" y="2" width="2" height="4" />
    <rect x="8" y="2" width="2" height="4" />
    <rect x="4" y="6" width="2" height="2" />
    <rect x="10" y="6" width="2" height="2" />
    <rect x="2" y="8" width="2" height="4" />
    <rect x="12" y="8" width="2" height="4" />
    <rect x="2" y="12" width="12" height="2" />
    <rect x="5" y="10" width="6" height="2" />
  </svg>
)

const ICONS: Record<TickerIconName, (p: P) => JSX.Element> = {
  design: Design,
  data: Data,
  tech: Tech,
  business: Business,
  languages: Languages,
  curious: Curious,
  analytical: Analytical,
  rabbit: Rabbit,
  anime: Anime,
  manga: Manga,
  gaming: Gaming,
  reading: Reading,
  films: Films,
  analysing: Analysing,
  learning: Learning,
  experimenting: Experimenting,
}

export function TickerIcon({ name, ...props }: P & { name: TickerIconName }) {
  const Glyph = ICONS[name]
  return <Glyph {...props} />
}

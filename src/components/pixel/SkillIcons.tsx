import type { SVGProps } from 'react'
import type { SkillIconName } from '@/data/skills'

/**
 * §S04 asks for a 16px pixel icon per inventory slot. Twelve glyphs cover the
 * twenty-nine skills, shared by kind — twenty-nine bespoke 16px marks would
 * be visual noise at this size, and the label carries the meaning anyway.
 * Outlines only, so nothing needs to know its background colour.
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

const Pen = (p: P) => (
  <svg {...base(p)}>
    <rect x="10" y="1" width="4" height="2" />
    <rect x="9" y="3" width="4" height="2" />
    <rect x="7" y="5" width="4" height="2" />
    <rect x="5" y="7" width="4" height="2" />
    <rect x="3" y="9" width="4" height="2" />
    <rect x="2" y="11" width="3" height="2" />
    <rect x="1" y="13" width="3" height="2" />
  </svg>
)

const Frame = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="2" width="14" height="2" />
    <rect x="1" y="12" width="14" height="2" />
    <rect x="1" y="2" width="2" height="12" />
    <rect x="13" y="2" width="2" height="12" />
    <rect x="4" y="6" width="8" height="2" />
  </svg>
)

const Flow = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="1" width="5" height="4" />
    <rect x="10" y="6" width="5" height="4" />
    <rect x="1" y="11" width="5" height="4" />
    <rect x="6" y="2" width="2" height="2" />
    <rect x="8" y="4" width="2" height="4" />
    <rect x="8" y="8" width="2" height="4" />
    <rect x="6" y="12" width="2" height="2" />
  </svg>
)

const Grid = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
)

const Code = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="2" height="2" />
    <rect x="2" y="6" width="2" height="2" />
    <rect x="0" y="8" width="2" height="2" />
    <rect x="2" y="10" width="2" height="2" />
    <rect x="4" y="12" width="2" height="2" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="12" y="6" width="2" height="2" />
    <rect x="14" y="8" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="10" y="12" width="2" height="2" />
  </svg>
)

const Terminal = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="2" width="14" height="2" />
    <rect x="1" y="12" width="14" height="2" />
    <rect x="1" y="2" width="2" height="12" />
    <rect x="13" y="2" width="2" height="12" />
    <rect x="4" y="6" width="2" height="2" />
    <rect x="6" y="8" width="2" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="9" y="10" width="4" height="2" />
  </svg>
)

const Database = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="1" width="10" height="2" />
    <rect x="1" y="3" width="14" height="2" />
    <rect x="3" y="5" width="10" height="2" />
    <rect x="1" y="7" width="2" height="6" />
    <rect x="13" y="7" width="2" height="6" />
    <rect x="1" y="8" width="14" height="1" />
    <rect x="3" y="13" width="10" height="2" />
  </svg>
)

const Search = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="1" width="6" height="2" />
    <rect x="2" y="3" width="2" height="6" />
    <rect x="10" y="3" width="2" height="6" />
    <rect x="4" y="9" width="6" height="2" />
    <rect x="10" y="11" width="2" height="2" />
    <rect x="12" y="13" width="3" height="2" />
  </svg>
)

const Chart = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="1" width="2" height="14" />
    <rect x="1" y="13" width="14" height="2" />
    <rect x="5" y="8" width="2" height="5" />
    <rect x="8" y="5" width="2" height="8" />
    <rect x="11" y="2" width="2" height="11" />
  </svg>
)

const Doc = (p: P) => (
  <svg {...base(p)}>
    <rect x="2" y="1" width="10" height="2" />
    <rect x="2" y="1" width="2" height="14" />
    <rect x="12" y="3" width="2" height="12" />
    <rect x="10" y="1" width="2" height="2" />
    <rect x="2" y="13" width="12" height="2" />
    <rect x="5" y="5" width="6" height="2" />
    <rect x="5" y="8" width="6" height="2" />
  </svg>
)

const People = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="2" width="4" height="4" />
    <rect x="9" y="3" width="4" height="3" />
    <rect x="1" y="8" width="8" height="2" />
    <rect x="1" y="10" width="2" height="4" />
    <rect x="7" y="10" width="2" height="4" />
    <rect x="10" y="8" width="5" height="2" />
    <rect x="13" y="10" width="2" height="4" />
  </svg>
)

const Box = (p: P) => (
  <svg {...base(p)}>
    <rect x="1" y="3" width="14" height="2" />
    <rect x="1" y="3" width="2" height="10" />
    <rect x="13" y="3" width="2" height="10" />
    <rect x="1" y="11" width="14" height="2" />
    <rect x="6" y="5" width="4" height="2" />
  </svg>
)

export const SKILL_ICONS: Record<SkillIconName, (p: P) => JSX.Element> = {
  pen: Pen,
  frame: Frame,
  flow: Flow,
  grid: Grid,
  code: Code,
  terminal: Terminal,
  database: Database,
  search: Search,
  chart: Chart,
  doc: Doc,
  people: People,
  box: Box,
}

/** §S07 — the certification medal. */
export function GlyphMedal(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="0" width="2" height="5" />
      <rect x="10" y="0" width="2" height="5" />
      <rect x="5" y="5" width="6" height="2" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="3" y="9" width="2" height="4" />
      <rect x="11" y="9" width="2" height="4" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="6" y="9" width="4" height="4" />
    </svg>
  )
}

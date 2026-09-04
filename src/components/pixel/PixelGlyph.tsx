import type { SVGProps } from 'react'

/**
 * Pixel glyphs. Every shape is built from whole 2-unit squares on an
 * integer grid and rendered with shape-rendering="crispEdges", so nothing
 * ever anti-aliases into a soft edge (§2.1).
 *
 * They inherit `currentColor`, which keeps them themeable for free.
 */

type GlyphProps = SVGProps<SVGSVGElement>

function base(props: GlyphProps) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'currentColor',
    shapeRendering: 'crispEdges' as const,
    focusable: false,
    'aria-hidden': true,
    ...props,
  }
}

/** Validation tick — used by the filled-valid field state (§S10). */
export function GlyphCheck(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base(props)}>
      <rect x="2" y="8" width="2" height="2" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="6" y="12" width="2" height="2" />
      <rect x="8" y="10" width="2" height="2" />
      <rect x="10" y="8" width="2" height="2" />
      <rect x="12" y="6" width="2" height="2" />
      <rect x="14" y="4" width="2" height="2" />
    </svg>
  )
}

/** Warning bang — used by the error field state and inline messages. */
export function GlyphWarn(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base(props)}>
      <rect x="6" y="0" width="4" height="2" />
      <rect x="4" y="2" width="8" height="2" />
      <rect x="4" y="4" width="8" height="2" />
      <rect x="2" y="6" width="12" height="2" />
      <rect x="2" y="8" width="12" height="2" />
      <rect x="0" y="10" width="16" height="4" />
      {/* Knocked-out bang. The caller sets --glyph-knockout to whatever
          surface the glyph sits on, so the cutout never shows the wrong bg. */}
      <rect x="7" y="4" width="2" height="4" fill="var(--glyph-knockout, var(--bg-raised))" />
      <rect x="7" y="10" width="2" height="2" fill="var(--glyph-knockout, var(--bg-raised))" />
    </svg>
  )
}

/** Downward caret — replaces the OS select arrow. */
export function GlyphCaretDown(props: GlyphProps) {
  return (
    <svg viewBox="0 0 12 6" width="12" height="6" {...base(props)}>
      <rect x="0" y="0" width="12" height="2" />
      <rect x="2" y="2" width="8" height="2" />
      <rect x="4" y="4" width="4" height="2" />
    </svg>
  )
}

/** Downward chevron — the S01 scroll hint and generic "more" affordances. */
export function GlyphChevronDown(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" {...base(props)}>
      <rect x="0" y="2" width="2" height="2" />
      <rect x="2" y="4" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
      <rect x="6" y="8" width="4" height="2" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="12" y="4" width="2" height="2" />
      <rect x="14" y="2" width="2" height="2" />
    </svg>
  )
}

/** Four-pointed pixel star — the ticker separator and ambient starfield. */
export function GlyphStar(props: GlyphProps) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" {...base(props)}>
      <rect x="5" y="0" width="2" height="12" />
      <rect x="0" y="5" width="12" height="2" />
      <rect x="3" y="3" width="6" height="6" />
    </svg>
  )
}

/** Day. Used by the theme switch and by the S00 airlock's left door. */
export function GlyphSun(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base(props)}>
      <rect x="5" y="5" width="6" height="6" />
      <rect x="7" y="1" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
    </svg>
  )
}

/** Night. A waxing crescent, stepped on the 2px grid. */
export function GlyphMoon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base(props)}>
      <rect x="6" y="1" width="6" height="2" />
      <rect x="4" y="3" width="6" height="2" />
      <rect x="3" y="5" width="5" height="2" />
      <rect x="3" y="7" width="4" height="2" />
      <rect x="3" y="9" width="5" height="2" />
      <rect x="4" y="11" width="6" height="2" />
      <rect x="6" y="13" width="6" height="2" />
    </svg>
  )
}

/** External link — a box with an arrow leaving it. Marks tags that open Figma. */
export function GlyphExternal(props: GlyphProps) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" {...base(props)}>
      {/* the box, open at the top right */}
      <rect x="0" y="4" width="2" height="8" />
      <rect x="0" y="10" width="10" height="2" />
      <rect x="8" y="7" width="2" height="5" />
      <rect x="0" y="4" width="4" height="2" />
      {/* the arrow leaving it */}
      <rect x="4" y="6" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="6" y="2" width="6" height="2" />
      <rect x="10" y="2" width="2" height="5" />
    </svg>
  )
}

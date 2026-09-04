/**
 * WCAG 2.1 relative-luminance + contrast-ratio maths.
 * Used by the /styleguide contrast table so §9's colour criteria are
 * verified against the *computed* tokens, not against numbers typed
 * into the spec by hand.
 */

export type Rgb = { r: number; g: number; b: number }

/** Accepts #rgb, #rrggbb, rgb(), rgba(). Returns null if unparseable. */
export function parseColor(input: string): Rgb | null {
  const value = input.trim()

  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }

  const rgb = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i)
  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) }
  }

  return null
}

function channel(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number | null {
  const ca = parseColor(a)
  const cb = parseColor(b)
  if (!ca || !cb) return null
  const la = luminance(ca)
  const lb = luminance(cb)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** Resolve a CSS custom property to its computed colour on an element. */
export function resolveToken(token: string, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(token).trim()
}

export type ContrastNeed = 'body' | 'large' | 'ui'

/** §9: body text 4.5:1, large text 3:1, UI borders + focus rings 3:1. */
export const THRESHOLDS: Record<ContrastNeed, number> = {
  body: 4.5,
  large: 3,
  ui: 3,
}

export function grade(ratio: number, need: ContrastNeed): 'AAA' | 'AA' | 'FAIL' {
  if (need === 'body') {
    if (ratio >= 7) return 'AAA'
    return ratio >= 4.5 ? 'AA' : 'FAIL'
  }
  if (ratio >= 4.5) return 'AAA'
  return ratio >= 3 ? 'AA' : 'FAIL'
}

import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

export type DitherDensity = 25 | 50 | 75

type DitherFillProps = HTMLAttributes<HTMLDivElement> & {
  density?: DitherDensity
  /** Tint the pattern with something other than --line. */
  ink?: string
}

/**
 * §2.5 — the dither replaces every gradient on this site. Depth comes from
 * pattern density and flat colour steps, never from a blur or a fade.
 * Always decorative, so always aria-hidden.
 */
export function DitherFill({ density = 50, ink, className, style, ...rest }: DitherFillProps) {
  return (
    <div
      aria-hidden="true"
      className={cx('dither', ink && 'dither-ink', `dither-${density}`, className)}
      style={ink ? ({ ...style, ['--dither-ink' as string]: ink } as typeof style) : style}
      {...rest}
    />
  )
}

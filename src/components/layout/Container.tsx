import type { ElementType, HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Drop the max-width cap for full-bleed bands (S02 ticker, S11 footer). */
  bleed?: boolean
}

/**
 * §2.4 — 1200px cap, 20px gutter on mobile, 48px from md up.
 */
export function Container({
  as: Tag = 'div',
  bleed = false,
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cx(
        'w-full px-[var(--gutter-mobile)] md:px-[var(--gutter-desk)]',
        !bleed && 'mx-auto max-w-container',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

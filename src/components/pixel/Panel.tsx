import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { WindowChrome } from './WindowChrome'

export type PanelVariant = 'default' | 'window' | 'sunken' | 'flush'

type PanelProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  as?: ElementType
  variant?: PanelVariant
  /** Required for `variant="window"` — renders in the title bar. */
  title?: string
  /** Corner notches (§2.6). On by default; off for nested/flush panels. */
  notched?: boolean
  children: ReactNode
}

/**
 * §2.6 — every card, modal and container on this site is a variant of
 * this one primitive. If you find yourself writing a fresh box with a
 * border and a shadow, use this instead.
 */
export function Panel({
  as: Tag = 'div',
  variant = 'default',
  title,
  notched,
  className,
  children,
  ...rest
}: PanelProps) {
  const isWindow = variant === 'window'
  const showNotches = notched ?? (variant === 'default' || isWindow)

  return (
    <Tag
      className={cx(
        'panel',
        isWindow && 'panel--window',
        variant === 'sunken' && 'panel--sunken',
        variant === 'flush' && 'panel--flush',
        showNotches && 'panel--notched',
        className,
      )}
      {...rest}
    >
      {isWindow && title ? <WindowChrome title={title} /> : null}
      {isWindow ? <div className="panel__body">{children}</div> : children}
    </Tag>
  )
}

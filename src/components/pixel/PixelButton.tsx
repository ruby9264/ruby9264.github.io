import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type ButtonTone = 'brand' | 'accent' | 'secondary'

type CommonProps = {
  tone?: ButtonTone
  /** §7 loading state: 4-frame spinner + aria-busy. */
  loading?: boolean
  /**
   * §13 — "an action keeps its name through the whole flow".
   * Shown beside the spinner so the button never goes anonymous.
   */
  loadingLabel?: string
  /** Leading pixel glyph. Decorative — label still carries the meaning. */
  icon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined }

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string }

export type PixelButtonProps = ButtonProps | LinkProps

function classes(tone: ButtonTone, fullWidth: boolean, className?: string) {
  return cx(
    'pxbtn',
    tone === 'accent' && 'pxbtn--accent',
    tone === 'secondary' && 'pxbtn--secondary',
    fullWidth && 'w-full',
    className,
  )
}

function Body({
  loading,
  loadingLabel,
  icon,
  children,
}: Pick<CommonProps, 'loading' | 'loadingLabel' | 'icon' | 'children'>) {
  if (loading) {
    return (
      <>
        <span className="pxloader" aria-hidden="true" />
        <span>{loadingLabel}</span>
      </>
    )
  }
  return (
    <>
      {icon ? (
        <span aria-hidden="true" className="flex items-center">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  )
}

/**
 * §7 states: default, hover, focus-visible, active, disabled, loading.
 * All six live in `.pxbtn` in pixel.css — this component only decides
 * which of them is currently true.
 */
export function PixelButton(props: PixelButtonProps) {
  const {
    tone = 'brand',
    loading = false,
    loadingLabel = 'loading…',
    icon,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props as CommonProps & { className?: string; href?: string } & Record<string, unknown>

  const body = (
    <Body loading={loading} loadingLabel={loadingLabel} icon={icon}>
      {children}
    </Body>
  )

  if (typeof (props as LinkProps).href === 'string') {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
    }
    const disabled = (props as LinkProps)['aria-disabled'] === true

    return (
      <a
        // A disabled link is not a link. Drop the href so it leaves the
        // tab order's "activatable" contract rather than navigating.
        href={disabled ? undefined : href}
        role={disabled ? 'link' : undefined}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        className={classes(tone, fullWidth, className)}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          if (disabled || loading) e.preventDefault()
          ;(anchorRest.onClick as ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(e)
        }}
        {...anchorRest}
      >
        {body}
      </a>
    )
  }

  const { onClick, type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      type={type ?? 'button'}
      aria-busy={loading || undefined}
      className={classes(tone, fullWidth, className)}
      onClick={(e) => {
        // Loading is not `disabled`: the button keeps its focus so a
        // keyboard user is not thrown back to the top of the form.
        if (loading) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
      {...buttonRest}
    >
      {body}
    </button>
  )
}

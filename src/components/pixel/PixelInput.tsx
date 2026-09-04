import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell, FieldStatusGlyph, describedBy, type FieldState } from './Field'

export type PixelInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  /** `error` wins over this — an invalid field is never also "valid". */
  state?: FieldState
  id?: string
}

/**
 * §7 states: default, hover, focus-visible, disabled, loading, error.
 * (Plus the filled-valid treatment from the S10 form table.)
 */
export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(function PixelInput(
  {
  label,
  hint,
  error,
  hideLabel,
  state = 'default',
  id: idProp,
  className,
  disabled,
  required,
  ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId

  const resolved: FieldState = error
    ? 'error'
    : disabled
      ? 'disabled'
      : state

  const loading = resolved === 'loading'

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      required={required}
    >
      <div className="pxfield-wrap">
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          readOnly={loading || rest.readOnly}
          aria-invalid={resolved === 'error' || undefined}
          aria-describedby={describedBy(id, hint, error)}
          aria-busy={loading || undefined}
          data-state={resolved}
          className={cx(
            'pxfield',
            (resolved === 'valid' || resolved === 'error' || loading) && 'pr-12',
            className,
          )}
          {...rest}
        />
        <FieldStatusGlyph state={resolved} />
      </div>
    </FieldShell>
  )
})

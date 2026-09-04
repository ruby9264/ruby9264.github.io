import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell, describedBy, type FieldState } from './Field'

export type PixelTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  state?: FieldState
  id?: string
  /** Live character counter (S10 requires one on `message`). */
  showCounter?: boolean
  /**
   * Character count for the counter when the textarea is uncontrolled.
   * react-hook-form registers it uncontrolled, so passing `value` here would
   * fight the library; the count comes in separately instead.
   */
  valueLength?: number
}

export const PixelTextarea = forwardRef<HTMLTextAreaElement, PixelTextareaProps>(
  function PixelTextarea(
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
  showCounter = false,
  valueLength,
  maxLength,
  value,
  ...rest
    },
    ref,
  ) {
  const autoId = useId()
  const id = idProp ?? autoId

  const resolved: FieldState = error ? 'error' : disabled ? 'disabled' : state
  const loading = resolved === 'loading'
  const length = valueLength ?? (typeof value === 'string' ? value.length : 0)

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      required={required}
      counter={
        showCounter && maxLength ? (
          <>
            <span aria-hidden="true">
              {length}/{maxLength}
            </span>
            {/* Announced only on demand — a per-keystroke live region is noise. */}
            <span className="sr-only">
              {length} of {maxLength} characters used
            </span>
          </>
        ) : undefined
      }
    >
      <textarea
        ref={ref}
        id={id}
        disabled={disabled}
        required={required}
        readOnly={loading || rest.readOnly}
        maxLength={maxLength}
        value={value}
        aria-invalid={resolved === 'error' || undefined}
        aria-describedby={describedBy(id, hint, error)}
        aria-busy={loading || undefined}
        data-state={resolved}
        className={cx('pxfield pxfield--textarea', className)}
        {...rest}
      />
    </FieldShell>
  )
  })

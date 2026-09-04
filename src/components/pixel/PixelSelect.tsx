import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { FieldShell, describedBy, type FieldState } from './Field'
import { GlyphCaretDown } from './PixelGlyph'

export type SelectOption = { value: string; label: string }

export type PixelSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  options: SelectOption[]
  /** Shown as the first, unselected option. */
  placeholder?: string
  hint?: string
  error?: string
  hideLabel?: boolean
  state?: FieldState
  id?: string
}

export const PixelSelect = forwardRef<HTMLSelectElement, PixelSelectProps>(function PixelSelect(
  {
  label,
  options,
  placeholder,
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
  const resolved: FieldState = error ? 'error' : disabled ? 'disabled' : state

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      required={required}
    >
      <div className="pxselect">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={resolved === 'error' || undefined}
          aria-describedby={describedBy(id, hint, error)}
          data-state={resolved}
          className={cx('pxfield pxfield--select', className)}
          {...rest}
        >
          {placeholder ? (
            <option value="">{placeholder}</option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <GlyphCaretDown className="pxselect__caret" />
      </div>
    </FieldShell>
  )
})

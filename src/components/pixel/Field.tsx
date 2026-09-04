import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { GlyphCheck, GlyphWarn } from './PixelGlyph'

export type FieldState = 'default' | 'valid' | 'error' | 'disabled' | 'loading'

export type FieldShellProps = {
  id: string
  label: string
  hint?: string
  error?: string
  /** Hide the label visually but keep it for assistive tech (§9). */
  hideLabel?: boolean
  required?: boolean
  children: ReactNode
  /** Rendered under the control, right-aligned — e.g. the S10 char counter. */
  counter?: ReactNode
}

export const hintId = (id: string) => `${id}-hint`
export const errorId = (id: string) => `${id}-error`

/**
 * Label + control + hint + error, wired together.
 *
 * §9: every input gets a real <label> — a placeholder is not a label.
 * Errors are linked with aria-describedby and announced via role="alert".
 */
export function FieldShell({
  id,
  label,
  hint,
  error,
  hideLabel = false,
  required = false,
  counter,
  children,
}: FieldShellProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className={cx('pxlabel', hideLabel && 'sr-only')}>
        {label}
        {required ? (
          <>
            {' '}
            <span aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>

      {children}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {error ? (
            <p id={errorId(id)} className="pxerror" role="alert">
              <GlyphWarn className="mt-1 flex-none" />
              <span>{error}</span>
            </p>
          ) : hint ? (
            <p id={hintId(id)} className="pxhint">
              {hint}
            </p>
          ) : null}
        </div>
        {counter ? <p className="pxhint flex-none tabular-nums">{counter}</p> : null}
      </div>
    </div>
  )
}

/** The trailing status glyph inside a field: tick when valid, bang when invalid. */
export function FieldStatusGlyph({ state }: { state: FieldState }) {
  if (state === 'valid') {
    return (
      <span className="pxfield-glyph text-[color:var(--brand)]">
        <GlyphCheck />
      </span>
    )
  }
  if (state === 'error') {
    return (
      <span
        className="pxfield-glyph text-[color:var(--error)]"
        style={{ ['--glyph-knockout' as string]: 'var(--bg-sunken)' }}
      >
        <GlyphWarn />
      </span>
    )
  }
  if (state === 'loading') {
    return (
      <span className="pxfield-glyph text-[color:var(--ink-mute)]">
        <span className="pxloader" />
      </span>
    )
  }
  return null
}

/** Shared aria-describedby resolution for all three field types. */
export function describedBy(id: string, hint?: string, error?: string) {
  if (error) return errorId(id)
  if (hint) return hintId(id)
  return undefined
}

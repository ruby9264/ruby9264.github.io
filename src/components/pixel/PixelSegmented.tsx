import { useId, useRef } from 'react'
import { cx } from '@/lib/cx'

export type SegmentOption<T extends string> = { value: T; label: string }

type PixelSegmentedProps<T extends string> = {
  label: string
  value: T
  options: SegmentOption<T>[]
  onChange: (next: T) => void
  hint?: string
}

/**
 * A radiogroup for settings with more than two positions — the motion row
 * needs three (§4.5 offers two, but the OS preference is a third input).
 *
 * Roving tabindex with arrow-key movement, per the radiogroup pattern: one
 * stop in the tab order, arrows move within.
 */
export function PixelSegmented<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: PixelSegmentedProps<T>) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  const move = (delta: number) => {
    const next = (index + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div className="py-3">
      <span id={labelId} className="hud block text-[color:var(--ink)]">
        {label}
      </span>
      {hint ? (
        <span id={hintId} className="pxhint mb-3 block">
          {hint}
        </span>
      ) : null}

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
        className="mt-3 flex flex-wrap gap-2"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault()
            move(1)
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault()
            move(-1)
          }
        }}
      >
        {options.map((option, i) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cx(
                'min-h-[44px] border-2 border-[color:var(--line)] px-4 py-2',
                'font-ui text-label font-semibold uppercase tracking-[0.08em]',
                'transition-[box-shadow,transform] duration-100 ease-steps-4',
                selected
                  ? 'bg-[color:var(--brand)] text-[color:var(--on-brand)] shadow-[0_0_0_var(--shadow)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-[color:var(--bg-raised)] text-[color:var(--ink)] shadow-[2px_2px_0_var(--shadow)]',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

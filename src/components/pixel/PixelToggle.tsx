import { useId } from 'react'
import { cx } from '@/lib/cx'

type PixelToggleProps = {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
  /** Words for the two positions, e.g. ['Off', 'On'] or ['Day', 'Night']. */
  options: [string, string]
  hint?: string
  disabled?: boolean
}

/**
 * A two-position lever for the §4.5 settings rows.
 *
 * §9 forbids conveying state by colour alone, so the current position is
 * spelled out in words beside the lever — the lever is the affordance, the
 * text is the state.
 */
export function PixelToggle({
  label,
  checked,
  onChange,
  options,
  hint,
  disabled = false,
}: PixelToggleProps) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`

  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <span className="min-w-0">
        <span id={labelId} className="hud block text-[color:var(--ink)]">
          {label}
        </span>
        {hint ? (
          <span id={hintId} className="pxhint block">
            {hint}
          </span>
        ) : null}
      </span>

      <span className="flex flex-none items-center gap-3">
        <span
          className="font-ui text-small tabular-nums text-[color:var(--ink-soft)]"
          aria-hidden="true"
        >
          {checked ? options[1] : options[0]}
        </span>

        {/* §9 — the hit area is 44px tall even though the track is 32px, so
            the button carries the height and an inner span draws the track. */}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cx(
            'flex h-[44px] w-[64px] flex-none items-center justify-center',
            disabled && 'cursor-not-allowed',
          )}
        >
          <span
            aria-hidden="true"
            className={cx(
              'flex h-[32px] w-[64px] items-center p-1',
              'border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]',
              'shadow-[inset_2px_2px_0_var(--shadow)]',
            )}
          >
            {/* Announced state comes from aria-checked; this is just the lever. */}
            <span
              className={cx(
                'block h-[20px] w-[26px] border-2 border-[color:var(--line)]',
                'shadow-[2px_2px_0_var(--shadow)] transition-transform duration-150 ease-steps-4',
                disabled ? 'bg-[color:var(--ink-mute)]' : 'bg-[color:var(--brand)]',
                checked ? 'translate-x-[26px]' : 'translate-x-0',
              )}
            />
          </span>
        </button>
      </span>
    </div>
  )
}

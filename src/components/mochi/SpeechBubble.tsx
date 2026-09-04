import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type SpeechBubbleProps = {
  children: ReactNode
  /**
   * §3.2: ambient chatter must never be announced or screen-reader users get
   * spammed. Only the form-success and form-error bubbles are live.
   */
  live?: boolean
  className?: string
  id?: string
}

/**
 * MOCHI's speech bubble. A pixel panel with a stepped tail pointing down-right
 * toward the bot — drawn with two stacked squares rather than a CSS triangle,
 * because a border-triangle would anti-alias its diagonal (§2.1).
 */
export function SpeechBubble({ children, live = false, className, id }: SpeechBubbleProps) {
  return (
    <div
      id={id}
      role={live ? 'status' : undefined}
      aria-live={live ? 'polite' : undefined}
      aria-hidden={live ? undefined : true}
      className={cx(
        'relative border-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
        'px-3 py-2 shadow-[4px_4px_0_var(--shadow)]',
        // §13 says MOCHI speaks in lowercase, but that is a rule for how the
        // copy is *written*, not a transform to apply to it — forcing it here
        // turns "EcoFootPrint" into "ecofootprint".
        'font-ui text-small text-[color:var(--ink)]',
        className,
      )}
    >
      {children}

      {/* Stepped tail, bottom-right. */}
      <span
        aria-hidden="true"
        className="absolute -bottom-2 right-4 block h-2 w-4 border-x-2 border-b-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-1 right-4 block h-1 w-4 bg-[color:var(--bg-raised)]"
      />
    </div>
  )
}

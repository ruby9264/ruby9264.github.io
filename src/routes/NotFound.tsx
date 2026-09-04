import { Container } from '@/components/layout/Container'
import { PixelButton } from '@/components/pixel/PixelButton'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { NOT_FOUND } from '@/data/profile'

/**
 * S12 — a broken link is a real exit point, so it keeps the nav, footer,
 * theme and the cursor. §3.1 puts MOCHI here floating away untethered with a
 * snapped cable, which is also why this route hides the floating bot: one
 * MOCHI adrift reads as a joke, two reads as a bug.
 */
export function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="hud text-[color:var(--ink-mute)]">Signal lost</p>

          <p
            className="mt-6 font-display text-display font-bold tracking-[0.08em]"
            aria-hidden="true"
          >
            {NOT_FOUND.code}
          </p>
          <h1 className="sr-only">404 — page not found</h1>

          <p className="mt-6 max-w-measure text-lead text-[color:var(--ink-soft)]">
            {NOT_FOUND.message}
          </p>

          <div className="mt-12">
            <PixelButton href="/" tone="accent">
              {NOT_FOUND.cta}
            </PixelButton>
          </div>
        </div>

        <MochiSprite
          ears="droop"
          eyes="wide"
          arms="hold"
          accessory="cable"
          size={144}
          className="mochi-drift justify-self-center md:justify-self-end"
        />
      </div>
    </Container>
  )
}

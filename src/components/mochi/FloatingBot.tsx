import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { MochiSprite, type MochiPose } from './MochiSprite'
import { SpeechBubble } from './SpeechBubble'
import { useMochiMood } from './mochiMood'
import { useIdle } from '@/hooks/useIdle'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { useSectionInView } from '@/hooks/useSectionInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { useSettings } from '@/hooks/useSettings'
import { scrollToId } from '@/hooks/useLenis'
import { PROFILE } from '@/data/profile'
import { IconDoc } from '@/components/pixel/NavIcons'
import { GlyphSpeaker, GlyphSpeakerMuted } from '@/components/pixel/PixelGlyph'
import { CV_AVAILABLE } from '@/data/site'

/** §3.2 state machine. Order in this union is not priority — see resolve(). */
type BotState =
  | 'idle'
  | 'hover'
  | 'active'
  | 'scroll-fast'
  | 'idle-long'
  | 'section-work'
  | 'section-contact'
  | 'form-success'
  | 'form-error'

/** §3.2 bubble copy. MOCHI speaks lowercase, max six words (§13). */
const BUBBLE: Partial<Record<BotState, string>> = {
  hover: 'need a hand?',
  'scroll-fast': 'whoa, slow down!',
  'section-work': 'my favourite one is EcoFootPrint',
  'section-contact': "kettle's on",
  'form-success': 'message launched!',
  'form-error': 'hmm, check the fields?',
}

const POSE: Record<BotState, MochiPose> = {
  idle: { ears: 'normal', eyes: 'open', arms: 'rest' },
  hover: { ears: 'perked', eyes: 'open', arms: 'wave' },
  active: { ears: 'perked', eyes: 'open', arms: 'rest' },
  'scroll-fast': { ears: 'back', eyes: 'squint', arms: 'rest' },
  'idle-long': { ears: 'droop', eyes: 'closed', arms: 'rest', accessory: 'zzz' },
  'section-work': { ears: 'normal', eyes: 'open', arms: 'hold', accessory: 'clipboard' },
  'section-contact': { ears: 'normal', eyes: 'open', arms: 'hold', accessory: 'coffee' },
  'form-success': { ears: 'perked', eyes: 'wide', arms: 'wave' },
  'form-error': { ears: 'droop', eyes: 'closed', arms: 'rest' },
}

const SECTION_IDS = ['work', 'contact']

export function FloatingBot() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const [waveFrame, setWaveFrame] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const bubbleId = useId()

  const mood = useMochiMood()
  const idleLong = useIdle(45000)
  const scrollFast = useScrollVelocity(1200)
  const sectionInView = useSectionInView(SECTION_IDS)
  const reducedMotion = useReducedMotion()
  const { theme, toggleTheme } = useTheme()
  const { sound, setSound } = useSettings()

  /* ---- resolve the current state, highest priority first (§3.2) ---- */
  const state: BotState =
    mood === 'form-success'
      ? 'form-success'
      : mood === 'form-error'
        ? 'form-error'
        : open
          ? 'active'
          : scrollFast && !reducedMotion
            ? 'scroll-fast'
            : hovered
              ? 'hover'
              : idleLong && !reducedMotion
                ? 'idle-long'
                : sectionInView === 'contact'
                  ? 'section-contact'
                  : sectionInView === 'work'
                    ? 'section-work'
                    : 'idle'

  const isFormState = state === 'form-success' || state === 'form-error'

  /* ---- blink every 4-7s, randomised (§3.2) ---- */
  useEffect(() => {
    if (reducedMotion || state !== 'idle') {
      setBlinking(false)
      return
    }
    let blinkTimer: number
    const schedule = () => {
      const wait = 4000 + Math.random() * 3000
      blinkTimer = window.setTimeout(() => {
        setBlinking(true)
        window.setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 140)
      }, wait)
    }
    schedule()
    return () => window.clearTimeout(blinkTimer)
  }, [reducedMotion, state])

  /* ---- two-frame wave, stepped (§2.1 rule 7) ---- */
  useEffect(() => {
    if (reducedMotion || (state !== 'hover' && state !== 'form-success')) {
      setWaveFrame(false)
      return
    }
    const id = window.setInterval(() => setWaveFrame((f) => !f), 250)
    return () => window.clearInterval(id)
  }, [reducedMotion, state])

  /* ---- §3.2 edge case: a mobile keyboard would cover the send button ---- */
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')

    const onFocusIn = (e: FocusEvent) => {
      if (window.innerWidth < 768 && isField(e.target)) setKeyboardOpen(true)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (isField(e.target)) setKeyboardOpen(false)
    }

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  /* ---- menu keyboard handling: arrows within, Esc closes (§3.2) ---- */
  useEffect(() => {
    if (!open) return

    const close = () => {
      setOpen(false)
      triggerRef.current?.focus()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        return
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Tab') return

      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ??
          [],
      )
      if (items.length === 0) return

      if (e.key === 'Tab') {
        // Keep Tab inside the menu; Esc is the way out.
        e.preventDefault()
        const dir = e.shiftKey ? -1 : 1
        const i = items.indexOf(document.activeElement as HTMLElement)
        items[(i + dir + items.length) % items.length]?.focus()
        return
      }

      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const i = items.indexOf(document.activeElement as HTMLElement)
      items[(i + dir + items.length) % items.length]?.focus()
    }

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open])

  if (keyboardOpen) return null

  const pose = { ...POSE[state] }
  if (blinking) pose.eyes = 'closed'
  if (waveFrame && pose.arms === 'wave') pose.arms = 'waveAlt'

  const bubbleText = BUBBLE[state]

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <div
      className={cx(
        'fixed right-4 z-[900] flex flex-col items-end gap-2',
        // Clear of the mobile dock (§4.4) so it never covers a nav slot.
        'bottom-[calc(72px+env(safe-area-inset-bottom))] md:bottom-6',
      )}
    >
      {/*
        Quick nav. §3.2 caps this at five items and there are now six: the
        music starts on its own, so the way to stop it has to be somewhere a
        visitor already is, and MOCHI is where they reach first. Sitting it
        beside the theme item is consistent — this menu already carries a
        setting rather than pure navigation.
      */}
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          id={menuId}
          aria-label="Quick navigation"
          className={cx(
            'border-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]',
            'shadow-[4px_4px_0_var(--shadow)]',
            // §3.2 mobile: opens upward, full width minus 32px
            'w-[calc(100vw-32px)] md:w-[220px]',
          )}
        >
          <MenuItem onSelect={() => go('work')}>Work</MenuItem>
          <MenuItem onSelect={() => go('skills')}>Skills</MenuItem>
          {CV_AVAILABLE ? (
            <MenuItem href={PROFILE.cv}>
              <IconDoc className="flex-none" />
              CV (PDF)
            </MenuItem>
          ) : (
            <MenuItem disabled>
              <IconDoc className="flex-none" />
              CV — coming soon
            </MenuItem>
          )}
          <MenuItem onSelect={() => go('contact')}>Contact</MenuItem>
          <MenuItem
            onSelect={() => {
              toggleTheme()
              setOpen(false)
              triggerRef.current?.focus()
            }}
          >
            {theme === 'dark' ? 'Day theme' : 'Night theme'}
          </MenuItem>
          {/* Stays open, unlike the others: the label flipping is the only
              confirmation that the tap landed, and on a phone the music has
              already faded before a closed menu could tell you anything. */}
          <MenuItem onSelect={() => setSound(!sound)}>
            {sound ? <GlyphSpeakerMuted className="flex-none" /> : <GlyphSpeaker className="flex-none" />}
            {sound ? 'Mute music' : 'Play music'}
          </MenuItem>
        </div>
      ) : null}

      {/* Ambient bubbles are aria-hidden; only the form ones are announced. */}
      {bubbleText && !open ? (
        <SpeechBubble id={bubbleId} live={isFormState} className="max-w-[200px]">
          {bubbleText}
        </SpeechBubble>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Open quick navigation"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cx(
          'flex items-center justify-center border-2 border-[color:var(--line)]',
          'bg-[color:var(--bg-raised)] shadow-[4px_4px_0_var(--shadow)]',
          'h-[56px] w-[56px] md:h-[80px] md:w-[80px]',
          // Breathing loop — stepped, and stopped by the reduced-motion contract.
          !reducedMotion && 'mochi-breathe',
        )}
      >
        <MochiSprite {...pose} size={40} className="md:hidden" />
        <MochiSprite {...pose} size={56} className="hidden md:block" />
      </button>
    </div>
  )
}

function MenuItem({
  children,
  onSelect,
  href,
  disabled = false,
}: {
  children: React.ReactNode
  onSelect?: () => void
  href?: string
  disabled?: boolean
}) {
  const className = cx(
    'flex min-h-[44px] w-full items-center gap-3 px-4 py-2 text-left',
    'font-ui text-label font-semibold uppercase tracking-[0.08em] no-underline',
    'border-b-2 border-[color:var(--line)] last:border-b-0',
    disabled
      ? 'cursor-not-allowed text-[color:var(--ink-mute)]'
      : 'text-[color:var(--ink)] hover:bg-[color:var(--brand)] hover:text-[color:var(--on-brand)]',
  )

  if (href && !disabled) {
    return (
      <a role="menuitem" href={href} download className={className}>
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onSelect}
      className={className}
    >
      {children}
    </button>
  )
}

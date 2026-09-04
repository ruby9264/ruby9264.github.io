import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { Panel } from '@/components/pixel/Panel'
import { PixelToggle } from '@/components/pixel/PixelToggle'
import { PixelSegmented } from '@/components/pixel/PixelSegmented'
import { IconGear } from '@/components/pixel/NavIcons'
import { useSettings, type MotionSetting } from '@/hooks/useSettings'

const MOTION_OPTIONS: { value: MotionSetting; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
]

/**
 * §4.5 — the settings popover. Four controls, all persisted.
 *
 * Esc closes and returns focus to the gear, focus is held inside while open,
 * and a click outside dismisses. The menu is one of the things this site is
 * meant to prove, so its own keyboard behaviour has to be exemplary.
 */
export function SettingsMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const {
    theme,
    toggleTheme,
    cursor,
    setCursor,
    sound,
    setSound,
    motion,
    setMotion,
    reducedMotion,
  } = useSettings()

  // Close on Esc, and hold focus inside the panel while it's open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"])')?.focus()
  }, [open])

  return (
    <div className={cx('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label="Settings"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          'flex h-[44px] w-[44px] flex-none items-center justify-center',
          'border-2 border-[color:var(--line)]',
          'transition-[box-shadow,transform] duration-100 ease-steps-4',
          open
            ? 'translate-x-[2px] translate-y-[2px] bg-[color:var(--brand)] text-[color:var(--on-brand)] shadow-[0_0_0_var(--shadow)]'
            : 'bg-[color:var(--bg-raised)] text-[color:var(--ink)] shadow-[2px_2px_0_var(--shadow)] hover:shadow-[4px_4px_0_var(--shadow)] hover:-translate-x-[1px] hover:-translate-y-[1px]',
        )}
      >
        <IconGear />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Settings"
          className="absolute right-0 top-[calc(100%+12px)] z-[950] w-[min(320px,calc(100vw-40px))]"
        >
          <Panel variant="window" title="settings">
            <PixelToggle
              label="Theme"
              options={['Day', 'Night']}
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />

            <hr className="border-0 border-t-2 border-[color:var(--line)]" />

            <PixelToggle
              label="Custom cursor"
              options={['Off', 'On']}
              checked={cursor}
              onChange={setCursor}
              hint="Turn off to use your system pointer."
            />

            <hr className="border-0 border-t-2 border-[color:var(--line)]" />

            <PixelSegmented
              label="Motion"
              value={motion}
              options={MOTION_OPTIONS}
              onChange={setMotion}
              hint={
                motion === 'system'
                  ? `Following your device — currently ${reducedMotion ? 'reduced' : 'full'}.`
                  : undefined
              }
            />

            <hr className="border-0 border-t-2 border-[color:var(--line)]" />

            <PixelToggle
              label="Sound"
              options={['Off', 'On']}
              checked={sound}
              onChange={setSound}
              hint="Nothing plays sound yet. Audio never starts on its own."
            />
          </Panel>
        </div>
      ) : null}
    </div>
  )
}

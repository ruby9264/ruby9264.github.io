import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { PixelButton } from '@/components/pixel/PixelButton'
import { PixelInput } from '@/components/pixel/PixelInput'
import { PixelTextarea } from '@/components/pixel/PixelTextarea'
import { PixelSelect } from '@/components/pixel/PixelSelect'
import { BreakRoomScene } from './BreakRoomScene'
import { CONTACT, ERRORS, FIELDS, SUBJECT_OPTIONS } from '@/data/contact'
import { PROFILE, emailAddress, emailObfuscated } from '@/data/profile'
import { CV_AVAILABLE } from '@/data/site'
import { setMochiMood } from '@/components/mochi/mochiMood'
import { IconContact, IconDoc, IconGitHub, IconLinkedIn, IconPin } from '@/components/pixel/NavIcons'

type FormValues = {
  name: string
  email: string
  subject: string
  message: string
}

/** One shape for every direct-contact row, so the icons line up. */
const contactLink =
  'inline-flex min-h-[44px] items-center gap-3 text-[color:var(--ink-soft)] no-underline'

/**
 * §S10's validation table, expressed with react-hook-form's own rules.
 *
 * §5 lists zod alongside react-hook-form, but for four fields it added ~20KB
 * gzipped and expressed nothing these rules don't. Dropped deliberately —
 * see docs/PHASE-7-NOTES.md.
 *
 * `setValueAs` trims first, so a field of pure whitespace is empty rather
 * than "filled".
 */
const trim = { setValueAs: (v: unknown) => (typeof v === 'string' ? v.trim() : v) }

const RULES = {
  name: {
    ...trim,
    required: ERRORS.nameEmpty,
    minLength: { value: 2, message: ERRORS.nameLength },
    maxLength: { value: 60, message: ERRORS.nameLength },
  },
  email: {
    ...trim,
    required: ERRORS.emailEmpty,
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: ERRORS.emailInvalid },
  },
  message: {
    ...trim,
    required: ERRORS.messageShort,
    minLength: { value: 10, message: ERRORS.messageShort },
    maxLength: { value: 1500, message: ERRORS.messageLong },
  },
} as const

type Status = 'idle' | 'submitting' | 'success' | 'failed'

/**
 * §S10 — The Break Room.
 *
 * No backend (docs/SCOPE.md): the form validates entirely in the browser and
 * hands the finished message to the visitor's own mail client. Nothing is
 * posted anywhere, which is also why there is no honeypot and no
 * time-to-submit check — there is no endpoint to spam.
 */
export function S10Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const message = watch('message') ?? ''

  // §S10: on submit failure, move focus to the first invalid field.
  const onInvalid = () => {
    setMochiMood('form-error')
    const first = (['name', 'email', 'message'] as const).find((f) => errors[f])
    if (first) setFocus(first)
  }

  const onValid = (values: FormValues) => {
    setStatus('submitting')
    try {
      const body = [
        values.message,
        '',
        `— ${values.name}`,
        values.subject ? `About: ${values.subject}` : '',
        `Reply to: ${values.email}`,
      ]
        .filter(Boolean)
        .join('\n')

      const href =
        `mailto:${emailAddress()}` +
        `?subject=${encodeURIComponent(values.subject || 'Hello from your portfolio')}` +
        `&body=${encodeURIComponent(body)}`

      window.location.href = href
      setStatus('success')
      setMochiMood('form-success')
    } catch {
      setStatus('failed')
      setMochiMood('form-error')
    }
  }

  /** A field is "filled-valid" once touched, non-empty and error-free (§S10). */
  const stateOf = (field: keyof FormValues, value: string) => {
    if (errors[field]) return 'error' as const
    if ((touchedFields[field] || isSubmitted) && value.trim()) return 'valid' as const
    return 'default' as const
  }

  const busy = status === 'submitting'

  return (
    <Section id="contact" title={CONTACT.heading}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* ---- left: the room ---- */}
        <div>
          <BreakRoomScene />
          {CONTACT.intro.map((paragraph, i) => (
            <p key={i} className="mt-6 max-w-measure text-lead text-[color:var(--ink-soft)]">
              {paragraph}
            </p>
          ))}

          <ul className="mt-12 flex flex-col gap-2">
            <li>
              <EmailLink />
            </li>
            <li>
              <a
                href={PROFILE.linkedin}
                rel="me noopener noreferrer"
                target="_blank"
                className={contactLink}
              >
                <IconLinkedIn className="flex-none text-[color:var(--brand)]" />
                <span className="underline">LinkedIn</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={PROFILE.github}
                rel="me noopener noreferrer"
                target="_blank"
                className={contactLink}
              >
                <IconGitHub className="flex-none text-[color:var(--brand)]" />
                <span className="underline">GitHub</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {CV_AVAILABLE ? (
              <li>
                <a href={PROFILE.cv} download className={contactLink}>
                  <IconDoc className="flex-none text-[color:var(--brand)]" />
                  <span className="underline">CV (PDF)</span>
                </a>
              </li>
            ) : null}
            <li className="flex min-h-[44px] items-center gap-3 text-[color:var(--ink-soft)]">
              <IconPin className="flex-none text-[color:var(--brand)]" />
              {PROFILE.location}
            </li>
            {/* §12: the phone number stays on the CV. Publishing a personal
                mobile invites spam and worse. */}
          </ul>
        </div>

        {/* ---- right: the form ---- */}
        <div>
          <Panel variant="window" title={CONTACT.formTitle}>
            {status === 'success' ? (
              <SuccessPanel
                onAgain={() => {
                  reset()
                  setStatus('idle')
                  setMochiMood('none')
                }}
              />
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit(onValid, onInvalid)}
                className="flex flex-col gap-6"
              >
                {/* §S10: the error summary is role="alert". */}
                {status === 'failed' ? (
                  <p role="alert" className="pxerror">
                    {ERRORS.networkFail}
                  </p>
                ) : null}

                <PixelInput
                  label={FIELDS.name.label}
                  placeholder={FIELDS.name.placeholder}
                  autoComplete="name"
                  required
                  disabled={busy}
                  error={errors.name?.message}
                  state={stateOf('name', watch('name') ?? '')}
                  {...register('name', RULES.name)}
                />

                <PixelInput
                  label={FIELDS.email.label}
                  placeholder={FIELDS.email.placeholder}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  disabled={busy}
                  error={errors.email?.message}
                  state={stateOf('email', watch('email') ?? '')}
                  {...register('email', RULES.email)}
                />

                <PixelSelect
                  label={FIELDS.subject.label}
                  options={SUBJECT_OPTIONS}
                  placeholder="—"
                  disabled={busy}
                  {...register('subject')}
                />

                <PixelTextarea
                  label={FIELDS.message.label}
                  placeholder={FIELDS.message.placeholder}
                  maxLength={FIELDS.message.max}
                  showCounter
                  required
                  disabled={busy}
                  error={errors.message?.message}
                  valueLength={message.length}
                  state={stateOf('message', message)}
                  {...register('message', RULES.message)}
                />

                <div>
                  <PixelButton
                    type="submit"
                    tone="accent"
                    loading={busy}
                    loadingLabel={CONTACT.submitting}
                    fullWidth
                  >
                    {status === 'failed' ? CONTACT.retry : CONTACT.submit}
                  </PixelButton>
                </div>
              </form>
            )}
          </Panel>
        </div>
      </div>
    </Section>
  )
}

function SuccessPanel({ onAgain }: { onAgain: () => void }) {
  // Announced once, when it appears.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div ref={ref} tabIndex={-1} role="status" aria-live="polite">
      <h3 className="font-display text-h3">{CONTACT.success.title}</h3>
      <p className="mt-4 max-w-measure text-lead text-[color:var(--ink-soft)]">
        {CONTACT.success.body}
      </p>
      <div className="mt-8">
        <PixelButton tone="secondary" onClick={onAgain}>
          {CONTACT.success.again}
        </PixelButton>
      </div>
    </div>
  )
}

/** §S10: never render a harvestable mailto — assemble it at click time. */
function EmailLink() {
  return (
    <a
      href="#email"
      onClick={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${emailAddress()}`
      }}
      className={contactLink}
    >
      {/* Decorative: the link text already says what this is. */}
      <IconContact className="flex-none text-[color:var(--brand)]" />
      <span aria-hidden="true" className="underline">
        {emailObfuscated()}
      </span>
      <span className="sr-only">Email Ruby</span>
    </a>
  )
}

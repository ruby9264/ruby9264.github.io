import { useEffect, useRef } from 'react'
import { Panel } from '@/components/pixel/Panel'
import { PixelButton } from '@/components/pixel/PixelButton'
import { ProjectTags } from './ProjectTags'
import { CASE_STUDY_SECTIONS, type Project } from '@/data/projects'
import { getLenis } from '@/hooks/useLenis'

type CaseStudyModalProps = {
  project: Project
  onClose: () => void
}

/**
 * §S06 — the case study overlay. Focus trapped while open, Esc closes,
 * focus returns to the trigger card, the background is inert, and the body
 * scroll is locked without shifting the layout.
 */
export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.getElementById('root')
    const body = document.body

    // §8: compensate for the scrollbar so locking scroll doesn't shift layout.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    // Lenis keeps its own scroll loop running, so it has to be told too.
    const lenis = getLenis()
    lenis?.stop()

    // Everything behind the dialog is inert while it's open.
    const main = document.getElementById('main')
    const footer = document.querySelector('footer')
    const header = document.querySelector('header')
    const inerted = [main, footer, header].filter(Boolean) as HTMLElement[]
    inerted.forEach((el) => {
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    })

    // Focus the first control in the dialog rather than holding a ref to a
    // specific button — the trap below already enumerates the same set.
    panelRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return
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

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      lenis?.start()
      inerted.forEach((el) => {
        el.removeAttribute('inert')
        el.removeAttribute('aria-hidden')
      })
      void root
    }
  }, [onClose])

  const written = CASE_STUDY_SECTIONS.filter(({ key }) => project.caseStudy?.[key])

  return (
    <div
      /* sda-none: the overlay is position:fixed but lives inside #main, so the
         scroll-driven reveals would otherwise attach a view() timeline to its
         panel. Nothing good comes of a modal whose opacity depends on where
         the page happens to be scrolled. */
      className="sda-none fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-[color:var(--bg)] p-4 md:p-12"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="w-full max-w-container"
      >
        <Panel variant="window" title={`${project.title}.case`}>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 id="case-study-title" className="font-display text-h2">
                {project.title}
              </h2>
              <p className="mt-2 font-ui text-h3 font-bold text-[color:var(--ink-soft)]">
                {project.subtitle}
              </p>
              <p className="mt-2 text-small text-[color:var(--ink-mute)]">{project.context}</p>
            </div>

            <PixelButton tone="secondary" onClick={onClose} className="flex-none">
              Close
            </PixelButton>
          </div>

          <ProjectTags tags={project.tags} size="overlay" className="mt-6" />

          <div className="mt-12">
            <h3 className="font-ui text-h3 font-bold">Overview</h3>
            <p className="mt-3 max-w-measure text-lead text-[color:var(--ink-soft)]">
              {project.overview}
            </p>
          </div>

          {/* §S06 lists five headings for this overlay but supplies no copy
              for them. Rather than invent Ruby's account of her own work, each
              section appears only once it has been written. */}
          {written.map(({ key, heading }) => (
            <div key={key} className="mt-12">
              <h3 className="font-ui text-h3 font-bold">{heading}</h3>
              <p className="mt-3 max-w-measure text-lead text-[color:var(--ink-soft)]">
                {project.caseStudy?.[key]}
              </p>
            </div>
          ))}

          <div className="mt-12 border-t-2 border-[color:var(--line)] pt-8">
            <PixelButton tone="brand" onClick={onClose}>
              Back to work
            </PixelButton>
          </div>
        </Panel>
      </div>
    </div>
  )
}

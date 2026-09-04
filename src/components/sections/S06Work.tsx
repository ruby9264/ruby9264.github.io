import { forwardRef, useCallback, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { CaseStudyModal } from './CaseStudyModal'
import { ProjectTags } from './ProjectTags'
import { OPEN_CASE_STUDY, PROJECTS, WORK_HEADING, type Project } from '@/data/projects'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scrollToId } from '@/hooks/useLenis'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Release past this share of the card's width to advance (§S06). */
const ADVANCE_RATIO = 0.25
/** Only treat a gesture as a drag once it is clearly horizontal (§S06). */
const HORIZONTAL_BIAS = 1.5

/**
 * §S06 — the card deck. The most deliberate interaction on the site, because
 * this is what a hiring manager came for.
 *
 * No autoplay, by instruction: auto-advancing a slider that carries primary
 * content is both a WCAG 2.2.2 problem and a way of stealing reading time.
 */
export function S06Work() {
  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [openProject, setOpenProject] = useState<Project | null>(null)

  const deckRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const pointer = useRef<{ id: number; x: number; y: number; captured: boolean } | null>(null)
  /**
   * True from the moment a drag is captured until the next pointerdown. A
   * browser still fires `click` on whatever was under the pointer when a drag
   * ends, so without this, releasing a swipe over a tag would open Figma.
   */
  const didDrag = useRef(false)

  const reducedMotion = useReducedMotion()
  /**
   * §S06 sets the peeks at 4deg and 8deg. A rotated box has a wider bounding
   * box than the box itself, and at 320px that pushed the deck 19px past the
   * viewport — which §8 forbids. Below 640px the angles halve, which keeps the
   * same read without the overflow.
   */
  const roomy = useMediaQuery('(min-width: 640px)')
  const peekAngles = roomy ? [4, 8] : [2, 4]
  const single = PROJECTS.length === 1

  const go = useCallback((next: number) => {
    setActive((current) => {
      const target = Math.max(0, Math.min(PROJECTS.length - 1, next))
      return target === current ? current : target
    })
  }, [])

  /**
   * §S06 requires focus to return to the card that opened the overlay. On top
   * of that the page is sent back to Selected Work, so closing always lands
   * you where the deck is rather than wherever the overlay happened to cover.
   *
   * `preventScroll` on the focus call stops the browser scrolling the card
   * into view and fighting the scroll below it.
   */
  const closeCaseStudy = useCallback(() => {
    setOpenProject(null)
    // Runs after the overlay's cleanup has released the scroll lock.
    setTimeout(() => {
      cardRefs.current[active]?.focus({ preventScroll: true })
      scrollToId('work')
    }, 0)
  }, [active])

  /* ---------------- drag ---------------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (single || openProject) return
    didDrag.current = false
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, captured: false }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId) return

    const dx = e.clientX - p.x
    const dy = e.clientY - p.y

    // §S06: never steal a vertical swipe from the page.
    if (!p.captured) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      if (Math.abs(dx) <= Math.abs(dy) * HORIZONTAL_BIAS) {
        pointer.current = null
        return
      }
      p.captured = true
      didDrag.current = true
      setDragging(true)
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    }

    setDrag(dx)
  }

  const endDrag = (e: React.PointerEvent) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId) return
    pointer.current = null

    if (p.captured) {
      const width = deckRef.current?.offsetWidth ?? 1
      if (Math.abs(drag) > width * ADVANCE_RATIO) {
        go(active + (drag < 0 ? 1 : -1))
      }
    }

    setDragging(false)
    setDrag(0)
  }

  return (
    <Section id="work" title={WORK_HEADING}>
      <div
        ref={deckRef}
        className="relative mx-auto w-full max-w-[560px]"
        onKeyDown={(e) => {
          if (single) return
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            go(active + 1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            go(active - 1)
          }
        }}
      >
        {/*
          The stack. Only the front card is interactive; the two behind it are
          dithered, inert and hidden from assistive tech (§S06).

          The front card stays IN FLOW so the container takes its height. It
          used to be absolutely positioned under a fixed 420px min-height,
          which meant a card that wrapped to 600px on a narrow screen ran
          straight through the arrows below it.
        */}
        <div className="relative min-h-[420px]">
          {PROJECTS.map((project, i) => {
            const offset = i - active
            if (offset < 0 || offset > 2) return null
            const isFront = offset === 0

            const rotation = isFront
              ? dragging
                ? drag / 20
                : 0
              : offset === 1
                ? peekAngles[0]
                : peekAngles[1]

            return (
              <div
                key={project.id}
                className={cx(
                  isFront ? 'relative z-30' : 'absolute inset-x-0 top-0',
                  !isFront && (offset === 1 ? 'z-20' : 'z-10'),
                )}
                style={{
                  transform: `translate(${isFront ? drag : 0}px, ${offset * -8}px) rotate(${rotation}deg)`,
                  transition: dragging || reducedMotion ? undefined : 'transform 150ms steps(3)',
                }}
                {...(!isFront ? { inert: '' as unknown as boolean, 'aria-hidden': true } : {})}
              >
                <ProjectCard
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  project={project}
                  index={i}
                  isFront={isFront}
                  dragging={dragging && isFront}
                  onOpen={() => setOpenProject(project)}
                  shouldSuppressClick={() => didDrag.current}
                  onPointerDown={isFront ? onPointerDown : undefined}
                  onPointerMove={isFront ? onPointerMove : undefined}
                  onPointerUp={isFront ? endDrag : undefined}
                  onPointerCancel={isFront ? endDrag : undefined}
                />
              </div>
            )
          })}
        </div>

        {/* §S06: arrows and dots are always visible and always operable. */}
        {!single ? (
          <div className="mt-12 flex items-center justify-center gap-6">
            <ArrowButton
              direction="prev"
              disabled={active === 0}
              onClick={() => go(active - 1)}
            />

            <div role="tablist" aria-label="Projects" className="flex gap-3">
              {PROJECTS.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${i + 1} of ${PROJECTS.length}: ${project.title}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => go(i)}
                  className="flex h-[44px] w-[44px] items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      'block h-3 w-3 border-2 border-[color:var(--line)]',
                      i === active ? 'bg-[color:var(--brand)]' : 'dither dither-25',
                    )}
                  />
                </button>
              ))}
            </div>

            <ArrowButton
              direction="next"
              disabled={active === PROJECTS.length - 1}
              onClick={() => go(active + 1)}
            />
          </div>
        ) : null}
      </div>

      {openProject ? <CaseStudyModal project={openProject} onClose={closeCaseStudy} /> : null}
    </Section>
  )
}

/* ------------------------------------------------------------------ */

type ProjectCardProps = {
  project: Project
  index: number
  isFront: boolean
  dragging: boolean
  onOpen: () => void
  shouldSuppressClick?: () => boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
  onPointerCancel?: (e: React.PointerEvent) => void
}

/**
 * forwardRef, not a plain `ref` prop: on React 18 `ref` is not passed through
 * to a function component, so the deck could never focus a card — which is
 * exactly what §S06 requires when the case study closes.
 */
const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard(
  { project, index, isFront, dragging, onOpen, shouldSuppressClick, ...pointerHandlers },
  ref,
) {
  return (
  <div
    ref={ref}
    tabIndex={isFront ? 0 : -1}
    role="group"
    aria-roledescription="slide"
    aria-label={`${index + 1} of ${PROJECTS.length}: ${project.title}`}
    data-grab={isFront || undefined}
    data-grabbing={dragging || undefined}
    onKeyDown={(e) => {
      if (isFront && e.key === 'Enter') {
        e.preventDefault()
        onOpen()
      }
    }}
    {...pointerHandlers}
    className={cx(
      'touch-pan-y select-none',
      isFront && 'transition-[box-shadow,transform] duration-100 ease-steps-4',
    )}
  >
    <Panel
      variant="window"
      title={`${String(index + 1).padStart(2, '0')}/${String(PROJECTS.length).padStart(2, '0')} — ${project.title}`}
      className={cx(isFront && 'hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--shadow)]')}
    >
      <Cover project={project} />

      <h3
        className="mt-6 font-ui text-h3 font-bold"
        // §S06 edge case: two lines, then ellipsis, with the full title
        // still available to a pointer and to assistive tech.
        title={project.title}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.title}
      </h3>
      <p className="mt-1 text-[color:var(--ink-soft)]">{project.subtitle}</p>

      <ProjectTags
        tags={project.tags}
        shouldSuppressClick={shouldSuppressClick}
        className="mt-4"
      />

      <p className="mt-4 text-small text-[color:var(--ink-mute)]">{project.context}</p>

      <button
        type="button"
        onClick={onOpen}
        tabIndex={isFront ? 0 : -1}
        className="mt-6 flex min-h-[44px] items-center gap-2 font-ui text-label font-semibold uppercase tracking-[0.08em] text-[color:var(--ink)] underline"
      >
        <span aria-hidden="true">▸</span>
        {OPEN_CASE_STUDY}
        <span className="sr-only"> for {project.title}</span>
      </button>
    </Panel>
  </div>
  )
})

/**
 * §S06 edge case: a missing cover falls back to a dither block carrying the
 * project's initial in Silkscreen. No covers exist yet, so this is what every
 * card shows.
 */
function Cover({ project }: { project: Project }) {
  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt=""
        className="h-[160px] w-full border-2 border-[color:var(--line)] object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="dither dither-25 flex h-[160px] w-full items-center justify-center border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]"
    >
      <span className="font-display text-display font-bold text-[color:var(--brand)]">
        {project.title.charAt(0)}
      </span>
    </div>
  )
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const isNext = direction === 'next'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? 'Next project' : 'Previous project'}
      className={cx(
        'flex h-[44px] w-[44px] flex-none items-center justify-center',
        'border-2 border-[color:var(--line)]',
        'transition-[box-shadow,transform] duration-100 ease-steps-4',
        disabled
          ? 'cursor-not-allowed border-[color:var(--ink-mute)] bg-[color:var(--bg-sunken)] text-[color:var(--ink-mute)]'
          : 'bg-[color:var(--bg-raised)] text-[color:var(--ink)] shadow-[2px_2px_0_var(--shadow)] hover:shadow-[4px_4px_0_var(--shadow)]',
      )}
    >
      <svg
        viewBox="0 0 12 16"
        width="12"
        height="16"
        fill="currentColor"
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={isNext ? undefined : { transform: 'scaleX(-1)' }}
      >
        <rect x="2" y="2" width="2" height="2" />
        <rect x="4" y="4" width="2" height="2" />
        <rect x="6" y="6" width="2" height="2" />
        <rect x="6" y="8" width="2" height="2" />
        <rect x="4" y="10" width="2" height="2" />
        <rect x="2" y="12" width="2" height="2" />
      </svg>
    </button>
  )
}

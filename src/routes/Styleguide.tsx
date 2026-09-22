import { useState, type ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Panel } from '@/components/pixel/Panel'
import { PixelButton } from '@/components/pixel/PixelButton'
import { PixelInput } from '@/components/pixel/PixelInput'
import { PixelTextarea } from '@/components/pixel/PixelTextarea'
import { PixelSelect } from '@/components/pixel/PixelSelect'
import { DitherFill } from '@/components/pixel/DitherFill'
import { ThemeSwitch } from '@/components/pixel/ThemeSwitch'
import { ContrastTable } from '@/components/pixel/ContrastTable'
import { GlyphCaretDown, GlyphCheck, GlyphChevronDown, GlyphStar, GlyphWarn } from '@/components/pixel/PixelGlyph'
import { MochiSprite } from '@/components/mochi/MochiSprite'
import { setMochiMood } from '@/components/mochi/mochiMood'
import { useTheme } from '@/hooks/useTheme'

/* ------------------------------------------------------------------ */
/* Layout helpers, local to this route                                 */
/* ------------------------------------------------------------------ */

function StateCell({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-[80px] items-center">{children}</div>
      <div>
        <p className="hud text-[color:var(--ink)]">{label}</p>
        {note ? <p className="pxhint">{note}</p> : null}
      </div>
    </div>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function Swatch({ token, name }: { token: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="block h-12 w-12 flex-none border-2 border-[color:var(--line)]"
        style={{ background: `var(${token})` }}
      />
      <span className="min-w-0">
        <span className="block font-ui text-small">{name}</span>
        <span className="block text-small text-[color:var(--ink-mute)]">{token}</span>
      </span>
    </div>
  )
}

/* The eight spec colours, both moods at once — these read the same in
   either theme, which is what lets S00 render day and night side by side. */
const CORE_TOKENS = [
  ['--day-bg', 'day · bg primary'],
  ['--day-gold', 'day · accent gold'],
  ['--day-sec', 'day · accent secondary'],
  ['--day-text', 'day · text primary'],
  ['--day-raised', 'day · raised'],
  ['--day-sunken', 'day · sunken'],
  ['--day-shadow', 'day · shadow'],
  ['--night-bg', 'night · bg primary'],
  ['--night-gold', 'night · accent gold'],
  ['--night-sec', 'night · accent secondary'],
  ['--night-text', 'night · text primary'],
  ['--night-raised', 'night · raised'],
  ['--night-sunken', 'night · sunken'],
  ['--night-shadow', 'night · shadow'],
  ['--star', 'star'],
  ['--error', 'error'],
  ['--success', 'success'],
  ['--warn', 'warn'],
] as const

const THEME_TOKENS = [
  ['--bg', 'bg'],
  ['--bg-raised', 'bg raised'],
  ['--bg-sunken', 'bg sunken'],
  ['--ink', 'ink'],
  ['--ink-soft', 'ink soft'],
  ['--ink-mute', 'ink mute'],
  ['--line', 'line'],
  ['--brand', 'brand'],
  ['--accent', 'accent'],
  ['--shadow', 'shadow'],
  ['--on-brand', 'on brand *'],
  ['--on-accent', 'on accent *'],
  ['--on-line', 'on line *'],
  ['--error-ink', 'error ink *'],
  ['--ink-placeholder', 'ink placeholder *'],
  ['--focus', 'focus *'],
  ['--bg-primary', 'bg primary'],
  ['--accent-gold', 'accent gold'],
  ['--accent-secondary', 'accent secondary'],
  ['--text-primary', 'text primary'],
  ['--lotus-petal', 'lotus petal *'],
  ['--lotus-petal-deep', 'lotus petal deep *'],
  ['--lotus-core', 'lotus core *'],
  ['--lotus-pad', 'lotus pad *'],
] as const

const SUBJECT_OPTIONS = [
  { value: 'job', label: 'Job opportunity' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'collab', label: 'Collaboration' },
  { value: 'hi', label: 'Just saying hi' },
]

/* ------------------------------------------------------------------ */

export function Styleguide() {
  const { theme, toggleTheme } = useTheme()
  const [message, setMessage] = useState('A live counter, so the textarea has something to count.')

  return (
    <>
      <a href="#styleguide-main" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]">
        <Container className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="hud">R // Moon Station</p>
            <p className="text-small text-[color:var(--ink-mute)]">
              Phase 1 styleguide — {theme} theme
            </p>
          </div>
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
        </Container>
      </header>

      <main id="styleguide-main">
        <Container className="pt-16">
          <h1 className="font-display text-h1 font-bold">Styleguide</h1>
          <p className="mt-6 max-w-measure text-lead text-[color:var(--ink-soft)]">
            Every Phase 1 primitive in every state the §7 matrix asks for. Flip the theme
            with the switch above — everything here must hold in both. Hover and active
            are pinned open in the state grids so they can be checked side by side; the
            live versions respond to a real pointer.
          </p>
        </Container>

        {/* ---------------- Colour ---------------- */}
        <Section dense id="sg-colour" title="Colour tokens">
          <h3 className="hud mb-6">Core palette — fixed in both themes</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_TOKENS.map(([token, name]) => (
              <Swatch key={token} token={token} name={name} />
            ))}
          </div>

          <h3 className="hud mb-6 mt-16">Theme-mapped — these are what components use</h3>
          <p className="pxhint mb-6 max-w-measure">
            Tokens marked * are additions, not spec values. The spec defines filled
            surfaces without foreground colours, and its error red misses 4.5:1 as text
            in both themes. Each addition is measured in the audit below.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_TOKENS.map(([token, name]) => (
              <Swatch key={token} token={token} name={name} />
            ))}
          </div>
        </Section>

        {/* ---------------- Contrast ---------------- */}
        <Section dense id="sg-contrast" title="Contrast audit">
          <ContrastTable theme={theme} />
        </Section>

        {/* ---------------- Type ---------------- */}
        <Section dense id="sg-type" title="Type scale">
          <div className="flex flex-col gap-8">
            <TypeRow token="--t-display" role="Silkscreen 700 — hero only">
              <span className="font-display text-display font-bold tracking-[0.04em]">RUBY</span>
            </TypeRow>
            <TypeRow token="--t-h1" role="Silkscreen 700">
              <span className="font-display text-h1 font-bold">Moon station</span>
            </TypeRow>
            <TypeRow token="--t-h2" role="Silkscreen 400">
              <span className="font-display text-h2">Design, but make it human</span>
            </TypeRow>
            <TypeRow token="--t-h3" role="Pixelify Sans 700">
              <span className="font-ui text-h3 font-bold">How I work</span>
            </TypeRow>
            <TypeRow token="--t-lead" role="IBM Plex Mono 400">
              <span className="block max-w-measure text-lead">
                I turn messy problems into clear, kind interfaces.
              </span>
            </TypeRow>
            <TypeRow token="--t-body" role="IBM Plex Mono 400 — 16px floor">
              <span className="block max-w-measure text-body">
                Body copy is monospace, not bitmap. Bitmap faces below about 14px lose
                stroke definition and fail legibility for dyslexic and low-vision readers.
                This is the single most important accessibility decision on the site.
              </span>
            </TypeRow>
            <TypeRow token="--t-small" role="IBM Plex Mono 400 — meta only">
              <span className="text-small text-[color:var(--ink-mute)]">
                DEEP Ideation Hackathon, 2026
              </span>
            </TypeRow>
            <TypeRow token="--t-label" role="Pixelify Sans 600, +0.08em">
              <span className="hud">Inventory</span>
            </TypeRow>
          </div>
        </Section>

        {/* ---------------- Dither ---------------- */}
        <Section dense id="sg-dither" title="Dither">
          <p className="mb-8 max-w-measure text-[color:var(--ink-soft)]">
            The dither replaces every gradient on this site. Density is a tile size, never
            an opacity — fading chrome with opacity is banned by the pixel contract.
          </p>
          <Grid>
            <StateCell label="dither-25" note="8px tile — disabled fills, idle halves">
              <DitherFill density={25} className="h-24 w-full border-2 border-[color:var(--line)]" />
            </StateCell>
            <StateCell label="dither-50" note="4px tile — panel depth, transitions">
              <DitherFill density={50} className="h-24 w-full border-2 border-[color:var(--line)]" />
            </StateCell>
            <StateCell label="dither-75" note="2px tile — the airlock wipe">
              <DitherFill density={75} className="h-24 w-full border-2 border-[color:var(--line)]" />
            </StateCell>
          </Grid>
        </Section>

        {/* ---------------- Panel ---------------- */}
        <Section dense id="sg-panel" title="Panel">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="hud mb-4">default — notched</p>
              <Panel>
                <p className="font-ui text-h3 font-bold">Every box is this box</p>
                <p className="mt-3 text-[color:var(--ink-soft)]">
                  Cards, modals and wells are all variants of one primitive. The four 4×4
                  corner notches are what sell the pixel read.
                </p>
              </Panel>
            </div>

            <div>
              <p className="hud mb-4">window — 24px title bar</p>
              <Panel variant="window" title="about.txt">
                <p className="text-[color:var(--ink-soft)]">
                  The chrome glyphs are decoration, so they are hidden from assistive tech
                  rather than announced as buttons nobody can press.
                </p>
              </Panel>
            </div>

            <div>
              <p className="hud mb-4">sunken — inset shadow, for wells</p>
              <Panel variant="sunken">
                <p className="text-[color:var(--ink-soft)]">
                  Used behind input fields and anything that should read as recessed.
                </p>
              </Panel>
            </div>

            <div>
              <p className="hud mb-4">flush — no shadow, for nesting</p>
              <Panel variant="flush">
                <p className="text-[color:var(--ink-soft)]">
                  Sits inside another panel without doubling up the drop shadow.
                </p>
              </Panel>
            </div>
          </div>
        </Section>

        {/* ---------------- Buttons ---------------- */}
        <Section dense id="sg-button" title="Pixel button">
          {(
            [
              ['brand', 'Primary — brand fill'],
              ['accent', 'Accent — amber. Hero CTA and form submit only'],
              ['secondary', 'Secondary — surface fill'],
            ] as const
          ).map(([tone, heading]) => (
            <div key={tone} className="mb-16 last:mb-0">
              <h3 className="hud mb-8">{heading}</h3>
              <Grid>
                <StateCell label="default">
                  <PixelButton tone={tone}>View my work</PixelButton>
                </StateCell>
                <StateCell label="hover" note="shadow 6px, shift −2px">
                  <PixelButton tone={tone} className="is-hover">
                    View my work
                  </PixelButton>
                </StateCell>
                <StateCell label="active" note="shadow 0, shift +4px — the press">
                  <PixelButton tone={tone} className="is-active">
                    View my work
                  </PixelButton>
                </StateCell>
                <StateCell label="focus-visible" note="4px --focus, offset 4px">
                  <PixelButton tone={tone} className="is-focus">
                    View my work
                  </PixelButton>
                </StateCell>
                <StateCell label="disabled" note="dither-25 fill, no shadow">
                  <PixelButton tone={tone} disabled>
                    View my work
                  </PixelButton>
                </StateCell>
                <StateCell label="loading" note="4-frame spinner, keeps its name">
                  <PixelButton tone={tone} loading loadingLabel="loading…">
                    View my work
                  </PixelButton>
                </StateCell>
              </Grid>
            </div>
          ))}

          <h3 className="hud mb-8">Live — use a real pointer and a real Tab key</h3>
          <div className="flex flex-wrap items-center gap-6">
            <PixelButton tone="accent">View my work</PixelButton>
            <PixelButton tone="secondary" icon={<GlyphChevronDown />}>
              Download CV
            </PixelButton>
            <PixelButton href="#sg-button" tone="brand">
              Anchor button
            </PixelButton>
            <PixelButton href="#sg-button" tone="brand" aria-disabled>
              Disabled link
            </PixelButton>
          </div>
        </Section>

        {/* ---------------- Fields ---------------- */}
        <Section dense id="sg-fields" title="Fields">
          <h3 className="hud mb-8">Text input</h3>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <PixelInput label="Your name" placeholder="who's there?" autoComplete="name" />
            <PixelInput
              label="Your name"
              placeholder="who's there?"
              className="is-hover"
              hint="hover"
            />
            <PixelInput
              label="Your name"
              defaultValue="Ruby"
              className="is-focus"
              hint="focus-visible"
            />
            <PixelInput label="Email" defaultValue="rubytitanx@gmail.com" state="valid" />
            <PixelInput
              label="Email"
              defaultValue="ruby@"
              error="That email doesn't look right — check for a typo."
            />
            <PixelInput label="Email" defaultValue="rubytitanx@gmail.com" disabled />
            <PixelInput label="Email" defaultValue="checking…" state="loading" />
            <PixelInput
              label="Website"
              placeholder="optional"
              hint="A hint sits where the error message would go."
            />
          </div>

          <h3 className="hud mb-8 mt-16">Textarea</h3>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <PixelTextarea
              label="What's on your mind?"
              placeholder="say anything — I read everything"
              value={message}
              maxLength={1500}
              showCounter
              onChange={(e) => setMessage(e.target.value)}
            />
            <PixelTextarea
              label="What's on your mind?"
              defaultValue="hi"
              error="A few more words would help — 10 characters minimum."
            />
            <PixelTextarea label="What's on your mind?" defaultValue="Locked while sending." disabled />
            <PixelTextarea label="What's on your mind?" defaultValue="Sending…" state="loading" />
          </div>

          <h3 className="hud mb-8 mt-16">Select</h3>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <PixelSelect label="About" options={SUBJECT_OPTIONS} placeholder="Pick one" />
            <PixelSelect
              label="About"
              options={SUBJECT_OPTIONS}
              defaultValue="job"
              className="is-focus"
              hint="focus-visible"
            />
            <PixelSelect
              label="About"
              options={SUBJECT_OPTIONS}
              placeholder="Pick one"
              error="Choose what this is about so I can route it."
            />
            <PixelSelect label="About" options={SUBJECT_OPTIONS} defaultValue="job" disabled />
          </div>
        </Section>

        {/* ---------------- Theme switch ---------------- */}
        <Section dense id="sg-switch" title="Theme switch">
          <Grid>
            <StateCell label="day — aria-checked false">
              <ThemeSwitch theme="light" onToggle={() => {}} />
            </StateCell>
            <StateCell label="night — aria-checked true">
              <ThemeSwitch theme="dark" onToggle={() => {}} />
            </StateCell>
            <StateCell label="focus-visible">
              <ThemeSwitch theme={theme} onToggle={toggleTheme} className="is-focus" />
            </StateCell>
            <StateCell label="live — operates the page">
              <ThemeSwitch theme={theme} onToggle={toggleTheme} />
            </StateCell>
          </Grid>
        </Section>

        {/* ---------------- Glyphs ---------------- */}
        <Section dense id="sg-glyphs" title="Pixel glyphs">
          <p className="mb-8 max-w-measure text-[color:var(--ink-soft)]">
            Whole squares on an integer grid, rendered with crispEdges. They inherit
            currentColor, so they theme for free.
          </p>
          <div className="flex flex-wrap gap-12">
            <GlyphSample name="check">
              <GlyphCheck width={32} height={32} />
            </GlyphSample>
            <GlyphSample name="warn">
              <GlyphWarn width={32} height={32} />
            </GlyphSample>
            <GlyphSample name="caret">
              <GlyphCaretDown width={32} height={16} />
            </GlyphSample>
            <GlyphSample name="chevron">
              <GlyphChevronDown width={32} height={24} />
            </GlyphSample>
            <GlyphSample name="star">
              <GlyphStar width={32} height={32} />
            </GlyphSample>
            <GlyphSample name="loader">
              <span className="pxloader" style={{ width: 24, height: 24 }} />
            </GlyphSample>
          </div>
        </Section>

        {/* ---------------- MOCHI ---------------- */}
        <Section dense id="sg-mochi" title="MOCHI · Unit R-01">
          <p className="mb-8 max-w-measure text-[color:var(--ink-soft)]">
            One sprite, composed from swappable layers — ears, eyes, arms and an
            accessory (§3.3). Every §3.2 bot state below is a combination of those four
            slots, so a new pose costs a line, not a new drawing.
          </p>

          <h3 className="hud mb-8">Bot states (§3.2)</h3>
          <Grid>
            <StateCell label="idle" note="breathing, blinks every 4-7s">
              <MochiSprite size={96} className="mochi-breathe" />
            </StateCell>
            <StateCell label="idle — blink">
              <MochiSprite size={96} eyes="closed" />
            </StateCell>
            <StateCell label="hover" note='"need a hand?"'>
              <MochiSprite size={96} ears="perked" arms="wave" />
            </StateCell>
            <StateCell label="hover — wave frame 2" note="steps(2), never tweened">
              <MochiSprite size={96} ears="perked" arms="waveAlt" />
            </StateCell>
            <StateCell label="scroll-fast" note='"whoa, slow down!"'>
              <MochiSprite size={96} ears="back" eyes="squint" />
            </StateCell>
            <StateCell label="idle-long" note="45s idle — asleep, z z z">
              <MochiSprite size={96} ears="droop" eyes="closed" accessory="zzz" />
            </StateCell>
            <StateCell label="section-work" note='"my favourite one is EcoFootPrint"'>
              <MochiSprite size={96} arms="hold" accessory="clipboard" />
            </StateCell>
            <StateCell label="section-contact" note={`"kettle's on"`}>
              <MochiSprite size={96} arms="hold" accessory="coffee" />
            </StateCell>
            <StateCell label="form-success" note='"message launched!" — announced'>
              <MochiSprite size={96} ears="perked" eyes="wide" arms="wave" />
            </StateCell>
            <StateCell label="form-error" note='"hmm, check the fields?" — announced'>
              <MochiSprite size={96} ears="droop" eyes="closed" />
            </StateCell>
            <StateCell label="404" note="adrift, snapped cable">
              <MochiSprite size={96} ears="droop" eyes="wide" arms="hold" accessory="cable" />
            </StateCell>
            <StateCell label="contact — coffee and cookie">
              <MochiSprite size={96} arms="hold" accessory="cookie" />
            </StateCell>
          </Grid>

          <h3 className="hud mb-8 mt-16">Airlock ear tilt (§3.1, used by S00)</h3>
          <Grid>
            <StateCell label="tilt left">
              <MochiSprite size={96} ears="tiltLeft" />
            </StateCell>
            <StateCell label="neutral">
              <MochiSprite size={96} />
            </StateCell>
            <StateCell label="tilt right">
              <MochiSprite size={96} ears="tiltRight" />
            </StateCell>
          </Grid>

          <h3 className="hud mb-8 mt-16">Drive the live bot</h3>
          <p className="pxhint mb-6 max-w-measure">
            The bot is bottom-right. These push the two states that Phase 7&apos;s form
            will trigger — the only two announced to screen readers.
          </p>
          <div className="flex flex-wrap gap-4">
            <PixelButton tone="secondary" onClick={() => setMochiMood('form-success')}>
              Fire form-success
            </PixelButton>
            <PixelButton tone="secondary" onClick={() => setMochiMood('form-error')}>
              Fire form-error
            </PixelButton>
            <PixelButton tone="secondary" onClick={() => setMochiMood('none')}>
              Clear
            </PixelButton>
          </div>
        </Section>

        {/* ---------------- Cursor ---------------- */}
        <Section dense id="sg-cursor" title="Pixel cursor">
          <p className="mb-8 max-w-measure text-[color:var(--ink-soft)]">
            Drawn on a canvas at runtime and applied as data URLs, so it follows the
            theme and ships no binary assets. Hover the samples to see each state. It is
            off entirely on touch devices, the trail is off under reduced motion, and the
            whole thing has an escape hatch in the settings menu.
          </p>
          <Grid>
            <StateCell label="default" note="pixel arrow — navy outline, moss fill">
              <span className="block h-12 w-full border-2 border-[color:var(--line)] bg-[color:var(--bg-raised)]" />
            </StateCell>
            <StateCell label="interactive" note="pixel hand">
              <PixelButton tone="secondary">Hover me</PixelButton>
            </StateCell>
            <StateCell label="text" note="pixel I-beam">
              <input
                className="pxfield"
                defaultValue="Hover this field"
                aria-label="Cursor sample, text"
              />
            </StateCell>
            <StateCell label="draggable" note="grab, then closed on press">
              <span
                data-grab
                className="flex h-12 w-full items-center justify-center border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)] font-ui text-small"
              >
                drag me
              </span>
            </StateCell>
            <StateCell label="disabled" note="arrow with a small x">
              <PixelButton disabled>Disabled</PixelButton>
            </StateCell>
            <StateCell label="loading" note="4-frame hourglass">
              <PixelButton loading loadingLabel="sending…">
                Send it
              </PixelButton>
            </StateCell>
          </Grid>
        </Section>

        <Section dense id="sg-end" title="End of Phase 3" hideTitle>
          <Panel variant="window" title="next">
            <p className="text-[color:var(--ink-soft)]">
              Phase 4 is the first real content: S01 hero, S02 ticker, S03 about,
              S04 skills, S07 education and S08 languages.
            </p>
          </Panel>
        </Section>
      </main>
    </>
  )
}

function TypeRow({ token, role, children }: { token: string; role: string; children: ReactNode }) {
  return (
    <div className="border-b-2 border-[color:var(--line)] pb-8">
      <div className="mb-4">{children}</div>
      <p className="text-small text-[color:var(--ink-mute)]">
        {token} — {role}
      </p>
    </div>
  )
}

function GlyphSample({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-12 items-center text-[color:var(--ink)]">{children}</div>
      <p className="hud">{name}</p>
    </div>
  )
}

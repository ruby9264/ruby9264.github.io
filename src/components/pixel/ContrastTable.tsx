import { useLayoutEffect, useState } from 'react'
import { contrastRatio, grade, resolveToken, THRESHOLDS, type ContrastNeed } from '@/lib/contrast'
import type { Theme } from '@/hooks/useTheme'

type Pair = {
  fg: string
  bg: string
  label: string
  need: ContrastNeed
  note?: string
}

/**
 * The pairings §9 actually cares about: real text on real surfaces, plus
 * the border and focus-ring colours that must clear 3:1 as UI components.
 */
const PAIRS: Pair[] = [
  { fg: '--ink', bg: '--bg', label: 'Body text on page', need: 'body' },
  { fg: '--ink', bg: '--bg-raised', label: 'Body text on panel', need: 'body' },
  { fg: '--ink', bg: '--bg-sunken', label: 'Body text in a field', need: 'body' },
  { fg: '--ink-soft', bg: '--bg', label: 'Secondary text on page', need: 'body' },
  { fg: '--ink-soft', bg: '--bg-raised', label: 'Secondary text on panel', need: 'body' },
  { fg: '--ink-mute', bg: '--bg', label: 'Meta text on page', need: 'body' },
  { fg: '--ink-mute', bg: '--bg-raised', label: 'Meta text on panel', need: 'body' },
  { fg: '--ink-soft', bg: '--bg-sunken', label: 'Footer link', need: 'body' },
  { fg: '--ink-mute', bg: '--bg-sunken', label: 'Meta text in the footer', need: 'body' },
  { fg: '--ink-placeholder', bg: '--bg-sunken', label: 'Placeholder in a field', need: 'body' },
  { fg: '--on-brand', bg: '--brand', label: 'Button label on brand fill', need: 'body' },
  { fg: '--on-accent', bg: '--accent', label: 'Button label on accent fill', need: 'body' },
  { fg: '--error-ink', bg: '--bg-raised', label: 'Error message on panel', need: 'body' },
  { fg: '--error-ink', bg: '--bg', label: 'Error message on page', need: 'body' },
  { fg: '--error-ink', bg: '--bg-sunken', label: 'Error message in a well', need: 'body' },
  { fg: '--on-line', bg: '--line', label: 'Window chrome title', need: 'body' },
  { fg: '--line', bg: '--bg', label: 'Panel border on page', need: 'ui' },
  { fg: '--line', bg: '--bg-raised', label: 'Border on panel', need: 'ui' },
  { fg: '--line', bg: '--bg-sunken', label: 'Footer divider', need: 'ui' },
  { fg: '--on-brand', bg: '--brand', label: 'Dock indicator on active slot', need: 'ui' },
  // outline-offset is 4px, so the ring's neighbour is always the surface
  // *behind* the control, never the control's own fill.
  { fg: '--focus', bg: '--bg', label: 'Focus ring on page', need: 'ui' },
  { fg: '--focus', bg: '--bg-raised', label: 'Focus ring on panel', need: 'ui' },
  { fg: '--focus', bg: '--bg-sunken', label: 'Focus ring in a well', need: 'ui' },
  { fg: '--error', bg: '--bg-sunken', label: 'Error field border', need: 'ui' },
  { fg: '--brand', bg: '--bg', label: 'Brand fill against page', need: 'ui' },
  { fg: '--accent', bg: '--bg', label: 'Accent fill against page', need: 'ui' },
]

type Row = Pair & { fgValue: string; bgValue: string; ratio: number | null }

export function ContrastTable({ theme }: { theme: Theme }) {
  const [rows, setRows] = useState<Row[]>([])

  // Measured synchronously. An earlier version waited a frame via
  // requestAnimationFrame, which never fires in a backgrounded tab — the table
  // then rendered empty and cheerfully reported "All 0 pairs pass".
  // [data-theme] is set before first paint by the inline script in index.html,
  // so the tokens are already correct here.
  useLayoutEffect(() => {
    setRows(
      PAIRS.map((p) => {
        const fgValue = resolveToken(p.fg)
        const bgValue = resolveToken(p.bg)
        return { ...p, fgValue, bgValue, ratio: contrastRatio(fgValue, bgValue) }
      }),
    )
  }, [theme])

  const failures = rows.filter((r) => r.ratio !== null && r.ratio < THRESHOLDS[r.need])

  return (
    <div>
      <p className="pxhint mb-4">
        Measured from the computed tokens in the live DOM, not from numbers written in
        the spec. Threshold is 4.5:1 for text and 3:1 for borders and focus rings.
      </p>

      <p
        className="hud mb-6"
        style={{ color: failures.length || rows.length === 0 ? 'var(--error)' : 'var(--brand)' }}
      >
        {rows.length === 0
          ? 'Audit did not run — no pairs measured'
          : failures.length === 0
            ? `All ${rows.length} pairs pass in ${theme} theme`
            : `${failures.length} of ${rows.length} pairs fail in ${theme} theme`}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-small">
          <caption className="sr-only">
            Contrast ratios for every token pairing in the {theme} theme
          </caption>
          <thead>
            <tr className="border-2 border-[color:var(--line)] bg-[color:var(--bg-sunken)]">
              <th scope="col" className="hud p-3 text-left">
                Pairing
              </th>
              <th scope="col" className="hud p-3 text-left">
                Sample
              </th>
              <th scope="col" className="hud p-3 text-right">
                Ratio
              </th>
              <th scope="col" className="hud p-3 text-right">
                Needs
              </th>
              <th scope="col" className="hud p-3 text-right">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const result = r.ratio === null ? 'FAIL' : grade(r.ratio, r.need)
              const failed = result === 'FAIL'
              return (
                <tr
                  key={`${r.fg}-${r.bg}-${r.need}`}
                  className="border-2 border-t-0 border-[color:var(--line)]"
                >
                  <td className="p-3">
                    <span className="block">{r.label}</span>
                    <span className="block text-[color:var(--ink-mute)]">
                      {r.fg} on {r.bg}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className="inline-block border-2 border-[color:var(--line)] px-3 py-2"
                      style={{ background: r.bgValue, color: r.fgValue }}
                    >
                      Ag
                    </span>
                  </td>
                  <td className="p-3 text-right tabular-nums">
                    {r.ratio === null ? '—' : `${r.ratio.toFixed(2)}:1`}
                  </td>
                  <td className="p-3 text-right tabular-nums text-[color:var(--ink-mute)]">
                    {THRESHOLDS[r.need]}:1
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className="hud"
                      style={{ color: failed ? 'var(--error)' : 'var(--brand)' }}
                    >
                      {result}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

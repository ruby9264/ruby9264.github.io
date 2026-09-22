/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // §2.1 rule 1 — border-radius: 0 everywhere. Overriding (not extending) the
    // scale makes a rounded corner impossible to write by accident.
    borderRadius: { DEFAULT: '0', none: '0' },
    // §2.1 rule 2 — hard shadows only. No blur radius exists in the scale.
    boxShadow: {
      none: 'none',
      pixel: '4px 4px 0 var(--shadow)',
      'pixel-lg': '6px 6px 0 var(--shadow)',
      'pixel-sm': '2px 2px 0 var(--shadow)',
      'pixel-flat': '0 0 0 var(--shadow)',
    },
    // §2.1 rule 3 — 2px borders. 1px is not in the scale.
    borderWidth: { 0: '0', 2: '2px', 4: '4px' },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        // The two moods, theme-independent. Only S00's airlock needs these —
        // it is the one place that renders both palettes at the same instant.
        day: {
          bg: 'var(--day-bg)',
          gold: 'var(--day-gold)',
          sec: 'var(--day-sec)',
          text: 'var(--day-text)',
          raised: 'var(--day-raised)',
          sunken: 'var(--day-sunken)',
        },
        night: {
          bg: 'var(--night-bg)',
          gold: 'var(--night-gold)',
          sec: 'var(--night-sec)',
          text: 'var(--night-text)',
          raised: 'var(--night-raised)',
          sunken: 'var(--night-sunken)',
        },
        // The four spec names under whichever mood is active.
        'bg-primary': 'var(--bg-primary)',
        'accent-gold': 'var(--accent-gold)',
        'accent-secondary': 'var(--accent-secondary)',
        'text-primary': 'var(--text-primary)',
        star: 'var(--star)',
        // Theme-mapped semantic tokens (§2.2)
        bg: 'var(--bg)',
        'bg-raised': 'var(--bg-raised)',
        'bg-sunken': 'var(--bg-sunken)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-mute': 'var(--ink-mute)',
        line: 'var(--line)',
        brand: 'var(--brand)',
        'on-brand': 'var(--on-brand)',
        accent: 'var(--accent)',
        'on-accent': 'var(--on-accent)',
        focus: 'var(--focus)',
        error: 'var(--error)',
        success: 'var(--success)',
        warn: 'var(--warn)',
      },
      fontFamily: {
        display: ['Silkscreen', 'ui-monospace', 'monospace'],
        ui: ['"Pixelify Sans"', 'ui-monospace', 'monospace'],
        body: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['var(--t-display)', { lineHeight: '1.05' }],
        h1: ['var(--t-h1)', { lineHeight: '1.15' }],
        h2: ['var(--t-h2)', { lineHeight: '1.15' }],
        h3: ['var(--t-h3)', { lineHeight: '1.15' }],
        lead: ['var(--t-lead)', { lineHeight: '1.65' }],
        body: ['var(--t-body)', { lineHeight: '1.65' }],
        small: ['var(--t-small)', { lineHeight: '1.55' }],
        label: ['var(--t-label)', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px',
        6: '24px', 8: '32px', 12: '48px', 16: '64px',
        24: '96px', 32: '128px', 40: '160px',
      },
      maxWidth: { container: '1200px', measure: '62ch' },
      transitionTimingFunction: {
        'steps-4': 'steps(4)',
        'steps-8': 'steps(8)',
      },
    },
  },
  plugins: [],
}

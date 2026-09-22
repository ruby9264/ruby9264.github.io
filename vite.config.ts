import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * The deployed origin, used for the canonical URL, Open Graph tags and the
 * JSON-LD ids. One source of truth — `scripts/generate-seo.mjs` reads the same
 * variable for robots.txt and sitemap.xml.
 *
 * The GitHub Actions workflow sets SITE_URL and BASE_PATH from the live Pages
 * URL, so neither has to be edited by hand.
 */
const SITE_URL = (process.env.SITE_URL || 'https://ruby9264.github.io').replace(/\/+$/, '')

/**
 * Where the site is served from. `/` for a user site (a repo named
 * `<user>.github.io`), `/<repo>/` for a project site. Getting this wrong is
 * the usual reason a Pages deploy loads with no CSS.
 */
const BASE_PATH = process.env.BASE_PATH || '/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    {
      // Replaces the __SITE_URL__ token in index.html. Done with an explicit
      // transform rather than Vite's %ENV% syntax so it cannot silently leave
      // an unreplaced placeholder in the shipped HTML.
      name: 'inject-site-url',
      transformIndexHtml(html) {
        return html.replaceAll('__SITE_URL__', SITE_URL)
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  // 5173 unless something assigns a port. `npm run dev` by hand is unchanged;
  // a harness that needs to avoid a port already in use can pass PORT instead
  // of being blocked by a hardcoded one.
  server: { port: Number(process.env.PORT) || 5173 },
})

# Deploying to GitHub Pages

The repo is already set up to deploy itself. Push to `main` and GitHub builds
and publishes it — there is no manual build step and no URL to edit by hand.

---

## Before the first push

**1. Check what's in your CV.** `public/R-Ruby-CV-2026.pdf` becomes a public
download. §12 of the spec says your phone number is on the CV and must not be
published on the site, which is why it appears nowhere in the markup — but a
downloadable CV publishes whatever the file contains. Open it and decide. If
you want the number out, export a version without it and replace the file;
nothing else needs changing.

**2. Decide the repo name.** This decides your URL, and it is the only real
choice here:

| Repo name | URL | Notes |
|---|---|---|
| `ruby9264.github.io` | `https://ruby9264.github.io` | Clean, no subfolder. **Recommended.** |
| anything else, e.g. `portfolio` | `https://ruby9264.github.io/portfolio` | Fine too |

Either works — the workflow reads the live Pages URL and configures the build
for it, so you don't need to touch `vite.config.ts` either way.

---

## Step by step

### 1. Create the repository

On <https://github.com/new>:

- **Owner**: `ruby9264`
- **Name**: `ruby9264.github.io` (or your choice from the table above)
- **Public** — GitHub Pages needs this on a free account
- Do **not** tick "Add a README", ".gitignore" or "license". The project
  already has them, and an initialised repo makes the first push conflict.

### 2. Push the project

From the project folder, in a terminal:

```bash
git init
git add .
git commit -m "R // Moon Station — personal portfolio"
git branch -M main
git remote add origin https://github.com/ruby9264/ruby9264.github.io.git
git push -u origin main
```

Replace the URL if you named the repo something else.

If Git asks who you are, set it once:

```bash
git config --global user.name "Ruby"
git config --global user.email "your@email.com"
```

### 3. Turn on Pages

In the new repo: **Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**. Not "Deploy from a branch" — the workflow needs the
Actions source.

### 4. Watch it build

Go to the **Actions** tab. The "Deploy to GitHub Pages" run starts on its own
after the push and takes about a minute. When it goes green, your URL is shown
on the `deploy` job and under Settings → Pages.

### 5. Check it

- The site loads with styling (if it loads unstyled, the base path is wrong —
  see Troubleshooting).
- `/styleguide` works when typed directly, and a made-up path shows the 404.
- Open Graph: paste your URL into
  <https://www.opengraph.xyz> and confirm the pixel card appears.

---

## Updating the site later

```bash
git add .
git commit -m "what changed"
git push
```

That's it — every push to `main` redeploys.

---

## What the setup does for you

- **`.github/workflows/deploy.yml`** — installs, builds and publishes on every
  push to `main`.
- **Base path and site URL are automatic.** `actions/configure-pages` reports
  the live URL; the workflow feeds it to the build as `BASE_PATH` and
  `SITE_URL`. That fills in the canonical link, Open Graph tags, JSON-LD ids,
  `robots.txt` and `sitemap.xml`. Rename the repo and it all follows.
- **`dist/404.html`** — a copy of `index.html`, written by the `postbuild`
  step. GitHub Pages has no rewrite rules, so this is what makes a direct
  visit to `/styleguide` work instead of showing GitHub's own 404.
- **`public/.nojekyll`** — stops Pages running the files through Jekyll.
- **`public/_redirects`** is a Netlify file. It is inert on Pages and harmless;
  leave it if you might also deploy to Netlify.

Nothing secret is committed: `node_modules`, `dist`, `.env` and the TypeScript
build caches are all ignored.

---

## Troubleshooting

**The page loads but with no CSS, and the console shows 404s for `/assets/…`**
The base path is wrong. This should not happen with the workflow, but if you
built locally and uploaded `dist/` by hand, run:

```bash
BASE_PATH="/your-repo-name/" SITE_URL="https://ruby9264.github.io/your-repo-name" npm run build
```

**The Actions run fails on `npm ci`**
`package-lock.json` must be committed. Check it isn't ignored:
`git check-ignore -v package-lock.json` should print nothing.

**Pages shows a README instead of the site**
The Source is still "Deploy from a branch". Change it to GitHub Actions
(step 3).

**Changes don't appear**
Check the Actions tab for a failed run, then hard-reload (Ctrl+Shift+R) —
Pages caches aggressively.

---

## If you'd rather use Netlify

The project supports it with no changes: connect the repo at
<https://app.netlify.com>, build command `npm run build`, publish directory
`dist`. `public/_redirects` already handles SPA routing there. You'd want to
set `SITE_URL` as an environment variable in Netlify so the meta tags point at
the Netlify domain.

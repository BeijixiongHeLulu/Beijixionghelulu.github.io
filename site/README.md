# Jianshu Wang's academic website

Live site: <https://beijixionghelulu.github.io/>

Based on [Scholarly / Scholar Pages](https://github.com/jxpeng98/astro-theme-scholars)
by Jiaxin Peng (MIT; see `LICENSE`). Existing academic content, public paths,
images and PDF addresses are preserved from the al-folio site.

## Develop and verify

Use Node.js 24 and pnpm 11.16.0. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm format:check
pnpm verify
pnpm exec playwright install chromium
pnpm test:browser
```

If pnpm is unavailable, use `npx --yes pnpm@11.16.0` instead.
`PLAYWRIGHT_CHANNEL=chrome` uses an installed Chrome for browser tests.
`pnpm build` creates `dist/`.

## Edit content

| Content                             | Source                         |
| ----------------------------------- | ------------------------------ |
| Navigation, contact links, metadata | `site.config.ts`               |
| Biography                           | `src/content/profile/about.md` |
| Publications and selected status    | `src/data/publications.bib`    |
| Research projects                   | `src/content/projects/`        |
| News                                | `src/content/news/`            |
| CV                                  | `src/data/cv.yml`              |
| Hobby                               | `src/pages/hobby.astro`        |
| Images and CV PDF                   | Repository-root `assets/`      |
| Personal layout styles              | `src/styles/profile.css`       |

Keep project and news filenames to retain URLs. The unpublished trust project
has `draft: true`. `/projects/` contains research; a separate portfolio can be
added later without moving existing pages.

## Deployment and migration

`.github/workflows/deploy.yml` verifies and builds this directory on main, then
publishes `dist/` to the existing `gh-pages` branch. Pages settings are unchanged.
Build scripts copy original assets byte for byte and preserve `/sitemap.xml`.

`pnpm verify` checks types, unit tests, rendered content, original routes,
asset hashes and internal links. Browser tests cover desktop and mobile
navigation, publication filters, citation copy and theme persistence.

For the initial migration only, run `node scripts/verify-migration.mjs --baseline`
after building to check original content hashes and text. This strict snapshot
is separate so later authorized content updates are possible.
`scripts/import-legacy.py` documents the one-time import; do not rerun it against
the migrated live site.

Original Jekyll source remains in the root. The pre-migration commit is
`5d7bb1a0e22a9df8e50c33fbca363a8d48eac8d2`; restoring its workflow and source
restores the previous implementation.

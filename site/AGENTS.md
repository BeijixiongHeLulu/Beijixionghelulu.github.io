# Scholar Pages migration

The live website is built from this `site/` directory with Astro. The Jekyll files
in the repository root are retained as the migration source and for rollback;
their Ruby/Docker build instructions do not apply to this directory.

- Preserve the existing public URLs, biography, publication data, CV, and assets.
- Keep the six published research projects and the unpublished trust project distinct.
- Never publish the template's fictional content or invent research claims.
- Use `npx --yes pnpm@11.16.0` when pnpm is not installed globally.
- Before committing, run `pnpm verify` and inspect desktop and mobile pages.
- `public/assets/` is generated from the original root `assets/` directory.
- Deployment still builds `site/dist` into the existing `gh-pages` branch.
- Git history and the root Jekyll source provide rollback; do not overwrite unrelated changes.

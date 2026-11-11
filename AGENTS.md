# AGENTS.md

Notes for AI agents and helpers working in this repo.

- Site content is in `site/`. `site/index.html` is a single self-contained file. Keep it that way.
- No third-party requests (CDNs, analytics, Google Fonts). The CSP in `site/_headers` blocks them on purpose.
- Keep content wholesome and honest. Workshop log entries are real events only.
- Deploy is Cloudflare Pages direct upload (project `brewdadlabs-site`, production branch `main`). Pushing does not deploy.
- Preview first (`--branch preview`), get Randy's OK, then deploy `--branch main`.
- Never commit API tokens, account IDs, zone IDs, DNS record IDs or other infrastructure identifiers. This repo is public.
- Do not touch mail-related DNS records or the existing redirect rules when working on this site.
- Update `docs/AI_HANDOFF.md` and `docs/AI_CHANGELOG.md` with every change.

- The StinkDoku tester page lives at `site/beta/` (served as `/beta/`). There is no email signup. `functions/_middleware.js` is only for serving `/beta/` at the root of `beta.brewdadlabs.com` once that domain is attached. Preview deploys use `--branch beta-preview` (or another non-`main` branch). Never deploy `--branch main` without Randy's OK. Do not attach `beta.brewdadlabs.com` or change DNS without his OK. Do not change play.stinkdoku.com (that host is the live game only). Do not delete the unused `stinkdoku-android-testers` D1 databases; they are just unbound.

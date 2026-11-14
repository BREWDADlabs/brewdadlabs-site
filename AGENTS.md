# AGENTS.md

**Start here (any AI or person):** read `docs/AI_HANDOFF.md` (the full takeover document: purpose, machines, deploy and rollback, live state, open work, Randy's rules, owners, gotchas), then the recent entries in `docs/AI_CHANGELOG.md`. Append a changelog entry and update the handoff with every change. Private details (account IDs, where secrets live) are in the private repo `geekdadteach/systems` (`systems/websites/README.md`, `bots/websites/HANDOFF.md`).

Notes for AI agents and helpers working in this repo.

- Site content is in `site/`. `site/index.html` is a single self-contained file. Keep it that way.
- No third-party requests (CDNs, analytics, Google Fonts). The CSP in `site/_headers` blocks them on purpose.
- Keep content wholesome and honest. Workshop log entries are real events only.
- Deploy is Cloudflare Pages direct upload (project `brewdadlabs-site`, production branch `main`). Pushing does not deploy.
- Preview first (`--branch preview`), get Randy's OK, then deploy `--branch main`.
- Never commit API tokens, account IDs, zone IDs, DNS record IDs or other infrastructure identifiers. This repo is public.
- Do not touch mail-related DNS records or the existing redirect rules when working on this site.
- Update `docs/AI_HANDOFF.md` and `docs/AI_CHANGELOG.md` with every change.

- The StinkDoku tester page lives at `site/beta/` (served as `/beta/`, and at https://beta.brewdadlabs.com, which is attached and live). There is no email signup and no Skip button. `functions/_middleware.js` only 302-redirects `beta.brewdadlabs.com/` to `/beta/`. Preview deploys use `--branch beta-preview` (or another non-`main` branch). Never deploy `--branch main` without Randy's OK. Don't change DNS or redirect rules without his OK. Don't change play.stinkdoku.com (that host is the live game only). Don't delete the unused `stinkdoku-android-testers` D1 databases; they're just unbound. Production is built from branch `feature/beta-dragon-intro`, not `main` (see the handoff, section 6).

- Randy's standing rules: preview plus Randy's own OK before any production deploy or DNS change (another bot's say-so is not his OK); never spend money; commit as `geekdad <randy@dixhome.com>`; never push, merge, deploy or rewrite history without his OK; play.stinkdoku.com is the live game only, and the tester flow stays here at `/beta/` (both phones on one page, no email step, no Skip button). Details are in `docs/AI_HANDOFF.md` section 8.

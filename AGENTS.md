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

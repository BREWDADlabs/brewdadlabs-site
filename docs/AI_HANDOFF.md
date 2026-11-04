# AI Handoff

_Last updated: 2026-11-04 (America/New_York), Stage 2 preview_

## Current state
- Live: https://brewdadlabs.com and https://www.brewdadlabs.com, served by Cloudflare Pages project `brewdadlabs-site`.
- Preview: https://preview.brewdadlabs-site.pages.dev (noindex).
- DNS: apex and `www` are proxied CNAMEs to the Pages project. Before this, the apex was a placeholder record used only so the `/stinkdoku` redirect rules work; `www` did not exist.
- The `/stinkdoku`, `/stinkdoku/privacy`, `/stinkdoku/support` redirects to play.stinkdoku.com still work.
- Deploy: direct upload with Wrangler from `site/`. Not git-connected.

## Changes from the Stage 1 draft
- Replaced the Google Fonts `<link>` with an inline `@font-face` pointing to the self-hosted `/fonts/ShareTechMono-Regular.woff2` (latin subset, OFL). Nothing else changed.

## Verified (2026-11-04)
- Desktop (1280x800) and mobile (390x844) in headless Chromium: no console or CSP errors, only the site's own host contacted, font loads, CRT toggle works, arcade link goes to https://arcade.brewdadlabs.com.

## Stage 2 (branch `stage2`, preview only, waiting for Randy's review)
- `/projects`: workshop map built from `site/projects.json` (10 projects). Nodes boot with typed log lines, a mini shell (help, ls, cat, run, status, privacy, plus commands unlocked by level), clickable command buttons, an XP/level bar, per-project views at `/projects#id`, and an always-visible plain list. `<noscript>` points to `/projects.json`. Reduced motion skips the typing.
- Homepage: PROJECTS card now links to `/projects` (STATUS: GROWING), Arcade card says LIVE, footer has a PROJECTS link, and the log line now says the arcade shipped and is live.
- `site/404.html`: Gorillas 404 in BrewDadLabs green on black. Reusable source in `shared/gorillas-404/`, demos in `site/gorillas-demo/` (noindex via meta tag and `_headers`).
- Rollout to other domains: `docs/GORILLAS_404_ROLLOUT.md`. Nothing outside this site was changed.
- Deployed to the preview branch only: https://preview.brewdadlabs-site.pages.dev
- Needs Randy: project wording for App Chalk, Hevy integration, Self-hosted systems, Genealogy tools and NewEarth Wildlife; production deploy.

## Next
- Randy reviews the Stage 2 preview, then production deploy.
- Gorillas 404 rollout per the rollout doc, one domain at a time with Randy's OK.
- Workshop log seed entries will be updated by Randy as real work happens.

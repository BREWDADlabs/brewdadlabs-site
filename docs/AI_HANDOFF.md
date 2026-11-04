# AI Handoff

_Last updated: 2026-11-04 (America/New_York)_

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

## Next
- Stage 2: project showcase and project pages.
- Workshop log seed entries will be updated by Randy as real work happens.

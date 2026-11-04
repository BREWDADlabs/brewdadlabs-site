# AI Handoff

_Last updated: 2026-11-04 (America/New_York), Stage 2 project wording approved by Randy_

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

## Stage 2 (branch `stage2`)
- `/projects`: workshop map built from `site/projects.json` (8 projects: 5 live, 2 growing, 1 in the workshop = 20 XP, WORKSHOP LVL 3; `coffee` and `bananas` unlocked, `crt` at LVL 4, `fortune` at 5, `party` at 6 still locked). Nodes boot with typed log lines, a mini shell (help, ls, cat, run, status, privacy, plus commands unlocked by level), clickable command buttons, an XP/level bar, per-project views at `/projects#id`, and an always-visible plain list. `<noscript>` points to `/projects.json`. Reduced motion skips the typing.
- Homepage: PROJECTS card now links to `/projects` (STATUS: GROWING), Arcade card says LIVE, footer has a PROJECTS link, and the log line now says the arcade shipped and is live.
- `site/404.html`: Gorillas 404 in BrewDadLabs green on black. Reusable source in `shared/gorillas-404/`, demos in `site/gorillas-demo/` (noindex via meta tag and `_headers`).
- Rollout to other domains: `docs/GORILLAS_404_ROLLOUT.md`. Nothing outside this site was changed.
- Live in production since 2026-11-04 5:08 PM ET (preview checked first at https://preview.brewdadlabs-site.pages.dev). Verified on brewdadlabs.com: `/`, `www`, `/projects` (8 nodes), `/nope-xyz` (404 + game), `/stinkdoku` still 302s to play.stinkdoku.com, arcade.brewdadlabs.com still 200.
- Known: there is no favicon, so browsers log one 404 for `/favicon.ico` (served the 404 page). Harmless.
- Randy's review (2026-11-04 5:03 and 5:05 PM ET): App Chalk and Hevy integration removed from the list. StinkDoku: free forever, ad-free, a gift for his wife, playable on the web now, fully open source before it goes live on the App Store (coming soon). NewEarth Wildlife: Compsognathus and Stegosaurus, Java and Bedrock, public once it's working; facts taken from the NewEarthWildlife repo README/main branch, nothing invented. Don't claim "no tracking/telemetry" for StinkDoku.
- Self-hosted systems and Genealogy tools wording is unchanged from the draft.

## Arcade link in footers (branch `arcade-nav`, preview only)
- Homepage footer now starts with ARCADE (https://arcade.brewdadlabs.com); /projects footer is HOME, ARCADE, GITHUB. Companion to the arcade's new header/footer links back here (arcade repo branch `nav-home`).
- Preview: https://preview.brewdadlabs-site.pages.dev. Not in production yet, not pushed.

## Next
- Gorillas 404 rollout per the rollout doc, one domain at a time with Randy's OK.
- Workshop log seed entries will be updated by Randy as real work happens.

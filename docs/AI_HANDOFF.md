# AI Handoff

_Last updated: 2026-11-10 ~10:47 PM ET (America/New_York): StinkDoku tester page is live at https://brewdadlabs.com/beta/

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
- Favicon: `site/favicon.ico` (16/32/48), `favicon-32.png`, `apple-touch-icon.png` (180); linked from index, /projects, and 404.
- Randy's review (2026-11-04 5:03 and 5:05 PM ET): App Chalk and Hevy integration removed from the list. StinkDoku: free forever, ad-free, a gift for his wife, playable on the web now, fully open source before it goes live on the App Store (coming soon). NewEarth Wildlife: Compsognathus and Stegosaurus, Java and Bedrock, public once it's working; facts taken from the NewEarthWildlife repo README/main branch, nothing invented. Don't claim "no tracking/telemetry" for StinkDoku.
- Self-hosted systems and Genealogy tools wording is unchanged from the draft.

## Favicon (LIVE)
- Source: Randy-approved neon-green "b" face logo on `#020303` (`#00ff9c`).
- Assets under `site/`: `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`. Linked from `index.html`, `projects.html`, and `404.html`.
- `/favicon.ico` is a real image now (no longer falls through to the Gorillas 404 HTML).

## Arcade link in footers (LIVE)
- Homepage footer now starts with ARCADE (https://arcade.brewdadlabs.com); /projects footer is HOME, ARCADE, GITHUB. Companion to the arcade's header/footer links back here (arcade repo, now on `main`).
- **Live in production** on brewdadlabs.com (and the arcade's links back are live on arcade.brewdadlabs.com). Rechecked 2026-11-05 8:10 PM ET: the served homepage is byte-identical to `site/index.html` on `main` (55ef3fa), and its footer has the ARCADE link. `main` is pushed (origin/main = 55ef3fa). The `arcade-nav` branch is merged and can be deleted.

## Gorillas 404 for the other domains (prepared 2026-11-05, nothing deployed)
- New configs in `shared/gorillas-404/configs/`: `arcade.json`, `stinkdoku.json`, `stinkdoku-play.json`. `newearth.json` now uses the NewEarth site's real cream/grass/sky palette (was a dark guess).
- Built copies for each site are on the Mac at `/Users/test/sites/handoff/gorillas-404/<site>/` (and on the box at `/workspace/handoff/gorillas-404/`). Status and ship checklist per domain: `docs/GORILLAS_404_ROLLOUT.md`.
- Tested locally (headless Chrome, 1280x800 and 390x844) under each site's real CSP: status 404, game loads, a throw runs, no CSP errors, no other hosts contacted. stinkydragon.com fails under its current `script-src 'none'` as expected and passes with the proposed `script-src 'self'`.

## Next
- Gorillas 404 rollout per the rollout doc, one domain at a time with Randy's OK (builds are ready).
- Favicon is live (Randy thumbs-upped the draft 2026-11-05).
- Workshop log seed entries will be updated by Randy as real work happens.

## StinkDoku beta tester page (LIVE, moved to /beta/)
- Path: `/beta/` → `site/beta/index.html`. `/stinkdoku-beta` 302s to `/beta` (already live on the apex and www; the domain did not serve a stale copy). Does not collide with `/stinkdoku` (still 302 → play.stinkdoku.com).
- APK at `/stinkdoku.apk` unchanged and still live in production (9,817,282 bytes).

## StinkDoku Android APK (LIVE)
- https://brewdadlabs.com/stinkdoku.apk (also on www): `site/stinkdoku.apk`, served as `application/vnd.android.package-archive` with `Content-Disposition: attachment; filename="StinkDoku.apk"` via `site/_headers`.
- To ship a new build, replace `site/stinkdoku.apk` (keep the name), deploy preview then `main`, and recheck the headers with curl.
- Kept at the site root on purpose: `/stinkdoku` and `/stinkdoku/*` are redirect rules to play.stinkdoku.com.

## StinkDoku tester page at /beta/ (LIVE, 2026-11-10 ~10:47 PM ET)
- Path: `/beta/` → `site/beta/index.html`, plus `site/beta/tester.js` and `site/beta/art/`. The terminal look from draft PR geekdadteach/stinky-dragons#59 is kept (CRT chrome, scanlines, red eye, boot animation that always plays, reduced motion honored). There is no email signup and no skip-animation button. The page goes straight to the boot animation, then the iPhone and Android sections.
- After the boot animation, iPhone and Android are both on the same page, in that fixed order, with equal weight. Each section has its own big buttons and its own per-step localStorage progress, so a tester can do both. The page does not guess or reorder by phone type, and there are no switch-platform buttons.
- iPhone: install TestFlight, open https://testflight.apple.com/join/M6JnK4b1, open StinkDoku.
- Android: join https://groups.google.com/g/stinkdoku-testers (address shown), opt in at the Play testing URL, install from the Play store listing. Auto-advance when the tester comes back to the tab, with an "I did this, next" fallback. Same-account / 14-day / 12-tester rules are on the Android section. A small "Can't use Google Play?" link goes to `/stinkdoku.apk`.
- Feedback: "Tell us what's fun, what's confusing, and what breaks." TestFlight, Google Play, or support@brewdadlabs.com.
- Privacy lead: "No ads. No in-app purchases. Online features use a random player id and device id." No absolute no-tracking claims.
- Dragon moments use StinkDoku Design's web-animations-v1 WebP sprite sheets (green `dragon-03-lavender-green` only; idle, placed, fly-in, kick-impact-fx, stink-puff, stink-puff-cloud, cheer). A small vanilla JS/CSS player in `site/beta/dragon-player.js` follows each clip's JSON `meta.sequence`. Sheets lazy-load after the terminal boot. They never block buttons (`pointer-events: none`). Under `prefers-reduced-motion` they are off (no stills). The terminal boot intro is unchanged (a separate intro scene is coming later).
  - **Preview only (this change):** fly-in kicks a sudoku tile at `impactFrame` with `kick-impact-fx`; a bottom pop-up plays placed → idle → stink-puff + stink-puff-cloud (a fart puff from under the tail, never fire); green cheer plays when a tester finishes the iPhone or Android section.
  - Production (deployment `3123393b-57c7-4bcd-a7fe-113fc3bc2d66`, source `b1b2486`) still has the two old static-sprite moments until Randy OKs a main deploy.
  - Header mascot remains `public/art/mascot-head.webp` from `stinky-dragons` `origin/main`. The old static `dragon-04` / `dragon-06` files were removed from `/beta/` on this branch.
- Email signup was removed (Randy, 10:44 PM ET: he doesn't want the email that badly). `functions/api/tester-signup.js` is gone, so `/api/tester-signup` should 404. The D1 databases `stinkdoku-android-testers` and `stinkdoku-android-testers-preview` still exist and were not deleted; they are just unbound. `wrangler.toml` is committed and has no D1 bindings. `functions/_middleware.js` remains for the planned beta subdomain.
- `/stinkdoku-beta` points at `/beta` via `site/_redirects` (302) and a short fallback page.
- `beta.brewdadlabs.com` is prepared but not attached. `functions/_middleware.js` will serve `/beta/` at the subdomain root once the domain exists. Do not add the custom domain or DNS until Randy approves.
- play.stinkdoku.com is the live game only. It was not changed. Draft PR #59 stays a draft; a comment notes the move to brewdadlabs.
- **Live in production** on https://brewdadlabs.com/beta/ and https://www.brewdadlabs.com/beta/ (Randy OK 10:46 PM ET: "make it live and send me a link. I don't need to see it first." Email-removed version only). Production deployment `3123393b-57c7-4bcd-a7fe-113fc3bc2d66` (Pages branch `main`, source `b1b2486`). Preview remains at https://beta-preview.brewdadlabs-site.pages.dev/beta/.
- `beta.brewdadlabs.com` is still not attached. Do not add the custom domain or DNS until Randy approves.
- Git: production was a direct Pages upload. The feature branch `feature/android-tester-link` was not merged to `main`; this repo is not git-connected to Pages, and pushing does not deploy.

## Next
- Randy reviews the sprite-sheet dragon preview at https://beta-preview.brewdadlabs-site.pages.dev/beta/. Production is unchanged until he OKs a main deploy.
- Attaching `beta.brewdadlabs.com` is a separate DNS OK (not done).
- Gorillas 404 rollout per the rollout doc, one domain at a time with Randy's OK (builds are ready).
- Workshop log seed entries will be updated by Randy as real work happens.

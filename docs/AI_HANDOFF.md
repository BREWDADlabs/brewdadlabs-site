# AI Handoff

_Last updated: 2026-11-11 ~1:21 AM ET (America/New_York): Design's v1.2 dragon intro is live on /beta/, with no Skip button_

## Current state
- Live: https://brewdadlabs.com and https://www.brewdadlabs.com, served by Cloudflare Pages project `brewdadlabs-site`.
- Preview: https://preview.brewdadlabs-site.pages.dev (noindex).
- DNS: apex, `www`, and `beta` are proxied CNAMEs to the Pages project (`brewdadlabs-site.pages.dev`). Before this, the apex was a placeholder record used only so the `/stinkdoku` redirect rules work; `www` did not exist.
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
- Path: `/beta/` → `site/beta/index.html`, plus `site/beta/tester.js`, `site/beta/intro.css`, `site/beta/intro.js`, `site/beta/assets/`, and `site/beta/art/`. The terminal look from draft PR geekdadteach/stinky-dragons#59 is kept for the iPhone and Android steps (CRT chrome, scanlines, red eye). There is no email signup and no skip-animation button. StinkDoku Design's v1.2 dragon intro plays at the top in place of the old terminal boot. Under `prefers-reduced-motion` the composed still is shown with the CTA already visible.
- Under the intro, iPhone and Android are both on the same page, in that fixed order, with equal weight. Each section has its own big buttons and its own per-step localStorage progress, so a tester can do both. The page does not guess or reorder by phone type, and there are no switch-platform buttons.
- iPhone: install TestFlight, open https://testflight.apple.com/join/M6JnK4b1, open StinkDoku.
- Android: join https://groups.google.com/g/stinkdoku-testers (address shown), opt in at the Play testing URL, install from the Play store listing. Auto-advance when the tester comes back to the tab, with an "I did this, next" fallback. Same-account / 14-day / 12-tester rules are on the Android section. A small "Can't use Google Play?" link goes to `/stinkdoku.apk`.
- Feedback: "Tell us what's fun, what's confusing, and what breaks." TestFlight, Google Play, or support@brewdadlabs.com.
- Privacy lead: "No ads. No in-app purchases. Online features use a random player id and device id." No absolute no-tracking claims.
- Production still uses the two static-sprite dragon moments on step changes (`art/dragon-04-aqua-red-orange.webp` pops up and kicks a tile; `art/dragon-06-sky-orange-peach.webp` flies over and kicks a tile). They never block buttons and are off under reduced motion. Header mascot remains `public/art/mascot-head.webp` from `stinky-dragons` `origin/main`.
- A separate unapproved preview of sprite-sheet moments (`694ec5f`, `dragon-player.js`) lives only on `feature/android-tester-link` and the `beta-preview` Pages alias. This branch does not include it.
- Email signup was removed (Randy, 10:44 PM ET: he doesn't want the email that badly). `functions/api/tester-signup.js` is gone, so `/api/tester-signup` should 404. The D1 databases `stinkdoku-android-testers` and `stinkdoku-android-testers-preview` still exist and were not deleted; they are just unbound. `wrangler.toml` is committed and has no D1 bindings. `functions/_middleware.js` 302-redirects `beta.brewdadlabs.com/` to `/beta/`.
- `/stinkdoku-beta` points at `/beta` via `site/_redirects` (302) and a short fallback page.
- `beta.brewdadlabs.com` is attached to Pages project `brewdadlabs-site` (Randy OK 11:09 PM ET). DNS record `5127a5daaef2499d036d1a463062f50f`: proxied CNAME `beta.brewdadlabs.com` → `brewdadlabs-site.pages.dev`. No other DNS, mail, redirect, or page-rule changes. Pages domain status is `active`; host verification and Google SSL validation are both `active`.
- play.stinkdoku.com is the live game only. It was not changed. Draft PR #59 stays a draft; a comment notes the move to brewdadlabs.
- **Live in production** on https://brewdadlabs.com/beta/, https://www.brewdadlabs.com/beta/, and https://beta.brewdadlabs.com/ (Randy OK 10:46 PM ET to publish `/beta/`; 11:09 PM ET to attach the subdomain, including the later root hotfix; 1:17 AM ET on 2026-11-11 to put Design's intro on the live page and remove Skip). Current production deployment `f592f017-9cf2-448f-9162-4ccb5f483f36` (Pages branch `main`, source `c49b7b6` on `feature/beta-dragon-intro`, which is `829b9fb` plus the v1.2 intro and the Skip-button removal).
- **Subdomain root (fixed 11:15 PM ET):** `functions/_middleware.js` 302-redirects `https://beta.brewdadlabs.com/` (and `/?…`) to `/beta/` (query string kept). Share https://beta.brewdadlabs.com/ — it lands on `/beta/` with the intro, scripts, and assets loading.
- Git: production was a direct Pages upload. Neither `feature/android-tester-link` nor `feature/beta-dragon-intro` is merged to `main`; this repo is not git-connected to Pages, and pushing does not deploy.

## StinkDoku /beta/ animated dragon intro (LIVE, 2026-11-11 ~1:21 AM ET)
- Branch `feature/beta-dragon-intro`, started from production commit `829b9fb` in a separate worktree. It does not include `694ec5f`.
- Replaces only the terminal boot animation at the top of `/beta/` with StinkDoku Design's v1.2 intro. Files: `site/beta/intro.css`, `site/beta/intro.js`, and `site/beta/assets/` (1,254,418 bytes / 1.196 MB after the Skip-button removal). Design's assets were copied unchanged (no `preview.mp4` or `stills/`). The only edits to Design's `intro.js` / `intro.css` were removing the Skip button, the Escape listener, and the `.sd-intro-skip` CSS. The `skip()` method remains so returning testers can jump to the settled still.
- The intro mounts in `#stinkdoku-intro` under the header. Its "Become a tester" button scrolls to `#tester-steps`, the existing iPhone and Android sections on the same page. There is no signup endpoint and no email step.
- Those sections stay visible in the existing terminal chrome while the intro plays. "Start over" replays the intro and resets step progress. Returning testers with saved progress jump the intro to its settled state.
- `prefers-reduced-motion: reduce` shows `assets/reduced-motion.webp` (the family scene with the five dragons on the frame) with the StinkDoku mark and CTA already visible.
- There is no Skip button and no Escape skip. Randy asked to remove it before going live.
- The small static-sprite pop/fly moments on step changes are unchanged.
- Live deployment `f592f017-9cf2-448f-9162-4ccb5f483f36` from commit `c49b7b6`. Preview alias (now also without Skip): https://dragon-intro-preview.brewdadlabs-site.pages.dev/beta/ ; latest preview hash https://6e7c914a.brewdadlabs-site.pages.dev/beta/.

## Next
- The older sprite-sheet moment preview (`694ec5f`) remains on `feature/android-tester-link` / https://beta-preview.brewdadlabs-site.pages.dev/beta/ and is not for production until Randy OKs it.
- Gorillas 404 rollout per the rollout doc, one domain at a time with Randy's OK (builds are ready).
- Workshop log seed entries will be updated by Randy as real work happens.

# AI Handoff

_Last updated: 2026-11-10 ~9:45 PM ET (America/New_York): StinkDoku beta page preview adds two-platform feedback; production unchanged_

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

## StinkDoku beta tester page (LIVE)
- Path: `/stinkdoku-beta` → `site/stinkdoku-beta.html` (Cloudflare Pages pretty URL). Does not collide with `/stinkdoku` (still 302 → play.stinkdoku.com).
- Content: short beta intro; iOS TestFlight `https://testflight.apple.com/join/M6JnK4b1`; Android download `/stinkdoku.apk` with install-unknown-apps steps. Matches homepage CSS (Share Tech Mono, `#00ff9c`, grid background, card layout). `noindex` meta.
- APK at `/stinkdoku.apk` unchanged and still live in production.
- **Live in production** on brewdadlabs.com and www (Randy OK 2026-11-09 ~7:38 PM ET). Preview still at https://preview.brewdadlabs-site.pages.dev/stinkdoku-beta.

## StinkDoku Android APK (LIVE)
- https://brewdadlabs.com/stinkdoku.apk (also on www): `site/stinkdoku.apk`, served as `application/vnd.android.package-archive` with `Content-Disposition: attachment; filename="StinkDoku.apk"` via `site/_headers`.
- To ship a new build, replace `site/stinkdoku.apk` (keep the name), deploy preview then `main`, and recheck the headers with curl.
- Kept at the site root on purpose: `/stinkdoku` and `/stinkdoku/*` are redirect rules to play.stinkdoku.com.

## StinkDoku beta page → Google Play tester page (PREVIEW ONLY, 2026-11-10)
- Branch `feature/android-tester-link`. Android card on `site/stinkdoku-beta.html` sends testers to `https://play.stinkdoku.com/android-tester` (now a combined iPhone + Android guided page on PR #59; still 404 in production until that PR merges). The APK download stays as a small "Can't use Google Play?" sideload fallback. The iPhone card still has the direct TestFlight link `https://testflight.apple.com/join/M6JnK4b1`, plus a secondary "Open the tester page" link to the same guided page.
- Added a short two-platform feedback block (matches the existing theme): "We want honest feedback"; iPhone: TestFlight (screenshot or Send Beta Feedback); Android: Google Play; or email support@brewdadlabs.com; plus "Tell us what's fun, what's confusing, and what breaks."
- Preview: https://android-tester.brewdadlabs-site.pages.dev/stinkdoku-beta (Pages branch preview `android-tester`). Production (`main`, live `/stinkdoku-beta`) is unchanged.
- **Ship order:** the play.stinkdoku.com tester page (stinky-dragons branch `feature/android-tester-page`, PR #59) must be live first, otherwise the guided-page buttons 404. Then, with Randy's OK, merge this branch and deploy `--branch main`.

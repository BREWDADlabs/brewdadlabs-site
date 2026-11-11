# AI Changelog

## 2026-11-10 ~11:13 PM ET, Websites bot (attach beta.brewdadlabs.com)
- **Goal:** Randy approved (11:09 PM ET) adding `beta.brewdadlabs.com` pointing at the live StinkDoku tester page.
- **Files:** docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md. No site, Function, or production deploy.
- **Summary:** Confirmed production deployment `3123393b-57c7-4bcd-a7fe-113fc3bc2d66` (source `b1b2486`) already includes `functions/_middleware.js` (`uses_functions: true`). Added custom domain `beta.brewdadlabs.com` to Pages project `brewdadlabs-site`. Cloudflare did not auto-create DNS, so a new proxied CNAME was added in zone `0133a73c604aecf068da3b4e4ca6018b`: `beta.brewdadlabs.com` → `brewdadlabs-site.pages.dev` (record `5127a5daaef2499d036d1a463062f50f`). Mail records, existing records, redirect rules, and page rules were not changed. play.stinkdoku.com was not touched. No production redeploy; the `beta-preview` branch was not touched.
- **Tests:** `https://beta.brewdadlabs.com/` 200, title "StinkDoku — Become a tester", iPhone and Android sections present, no email field. `https://beta.brewdadlabs.com/beta/` 200, same page, and `tester.js` plus dragon/mascot art load. `https://beta.brewdadlabs.com/stinkdoku.apk` 200, `application/vnd.android.package-archive`, `Content-Disposition: attachment; filename="StinkDoku.apk"`, 9,817,282 bytes. `https://brewdadlabs.com/` still the workshop homepage; `https://brewdadlabs.com/beta/` unchanged tester page; play.stinkdoku.com still the live game. HTTPS on the new host is served by the zone Universal SSL wildcard (Let's Encrypt, SAN `*.brewdadlabs.com`).
- **Unexpected:** The subdomain root rewrite serves the `/beta/` HTML, but relative assets (`tester.js`, `art/*`) 404 at `https://beta.brewdadlabs.com/tester.js` and `/art/...` (Gorillas 404). Share `https://beta.brewdadlabs.com/beta/` or `https://brewdadlabs.com/beta/` until a later production deploy fixes paths. Pages domain status was still `pending` (host verification `active`, Google certificate validation `pending`) a few minutes after attach; the site already answers over HTTPS via the wildcard cert.
- **Deploy:** none. DNS only.
- **Rollback:** delete the Pages custom domain `beta.brewdadlabs.com` and DNS record `5127a5daaef2499d036d1a463062f50f`. Do not touch other records.

## 2026-11-10 ~11:10 PM ET, Websites bot (sprite-sheet dragon moments on /beta/, preview only)
- **Goal:** Replace the two static-sprite dragon moments on `/beta/` with StinkDoku Design's web-animations-v1 sheets, without changing the page or the terminal boot intro.
- **Files:** site/beta/dragon-player.js (new); site/beta/tester.js; site/beta/index.html; site/beta/art/dragon-03-lavender-green/{fly-in,kick-impact-fx,stink-puff,stink-puff-cloud,cheer,idle,placed}_{sheet.webp,sheet.json} (new, 434,947 bytes); site/beta/art/dragon-04-aqua-red-orange.webp and dragon-06-sky-orange-peach.webp (removed, 92,714 bytes); docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Summary:** After the existing terminal boot, the page lazy-loads the green dragon sheets and plays them with a CSS background sprite player driven by JSON timing. Fly-in kicks a tile at impactFrame with kick-impact-fx; the bottom pop-up uses placed, idle, and a stink-puff + cloud (under-tail fart, never fire); cheer plays when an iPhone or Android section is finished. pointer-events stay none. Reduced motion turns the moments off. Unused still PNGs/WebPs and the other eight dragons' idle/placed sheets were not copied.
- **Tests:** preview `/beta/` curl-checked; every new art file 200 with the expected size; production https://brewdadlabs.com/beta/ confirmed unchanged (still the static-sprite build).
- **Deploy:** Pages branch preview `beta-preview` only (`npx wrangler pages deploy site --project-name brewdadlabs-site --branch beta-preview`). Production not deployed; `main` not merged.
- **Rollback:** redeploy the previous `beta-preview` preview, or revert this commit and redeploy the preview. Production is untouched.


## 2026-11-10 ~10:47 PM ET, Websites bot (StinkDoku /beta/ tester page → production)
- **Goal:** Randy (10:46 PM ET): "make it live and send me a link. I don't need to see it first." Publish the email-removed tester page.
- **Files:** docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md (mark live). Site files unchanged from `b1b2486`.
- **Summary:** production-deployed `site/` to Cloudflare Pages `brewdadlabs-site` branch `main`. Live at https://brewdadlabs.com/beta/ and https://www.brewdadlabs.com/beta/. No email signup. `/stinkdoku-beta` 302s to `/beta`. No DNS change; `beta.brewdadlabs.com` was not attached. play.stinkdoku.com untouched.
- **Tests:** curl live `/beta/` 200 on apex and www (no email field; iPhone and Android sections present; dragon WebPs 200). `/stinkdoku-beta` 302 Location `/beta` on both hosts (no stale cached 200). `/stinkdoku.apk` 200, 9,817,282 bytes, APK content type unchanged. GET `/api/tester-signup` 404; POST to that path 405 with an empty body (no signup Function). play.stinkdoku.com homepage hash unchanged; `/android-tester` still 404.
- **Deploy:** production (`main`), deployment `3123393b-57c7-4bcd-a7fe-113fc3bc2d66`. No DNS/redirect-rule or other-site changes.
- **Rollback:** redeploy the previous production deployment `e85e861a-c64e-42d2-b670-f563a6804b9d` from the Pages dashboard, or redeploy the prior `site/` from `main`.
- **Git:** left `feature/android-tester-link` unmerged. This Pages project is not git-connected; pushing does not deploy, and the docs do not require git `main` to mirror production.


## 2026-11-10 ~10:45 PM ET, Websites bot (remove tester email signup from /beta/, preview only)
- **Goal:** Randy (10:44 PM ET): take the extra email step off; he doesn't want the email that badly.
- **Files:** site/beta/index.html, site/beta/tester.js; functions/api/tester-signup.js (deleted); wrangler.toml (committed, no D1 bindings); wrangler.toml.example (removed); .gitignore; AGENTS.md; docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md. `functions/_middleware.js` unchanged.
- **Summary:** `/beta/` now goes straight to the boot animation, then the iPhone and Android sections. Signup UI, consent text, tester-signup privacy note, and the signup Function are gone, so a later production deploy will not expose `/api/tester-signup`. The unused tester D1 databases were left in place and only unbound. Terminal look, dragons, both phone sections, feedback line, rules, APK fallback, privacy lead, and the `/stinkdoku-beta` redirect are unchanged.
- **Tests:** preview `/beta/` has no email field; preview `/api/tester-signup` is 404; production https://brewdadlabs.com and https://play.stinkdoku.com confirmed unchanged.
- **Deploy:** Pages branch preview `beta-preview` only (`wrangler pages deploy site --project-name brewdadlabs-site --branch beta-preview`). Production not deployed; `main` not merged.
- **Rollback:** redeploy the previous `beta-preview` preview, or revert this commit and redeploy the preview. Production is untouched.
- **Production publish (do not run until Randy OKs):** from `/Users/test/sites/brewdadlabs-site`, `npx wrangler pages deploy site --project-name brewdadlabs-site --branch main`. Then curl https://brewdadlabs.com/beta/ (200, tester page, no email field), https://brewdadlabs.com/api/tester-signup (404), https://brewdadlabs.com/stinkdoku-beta (302 to /beta), https://brewdadlabs.com/stinkdoku.apk (unchanged), https://play.stinkdoku.com/ (unchanged). Attaching beta.brewdadlabs.com is a separate DNS step and still needs his OK.


## 2026-11-10 ~10:30 PM ET, Websites bot (StinkDoku tester page → /beta/ on brewdadlabs, preview only)
- **Goal:** Move the full tester flow (email signup on, iPhone + Android on one page, terminal look kept, two small dragon moments) to brewdadlabs.com/beta, plus a planned beta.brewdadlabs.com subdomain. play.stinkdoku.com stays the live game and is not touched. Preview only.
- **Files:** site/beta/index.html, site/beta/tester.js, site/beta/art/{dragon-04-aqua-red-orange.webp,dragon-06-sky-orange-peach.webp,mascot-head.webp} (new); functions/api/tester-signup.js, functions/_middleware.js (new); site/_redirects (new); site/_headers; site/stinkdoku-beta.html; wrangler.toml.example (new); .gitignore; AGENTS.md; docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md. Local gitignored wrangler.toml holds the D1 bindings.
- **Summary:** `/beta/` is a self-contained copy of the PR #59 terminal tester page, with both phone sections always visible in a fixed order after the boot animation, per-step progress, auto-advance + "I did this, next", the 14-day rules, APK fallback, feedback line, and softened privacy wording. Optional emails go to the preview D1 testers database via a Pages Function (consent, validation, honeypot, rate limit; email + timestamp only). `/stinkdoku-beta` 302s to `/beta`. The beta subdomain is coded (host rewrite at `/`) but DNS is not changed. Two playful dragon animations use public main-branch sprites and never block buttons; they are off under reduced motion.
- **Tests:** preview `/beta/` curl-checked; one signup POST into the preview D1, then that row deleted; production https://brewdadlabs.com/stinkdoku-beta and https://play.stinkdoku.com confirmed unchanged.
- **Deploy:** Pages branch preview `beta-preview` only (`wrangler pages deploy --project-name brewdadlabs-site --branch beta-preview`). Production not deployed; `main` not merged.
- **Rollback:** redeploy the previous `beta-preview` preview, or drop the branch. Production is untouched.
- **Production publish (do not run until Randy OKs):** from `/Users/test/sites/brewdadlabs-site` on a checkout that includes this branch, `npx wrangler pages deploy --project-name brewdadlabs-site --branch main`. Then curl https://brewdadlabs.com/beta/ (200, tester page), https://brewdadlabs.com/stinkdoku-beta (302 to /beta), https://brewdadlabs.com/stinkdoku.apk (unchanged), https://play.stinkdoku.com/ (unchanged). Attaching beta.brewdadlabs.com is a separate DNS step (see the handoff) and still needs his OK.


## 2026-11-09 7:38 PM ET, Websites bot (StinkDoku beta page → production)
- **Goal:** Randy approved ("Perfect, go") — ship `/stinkdoku-beta` to production.
- **Files:** docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md (mark live); site unchanged from preview `5f23e84`.
- **Summary:** production-deployed `site/` to Cloudflare Pages `brewdadlabs-site` branch `main`; pushed local commits to GitHub. `/stinkdoku-beta` live with TestFlight + APK download. APK, `/stinkdoku` redirects, DNS untouched.
- **Tests:** curl live `/stinkdoku-beta` 200 (TestFlight URL + `/stinkdoku.apk` link); `/stinkdoku.apk` 200 with APK headers; `/stinkdoku` 302; homepage 200; www same.
- **Deploy:** production (`main`). No DNS/redirect/other-site changes.
- **Rollback:** redeploy previous production deployment from Pages dashboard, or remove `stinkdoku-beta.html` and redeploy.

## 2026-11-09 7:36 PM ET, Websites bot (StinkDoku beta tester landing page — preview only)
- **Goal:** replace the bare APK link for testers with a short beta landing page that has iOS TestFlight + Android APK download instructions, matching the homepage look (Randy).
- **Files:** site/stinkdoku-beta.html (new); docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Summary:** added `/stinkdoku-beta` (pretty URL from `stinkdoku-beta.html`) with homepage CSS/colors/typography, a short intro, iOS TestFlight link (`https://testflight.apple.com/join/M6JnK4b1`), and Android download to `/stinkdoku.apk` plus install steps. Did not touch `/stinkdoku` redirects, DNS, the APK file, or `_headers` (existing APK headers still apply). Page has `noindex` meta.
- **Tests:** curl preview `/stinkdoku-beta` (200, contains TestFlight URL and `/stinkdoku.apk` link); curl preview `/stinkdoku.apk` still 200; production left alone.
- **Deploy:** preview branch only. No production deploy, no git push, no DNS/redirect changes.
- **Rollback:** delete `site/stinkdoku-beta.html` and redeploy preview, or leave until Randy approves production.


## 2026-11-04
- Stage 1 homepage added at `site/index.html`; self-hosted Share Tech Mono in `site/fonts/` (OFL) instead of Google Fonts.
- Added `site/_headers` (CSP, nosniff, Referrer-Policy, X-Frame-Options DENY; noindex on `*.pages.dev` only).
- Created Cloudflare Pages project `brewdadlabs-site`; deployed preview, verified, then production.
- Pointed brewdadlabs.com and www.brewdadlabs.com at the Pages project (replaced the apex placeholder, added `www`). Redirect rules unchanged.
- Added README, AGENTS.md and these docs.

## 2026-11-04 4:35 PM ET, GitHub bot
- **Goal:** publish the brewdadlabs.com source as the public repo BREWDADlabs/brewdadlabs-site, at Randy's request.
- **Summary:** first pushed as f43d749 with the author set to the GitHub noreply address. At 4:38 PM ET, Randy said all commits should be authored as `geekdad <randy@dixhome.com>`, so with his OK I amended the single commit back to that author and force-pushed it over main. The files are unchanged except for this entry.
- **Tests:** scanned all tracked files for secrets, infrastructure IDs and personal emails. Clean.
- **Deploy:** none. The site is deployed separately (Cloudflare Pages direct upload, Websites bot), so pushes don't deploy.
- **Rollback:** revert the commit. The replaced public commit was f43d749.

## 2026-11-04 evening ET, Websites bot (Stage 2 preview)
- **Goal:** Stage 2 project showcase that grows as projects are added, plus a reusable Gorillas 404 for all our domains.
- **Summary:** added `site/projects.html` and `site/projects.json` (workshop map, mini shell, XP/levels, plain list); linked it from the homepage and fixed the arcade log line; added `shared/gorillas-404/` (canonical page, configs, `build.py`, README), `site/404.html` and `site/gorillas-demo/`; added `docs/GORILLAS_404_ROLLOUT.md`; `_headers` gets noindex for `/gorillas-demo/*`.
- **Tests:** headless Chromium at 1280x800 and 390x844 on local and on the preview: no CSP errors, no third-party requests, all projects shown, shell and buttons work, missing paths return the 404 game with status 404 and a throw works, demos show their own branding. The `--split` build was also tested under a strict `script-src 'self'; style-src 'self'` policy.
- **Deploy:** preview branch only. No production deploy, no DNS changes, no push.
- **Rollback:** delete the `stage2` branch; production is untouched.

## 2026-11-04 5:10 PM ET, Websites bot (Stage 2 project list per Randy)
- **Goal:** apply Randy's review of the Stage 2 project list and ship Stage 2.
- **Summary:** removed App Chalk and Hevy integration from `site/projects.json`; rewrote StinkDoku (coming to the App Store, fully open source before it goes live there) and NewEarth Wildlife (Compsognathus and Stegosaurus, Java and Bedrock, public once it's working). 8 projects, 20 XP, still WORKSHOP LVL 3, so the unlocked commands (coffee, bananas) and locked ones (crt, fortune, party) are unchanged.
- **Tests:** headless Chromium at 1280x800 and 390x844: 8 map nodes and 8 plain-list items, level and XP correct, unlocked commands run and locked ones say locked, `cat hevy`/`cat chalk` are gone, `/nope-xyz` returns 404 with a playable Gorillas game, no third-party requests, no console errors other than the expected 404.
- **Deploy:** preview first, then production (`main`) at 5:08 PM ET, verified live (same checks on brewdadlabs.com, plus www, `/stinkdoku` 302 and the arcade). No DNS, zone or other-site changes. The only other 404 in the console is `/favicon.ico` (no favicon yet).
- **Rollback:** redeploy the previous production deployment from the Pages dashboard, or revert this commit and redeploy `site/`.

## 2026-11-04 6:27 PM ET, Websites bot (ARCADE footer link, preview)
- **Goal:** two-way link between brewdadlabs.com and the arcade (Randy: "no clear way back to the main page").
- **Files:** site/index.html, site/projects.html, docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md
- **Summary:** added an ARCADE link to the homepage and /projects footers.
- **Tests:** headless Chromium at 1280x800 and 390x844 on the preview: footer links correct, no third-party requests; only console error is the known /favicon.ico 404 on the homepage.
- **Deploy:** preview branch only. No production deploy, no push.
- **Rollback:** delete branch `arcade-nav`.

## 2026-11-05 8:25 PM ET, Websites bot (docs: arcade link live; Gorillas 404 builds for the other domains)
- **Goal:** Randy: fix notes that still said the arcade nav was "preview only"; roll the Gorillas 404 out everywhere.
- **Files:** docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md, docs/GORILLAS_404_ROLLOUT.md, shared/gorillas-404/README.md, shared/gorillas-404/configs/{arcade,stinkdoku,stinkdoku-play}.json (new), shared/gorillas-404/configs/newearth.json (real site palette).
- **Summary:** the ARCADE footer link is live (served homepage matches `main` 55ef3fa). Built Gorillas 404 copies for arcade, NewEarth, stinkdoku.com, play.stinkdoku.com and stinkydragon.com; rollout doc now has a live 404 inventory and a ship checklist per domain.
- **Tests:** headless Chrome 1280x800 and 390x844 under each site's CSP: 404 status, game loads and throws, no CSP errors, no other hosts. stinkydragon fails under `script-src 'none'` as expected.
- **Deploy:** none. `site/` is unchanged.

## 2026-11-05 8:48 PM ET, Websites bot (favicon)
- **Goal:** wire Randy's thumbs-upped favicon into the main site and ship it (he originally asked to create it on the main site).
- **Files:** site/favicon.ico, site/favicon-32.png, site/apple-touch-icon.png (new); site/index.html, site/projects.html, site/404.html (link tags); docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Summary:** converted the approved JPG into multi-size ICO (16/32/48) plus 32 PNG and 180 apple-touch; linked them on the homepage, /projects (replaced the blank `data:,` icon), and 404. Preview deploy first, curl-verified `/favicon.ico` returns an image, then production.
- **Tests:** `file` on assets; curl preview `/favicon.ico` (image, not 404 HTML); curl live `/favicon.ico` and homepage link tags after production.
- **Deploy:** preview then production (Pages project `brewdadlabs-site`). No DNS/zone changes. Bundle for GitHub bot (do not push from here).
- **Rollback:** redeploy previous production deployment, or remove the favicon files/link tags and redeploy `site/`.


## 2026-11-09 5:58 PM ET, Websites bot (StinkDoku Android APK download)
- **Goal:** make the StinkDoku Android APK (`com.brewdadlabs.stinkdoku`) downloadable from brewdadlabs.com with a direct link for Android phones, at Randy's request.
- **Summary:** added `site/stinkdoku.apk` (9,817,282 bytes, sha256 `b908b8276d9ba4e8e3a55905d9a3f5f03a71e9ac86b0839f76879debaf6ea565`) and a `/stinkdoku.apk` rule in `site/_headers` (Content-Type `application/vnd.android.package-archive`, `Content-Disposition: attachment; filename="StinkDoku.apk"`, short cache). Site-wide headers unchanged. Kept at the root so it does not hit the `/stinkdoku/*` redirect rules.
- **Tests:** preview and production: `/stinkdoku.apk` returns 200 with the APK content type, the attachment filename and the full file (hash matches) on brewdadlabs.com and www. `/stinkdoku` still 302s to play.stinkdoku.com; homepage still 200.
- **Deploy:** preview, then production (`main`). No DNS, redirect-rule or other-site changes.
- **Rollback:** delete `site/stinkdoku.apk` and its `_headers` block, then redeploy `site/`, or redeploy the previous production deployment from the Pages dashboard.

## 2026-11-10 3:35 PM ET, Websites bot (beta page → Android tester page, preview only)
- **Goal:** point the StinkDoku beta page's Android card at the new Google Play tester page on play.stinkdoku.com (Randy approved the tester automation; preview only).
- **Files:** site/stinkdoku-beta.html; docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Summary:** Android card now says ANDROID // GOOGLE PLAY with a "BECOME AN ANDROID TESTER" button to `https://play.stinkdoku.com/android-tester`; the APK link is kept as a one-line sideload fallback. Meta description updated. No CSP or header change.
- **Deploy:** Pages branch preview `android-tester` only. Production not deployed; `main` not pushed.
- **Rollback:** drop the branch.

## 2026-11-10 ~9:45 PM ET, Websites bot (beta page feedback ask, preview only)
- **Goal:** add a short two-platform feedback ask to the StinkDoku beta page, and a secondary iPhone link to the combined tester page (Randy, 9:33 PM ET). Preview only.
- **Files:** site/stinkdoku-beta.html; docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Summary:** new "We want honest feedback" block under the install cards: iPhone → TestFlight feedback (screenshot or Send Beta Feedback); Android → Google Play feedback; or email support@brewdadlabs.com; plus "Tell us what's fun, what's confusing, and what breaks." iPhone card keeps the direct TestFlight join link and adds a secondary "Open the tester page" link to `https://play.stinkdoku.com/android-tester`. Theme, TestFlight URL, Android Play button, and APK fallback unchanged.
- **Deploy:** Pages branch preview `android-tester` only (`wrangler pages deploy --branch android-tester`). Production not deployed; `main` not pushed.
- **Rollback:** redeploy the previous `android-tester` preview, or drop the branch.

## 2026-11-10 ~9:45 PM ET, Websites bot (soften beta-page privacy wording, preview only)
- **Goal:** separate wording change for Randy to approve. The beta page lead made an absolute privacy claim ("no trackers, no accounts"). Soften it; do not claim no tracking or no telemetry.
- **Files:** site/stinkdoku-beta.html; docs/AI_HANDOFF.md, docs/AI_CHANGELOG.md.
- **Before:** "This page is for beta testers. Pick your phone, install the build, and play. No ads, no trackers, no accounts."
- **After:** "This page is for beta testers. Pick your phone, install the build, and play. No ads. No in-app purchases. Online features use a random player id and device id."
- **Checked:** that was the only absolute no-tracking / no-telemetry / no-accounts claim on `/stinkdoku-beta`. The Google Play card's "Google account" line is about using the same Play account for the test, and was left alone. No changes to play.stinkdoku.com / PR #59.
- **Deploy:** Pages branch preview `android-tester` only. Production not deployed; `main` not pushed.
- **Rollback:** revert this commit and redeploy the `android-tester` preview.

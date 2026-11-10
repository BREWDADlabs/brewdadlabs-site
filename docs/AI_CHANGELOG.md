# AI Changelog

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

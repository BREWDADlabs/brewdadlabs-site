# AI Changelog

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


# Gorillas 404 rollout plan

The reusable page lives in `shared/gorillas-404/` (see its README). This is the status and ship checklist for each of our domains.

**Every deploy below needs Randy's OK.** Builds are prepared and tested locally; nothing new has been deployed. Built copies are on the Mac at `/Users/test/sites/handoff/gorillas-404/` and on the box at `/workspace/handoff/gorillas-404/`.

To check any site after rollout: open a made-up path like `/bananas-xyz`. The game should appear, the network tab should show status 404, and there should be no console or CSP errors.

## Status (live check 2026-11-05 8:07 PM ET, `curl https://<host>/bananas-xyz-404test`)

| Domain | Hosting | Live 404 today | CSP | Variant / config | Status |
|---|---|---|---|---|---|
| brewdadlabs.com, www | Pages `brewdadlabs-site` | 404 + Gorillas | allows inline | single file, `brewdadlabs.json` | **Live** (since 2026-11-04) |
| dixhome.com, www | Worker `dix-homeschool` (static assets) | 404 + Gorillas (the original) | none | original page | **Live** (unchanged) |
| arcade.brewdadlabs.com | Pages `brewdadlabs-arcade` | **200 with the arcade page** (no 404.html, Pages falls back to index) | allows inline | single file, `arcade.json` | Ready: arcade repo branch `gorillas-404` |
| newearth.graphitenerd.com | Pages `graphitenerd-shiloh` (with Functions) | 404, own "Page not found" page | `script-src 'self'` (+ Turnstile), `style-src 'self'` | `--split`, `newearth.json` (site's cream/grass/sky palette) | Ready: deploy tree on the box |
| graphitenerd.com, www | redirect rule | 301 to newearth | n/a | n/a | Nothing to do (covered by newearth) |
| stinkdoku.com, www | Pages `stinkdoku-site` | 404, own "Lost in the den" page | `script-src 'self'`, `style-src 'self'` | `--split`, `stinkdoku.json` | Ready: stinkdoku-site branch `gorillas-404` |
| play.stinkdoku.com | Worker `stinky-dragons` (static assets) | **404 with an empty body** | none on 404 | single file, `stinkdoku-play.json` | Patch ready; needs the game repo owner's deploy |
| stinkydragon.com | Pages `stinkydragon` (empty, previews deleted 2026-10-28) | 301 to Instagram (site not live) | `script-src 'none'` in the prepared site | `--split`, `stinkydragon.json` | Prepared only; needs Randy's CSP decision and the site go-live |
| invoices.stinkydragon.com | Worker (invoices app) | 404 empty body | app | n/a | Not proposed (private app, not a public site) |

All builds were tested locally in headless Chrome at 1280x800 and 390x844 under each site's real CSP: status 404, the game loads, a throw runs, no CSP errors, no other hosts contacted. stinkydragon fails under its current `script-src 'none'` (as expected) and passes with `script-src 'self'`.

## Ship checklist per domain

Deploys run on Randy's Mac mini with Node from `/Users/test/sites/stinkydragon/.node/bin` and the Cloudflare token loaded in the same command (never echoed; pipe output through `grep -v -i token`).

### arcade.brewdadlabs.com
1. Repo `brewdadlabs-arcade`, branch `gorillas-404` (adds `site/404.html`).
2. `npx wrangler pages deploy site --project-name brewdadlabs-arcade --branch preview`; check https://preview.brewdadlabs-arcade.pages.dev/bananas-xyz (404 + game) and that `/` still works.
3. With Randy's OK: same with `--branch main`; check arcade.brewdadlabs.com/bananas-xyz. Merge the branch to `main`.
4. Rollback: redeploy the previous deployment from the Pages dashboard.

### newearth.graphitenerd.com
1. Box: `/workspace/handoff/gorillas-404/newearth-deploy/` is a copy of the current production tree (`/workspace/graphitenerd/newearth/`: `site/` + `functions/`, checked against live: index, 404, stats, css, js match) with the split 404 added (`site/404.html`, `site/gorillas-404/`).
2. Deploy from that folder so `functions/` is included (live uses /api Functions): `cd newearth-deploy && npx wrangler pages deploy site --project-name graphitenerd-shiloh --branch draft`; check https://draft.graphitenerd-shiloh.pages.dev/bananas-xyz and that `/api/forms` still answers.
3. With Randy's OK: same with `--branch main`. Then copy the two new paths into `/workspace/graphitenerd/newearth/site/`.
4. Copy rule: the page says "NewEarth" only (no "Graphite Nerd", no names).

### stinkdoku.com
1. Repo `geekdadteach/stinkdoku-site` (box `/workspace/stinkdoku-site`), branch `gorillas-404` (commit c42ba62). `build.py` now generates the 404 from the vendored kit; only the 404 files change.
2. Copy the branch's `site/` to the Mac (or deploy from the box), `--branch preview`, check https://preview.stinkdoku-site.pages.dev/bananas-xyz.
3. With Randy's OK: `--branch main`, merge the branch, push.

### play.stinkdoku.com
1. Patch in `/Users/test/sites/handoff/gorillas-404/play-stinkdoku/`: add `public/404.html` and `not_found_handling = "404-page"` under `[assets]` in `wrangler.toml`. All Worker routes are under `/api/*` (`run_worker_first`), so the API is unaffected.
2. Apply to the exact commit that is live on the Worker (the game repo has many branches), deploy with `wrangler versions upload` first and test the preview URL, then promote with Randy's OK.

### stinkydragon.com
1. The prepared site's CSP is `script-src 'none'`, so no game can run. Option A: keep the hand-made 404. Option B (prepared): change the site CSP to `script-src 'self'` and use the split build. Proposed full site: `/Users/test/sites/handoff/gorillas-404/stinkydragon-site-proposed/`.
2. The site itself is not live (apex 301s to Instagram, previews deleted). This waits on Randy (and the shop owner) for the site go-live and the CSP choice.

### dixhome.com
Already live with the original. Optional later: swap in a build of `configs/dixhome.json` (same storage key, scores carry over). A push to `main` there auto-deploys.

## Rollback
Pages: redeploy the previous deployment from the dashboard, or redeploy the old `404.html`. Workers: `wrangler versions deploy <previous-version>@100%`, then revert the commit.

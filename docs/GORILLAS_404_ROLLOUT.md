# Gorillas 404 rollout plan

The reusable page lives in `shared/gorillas-404/` (see its README). This is the plan for putting it on each of our domains.

**Every step below needs Randy's OK before it happens.** Nothing outside brewdadlabs.com has been changed. Demos for the other sites are at `/gorillas-demo/` on the brewdadlabs preview (noindex).

To check any site after rollout: open a made-up path like `/bananas-xyz`. The game should appear, the browser network tab should show status 404, and there should be no console or CSP errors.

| Domain | Hosting | Current 404 | CSP | Variant | Status |
|---|---|---|---|---|---|
| brewdadlabs.com | Cloudflare Pages (`brewdadlabs-site`) | none before Stage 2 | allows inline | single file, `configs/brewdadlabs.json` | Done on the preview branch; goes live with the Stage 2 production deploy |
| arcade.brewdadlabs.com | Cloudflare Pages | not checked | same as brewdadlabs | single file | Proposed |
| newearth.graphitenerd.com | Cloudflare Pages (`graphitenerd-shiloh`) | not checked | `script-src 'self'` (plus Cloudflare challenges), `style-src 'self'` | `--split`, `configs/newearth.json` | Proposed |
| dixhome.com | Cloudflare Worker with static assets (`dix-homeschool`) | **already has Gorillas** (the original) | none | optional: swap in `configs/dixhome.json` | Optional |
| stinkydragon.com | Cloudflare Pages (`stinkydragon`) | its own 404 | `script-src 'none'`, `style-src 'self'` | `--split` **plus** a header change | Needs a decision |
| stinkdoku.com | Cloudflare Pages (`stinkdoku-site`) | its own 404 | `script-src 'self'`, `style-src 'self'` | `--split` | Needs a decision |

## Per domain

### brewdadlabs.com
`site/404.html` is built from `configs/brewdadlabs.json` (green on black, Share Tech Mono, links to Projects and the Arcade). Pages serves it automatically. It goes live when Stage 2 is deployed to production.

### arcade.brewdadlabs.com
1. Build: `python3 build.py configs/brewdadlabs.json <arcade repo>/404.html` (or a copy of the config with `"siteName": "BrewDadLabs Arcade"` and `"homeUrl": "/"`).
2. Copy the font file to the same path, or drop `fontFamily`/`fontUrl` from the config.
3. Preview deploy, test, then production with Randy's OK.

### newearth.graphitenerd.com
1. Build the split variant: `python3 build.py configs/newearth.json <site output> --split`. This writes `404.html` and `/gorillas-404/*`.
2. The existing CSP allows `'self'` scripts and styles, so no header change should be needed. Confirm on a preview deploy.
3. Pick the colours with Randy; the demo palette is a guess.

### dixhome.com
Already running the original Gorillas 404 through `assets.not_found_handling: "404-page"`. Nothing needs to change. If we want it on the shared code, replace its `404.html` with a build of `configs/dixhome.json` (same look, same storage key, so saved scores carry over). A push to `main` in the dixhome repo auto-deploys, so do it on a branch and get Randy's OK first.

### stinkydragon.com
The site's CSP is `script-src 'none'`, so **no** script runs on any page, including a 404. Options:
- keep the current hand-made 404 (no change), or
- add `script-src 'self'` to the header for the whole site (Pages applies headers by the requested path, so a 404-only rule isn't possible), then deploy the `--split` build of `configs/stinkydragon.json`.
This is Randy's (and the shop owner's) call.

### stinkdoku.com
It already has its own 404. The CSP allows `'self'` scripts and styles, so the `--split` build would work without header changes. Only replace it if Randy wants to. It would need a config with StinkDoku colours (not written yet).

## Rollback
Pages: redeploy the previous deployment from the dashboard, or redeploy the old `404.html`. Worker: revert the commit and let it auto-deploy.

# AI Handoff: brewdadlabs-site (brewdadlabs.com)

_Last full rewrite: 2026-11-13, about 11:00 PM America/New_York, by the Websites bot, on Randy's order that any AI must be able to take over immediately with nothing left out. Live facts below were re-checked read-only that evening (curl and `wrangler`). Nothing was deployed while writing this._

**If you are taking over:** read this whole file, then `AGENTS.md`, then the last few entries of `docs/AI_CHANGELOG.md`. Appendix A at the bottom keeps the previous handoff text word for word. If the appendix and the sections above it disagree, the sections above it win, because they are newer.

This repo is **public**. Do not commit Cloudflare account IDs, zone IDs, DNS record IDs, tokens, or home public IP addresses here. Those details (names only for secrets) live in the private repo `geekdadteach/systems`, under `systems/websites/README.md` and `bots/websites/HANDOFF.md`.

---

## 1. Purpose

- brewdadlabs.com is the home page of **BrewDadLabs**, Randy's "independent developer, husband and homeschooling dad" workshop brand. The voice is "people before profit, built at home".
- The site has:
  - a retro terminal-style home page (`/`)
  - a growing "workshop map" of projects (`/projects`)
  - a Gorillas game as the 404 page
  - the **StinkDoku beta tester page** at `/beta/`, also reachable as https://beta.brewdadlabs.com
  - the StinkDoku Android APK download at `/stinkdoku.apk`
- StinkDoku is Randy's first game (more games are planned). It's free forever, with no ads, and was made as a gift for his wife. The game itself is **not** in this repo. It lives at https://play.stinkdoku.com (Worker `stinky-dragons`, repo `geekdadteach/stinky-dragons`, owned by the **Stinkdoku** bot).

## 2. Machines, hosts, users and paths

| What | Where |
| --- | --- |
| Working machine | Randy's Mac mini **.20** (`Randys-Mac-mini.local`, LAN 192.168.1.20, macOS user `test`). Randy MM 20 owns this machine. Websites works only in its own site folders there. |
| Main checkout | `/Users/test/sites/brewdadlabs-site` (currently on branch `feature/android-tester-link`) |
| Other worktrees | `/Users/test/sites/brewdadlabs-site-dragon-intro` (`feature/beta-dragon-intro`, **what production is built from**), `/Users/test/sites/brewdadlabs-site-hotfix-beta-root` (`hotfix/beta-subdomain-root`), `/Users/test/sites/takeover/brewdadlabs-site` (`websites/takeover-handoff`, this doc) |
| GitHub | https://github.com/BREWDADlabs/brewdadlabs-site (public, org BREWDADlabs) |
| Old git bundles | `/Users/test/sites/handoff/*.bundle` (copies made for the GitHub bot before pushes were allowed) |
| Box copies | Websites' own Linux box sometimes has scratch copies under `/workspace/` (for example `/workspace/handoff/gorillas-404/`). The Mac is the source of truth. |
| Node / wrangler | `/opt/homebrew/bin/node` (v26), `npx wrangler` (4.x). If Homebrew Node ever breaks, use the spare Node at `/Users/test/sites/stinkydragon/.node/bin` (put it first on `PATH`). |

There are **no services, daemons, cron jobs, launchd jobs or ports** for this site. It is static files plus one Pages Function, all served by Cloudflare. Nothing runs on the Mac for it.

## 3. Hosting and external services

- **Cloudflare Pages** project `brewdadlabs-site`, production branch `main`. It uses **direct upload** and is **not Git-connected**, so a `git push` does not deploy anything. Production is whatever was last uploaded with `--branch main`.
- Custom domains on the project: `brewdadlabs.com`, `www.brewdadlabs.com`, `beta.brewdadlabs.com` (all proxied CNAMEs to `brewdadlabs-site.pages.dev`).
- The `brewdadlabs.com` zone is in Randy's Cloudflare account (Free plan). The domain expires 2027-05-06, and **auto-renew is off** (Randy's call; don't change it).
- **Zone redirect rules (Single Redirects).** These are not in this repo. They live in the Cloudflare dashboard, under brewdadlabs.com → Rules → Redirect Rules:
  - `StinkDoku privacy`: `/stinkdoku/privacy` → 302 https://play.stinkdoku.com/privacy
  - `StinkDoku support`: `/stinkdoku/support` → 302 https://play.stinkdoku.com/support
  - `StinkDoku share link`: `/stinkdoku` and `/stinkdoku/*` → 302 https://play.stinkdoku.com/ (keep it after the two above)
  - `arpanet1914 HTTP to HTTPS (Social AI tunnel)`: belongs to the social bot's tunnel. Not ours, so leave it alone.
- **Other DNS in the zone that is not this site's, so leave it alone:**
  - `arcade` → Pages `brewdadlabs-arcade` (Websites' arcade site, separate repo)
  - `arpanet1914` and `win2status` → Cloudflare Tunnels (other bots; `win2status` answered 530 on 2026-11-13)
  - **iCloud Mail** records: MX `mx01/mx02.mail.icloud.com`, SPF TXT, `apple-domain` TXT, `sig1._domainkey` CNAME, and a Cloudflare `cf2024-1._domainkey` TXT. Randy said (2026-11-03) to keep brewdadlabs.com mail on iCloud and **never touch** these. Cloudflare Email Routing was turned on 2026-11-02 with a catch-all to randy@dixhome.com, but the iCloud MX bypasses it. It's harmless and was left in place.
- **Email addresses shown on the site:** support@brewdadlabs.com (iCloud mail).
- **Apple TestFlight** public link for StinkDoku iOS: https://testflight.apple.com/join/M6JnK4b1
- **Google Play closed testing** for StinkDoku Android (`com.brewdadlabs.stinkdoku`). Testers join the Google Group https://groups.google.com/g/stinkdoku-testers (stinkdoku-testers@googlegroups.com), then opt in and install from Play. Personal Play developer accounts need **12 testers opted in for 14 days** for each new app. Organization accounts are exempt, but Randy decided (2026-11-13) not to form an LLC just for that, since the games are free. He is hoping to find testers on Reddit (r/AndroidClosedTesting, r/TestMyApp).
- **D1 databases** `stinkdoku-android-testers` and `stinkdoku-android-testers-preview` exist from the abandoned email-signup idea. They are **unbound and unused. Do not delete them** without Randy's OK.
- There are no env vars, secrets or bindings on this Pages project (checked 2026-11-13).

## 4. Repo layout

- `site/`: everything that is served.
  - `index.html`: the single-file home page. Edit its `LOG` array for the workshop log.
  - `projects.html` + `projects.json`: the `/projects` workshop map. Data is in `projects.json` only. See README "Add a project".
  - `404.html`: the Gorillas 404 (built from `shared/gorillas-404/`).
  - `gorillas-demo/`: noindex demos of the 404 for other domains.
  - `beta/`: the StinkDoku tester page (`index.html`, `tester.js`, `intro.css`, `intro.js`, `assets/` from StinkDoku Design's v1.2 intro, `art/` dragon sprites).
  - `stinkdoku-beta.html`: an old fallback page. `/stinkdoku-beta` 302s to `/beta` via `site/_redirects`.
  - `stinkdoku.apk`: the Android APK (9,817,282 bytes, sha256 `b908b8276d9ba4e8e3a55905d9a3f5f03a71e9ac86b0839f76879debaf6ea565`).
  - `_headers`: CSP and security headers, the APK MIME type and attachment filename, and `noindex` on `*.pages.dev`.
  - `_redirects`: the `/stinkdoku-beta` → `/beta` 302.
  - `fonts/`: Share Tech Mono, self-hosted, OFL.
  - `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`: the mint "b" BrewDadLabs mark that Randy approved.
- `functions/_middleware.js`: on host `beta.brewdadlabs.com` only, path `/` gets a **302 to `/beta/`** (query kept). This is a redirect, not a rewrite, so relative assets resolve. It does nothing on other hosts.
- `shared/gorillas-404/`: the reusable Gorillas 404 kit (`build.py`, configs per domain). Rollout status is in `docs/GORILLAS_404_ROLLOUT.md`.
- `wrangler.toml`: Pages config (`pages_build_output_dir = "site"`). No bindings.
- `arcade/`, `backups/`: local leftovers and pre-change copies (see the folders).

## 5. Build, run, test, deploy, roll back

There is no build step for the site itself. The only builds:
- The Gorillas 404: `python3 shared/gorillas-404/build.py shared/gorillas-404/configs/brewdadlabs.json site/404.html`
- New StinkDoku APK: replace `site/stinkdoku.apk`, keeping the name.

**Run locally:** `npx wrangler pages dev site` (serves `site/` plus `functions/`), or `python3 -m http.server -d site 8080` for static only.

**Load the Cloudflare token without printing it.** On the Mac it's already exported as `CLOUDFLARE_API_TOKEN` from `~/.zshrc`. The same value is in `/Users/test/.cloudflare_token` (mode 600). Never echo it. Pipe wrangler output through `grep -v -i token`.

```sh
cd /Users/test/sites/brewdadlabs-site-dragon-intro     # or whichever worktree you are shipping
export CLOUDFLARE_ACCOUNT_ID=<Randy's Cloudflare account ID; see geekdadteach/systems>
# 1) Preview (always first). Any non-main branch name works.
npx wrangler pages deploy site --project-name brewdadlabs-site --branch beta-preview 2>&1 | grep -v -i token
#    -> https://beta-preview.brewdadlabs-site.pages.dev/ (and a hash URL)
# 2) Show Randy the preview URL and wait for HIS OK (not another bot's).
# 3) Production:
npx wrangler pages deploy site --project-name brewdadlabs-site --branch main 2>&1 | grep -v -i token
```

**Test after any deploy** (all of these should hold):
```sh
for u in / /beta/ /projects /stinkdoku.apk /nope-xyz; do curl -s -o /dev/null -w "$u %{http_code}\n" https://brewdadlabs.com$u; done
curl -sI https://beta.brewdadlabs.com/ | grep -i -E '^(HTTP|location)'        # 302 -> /beta/
curl -sI https://brewdadlabs.com/stinkdoku | grep -i location                   # play.stinkdoku.com
curl -sI https://brewdadlabs.com/stinkdoku.apk | grep -i -E 'content-(type|length|disposition)'
```
Expected (2026-11-13): `/` 200, `/beta/` 200, `/projects` 200, `/stinkdoku.apk` 200 `application/vnd.android.package-archive` 9817282 bytes with `attachment; filename="StinkDoku.apk"`, `/nope-xyz` 404 (Gorillas), beta root 302 to `/beta/`, `/stinkdoku-beta` 302 to `/beta`, and `/stinkdoku` 302 to https://play.stinkdoku.com/. For page changes, also check headless Chrome at 1280x800 and 390x844 for no console or CSP errors and no third-party requests.

**Roll back:**
- Cloudflare dashboard → Workers & Pages → `brewdadlabs-site` → Deployments → pick the earlier production deployment → "Rollback to this deployment", or
- check out the earlier commit and redeploy `site/` with `--branch main`.

Production history (newest first):
- `f592f017` (c49b7b6, dragon intro with no Skip, **live**)
- `3123393b` (b1b2486, first /beta/ with no email)
- `e85e861a` (a5ccc1a, /stinkdoku-beta)
- `efbca23c` (APK)
- Older ones are in the changelog.

## 6. Current live state (checked 2026-11-13 ~11 PM ET)

- **Production deployment:** `f592f017-9cf2-448f-9162-4ccb5f483f36`, Pages branch `main`, source commit `c49b7b6` on branch `feature/beta-dragon-intro`, deployed about 1:21 AM ET on 2026-11-11.
- **Git does not match production on `main`:**
  - `origin/main` is still `a5ccc1a` (the 2026-11-09 /stinkdoku-beta page).
  - The production code is on the unmerged branches below. All of them are pushed to GitHub except `websites/takeover-handoff`.
- **Branches:**

  | Branch | Head | What it is |
  | --- | --- | --- |
  | `main` | a5ccc1a | Last merged state (Stage 2, favicon, APK, /stinkdoku-beta) |
  | `feature/android-tester-link` | 18d339b | /beta/ tester page history, plus the **unshipped** sprite-sheet dragon preview `694ec5f` (`site/beta/dragon-player.js`), plus the beta-root hotfix cherry-pick |
  | `hotfix/beta-subdomain-root` | 829b9fb | b1b2486 + the middleware 302 fix |
  | `feature/beta-dragon-intro` | 9399440 | 829b9fb + Design's v1.2 intro + Skip removal + docs. **Production is c49b7b6 on this branch.** |
  | `websites/takeover-handoff` | (this commit) | feature/beta-dragon-intro + these takeover docs |
  | `stage2`, `arcade-nav` | local only | Already shipped and merged; safe to delete with Randy's OK |

  Recommended merge order (Randy's OK needed): merge `feature/beta-dragon-intro` (or this branch) into `main` so `main` matches production. Do **not** merge `feature/android-tester-link` as is, because it carries the unapproved `694ec5f` sprite preview.
- **Preview aliases still up:**
  - https://dragon-intro-preview.brewdadlabs-site.pages.dev/beta/ (same as production)
  - https://beta-preview.brewdadlabs-site.pages.dev/beta/ (the unapproved `694ec5f` sprite-sheet moments)
  - https://preview.brewdadlabs-site.pages.dev (older)

### The StinkDoku tester page (`/beta/`), as Randy specified it
- One page with **iPhone first, then Android**, in a fixed order, with equal weight. There are no "switch platform" buttons, and the page doesn't guess the phone type, because some testers will do both (Randy, 2026-11-10).
- **No email signup step** (Randy, 2026-11-10 10:44 PM ET). There is no signup Function.
- **No Skip button and no Escape-key skip** on the intro (Randy, 2026-11-11 1:17 AM ET, relayed by StinkDoku Design with his words quoted).
- At the top is **StinkDoku Design's v1.2 animated dragon intro**, which replaced the old terminal boot. Randy said on 2026-11-10 "we can get rid of the terminal animation at the beginning let's do something different", and on 2026-11-11 1:02 AM ET "Looks good, put it on the beta page".
  - The steps below the intro keep the green terminal look.
  - The intro's "Become a tester" button scrolls to `#tester-steps`.
  - Under reduced motion it shows a still with the CTA visible.
  - Returning testers jump to the settled still.
- Small static-sprite dragon moments play on step changes: dragon-04 pops up and kicks a tile, and dragon-06 flies over and kicks a tile. They never block buttons and are off under reduced motion.
- Feedback line: "Tell us what's fun, what's confusing, and what breaks." It points to TestFlight feedback, Google Play feedback, or support@brewdadlabs.com.
- Privacy lead: "No ads. No in-app purchases. Online features use a random player id and device id." **Do not** add "no tracking" or "no telemetry" claims for StinkDoku.
- Per-section localStorage progress, auto-advance when the tester returns to the tab, "I did this, next", Back, and Start over. A small "Can't use Google Play?" link goes to `/stinkdoku.apk`.

## 7. Open work, known bugs, next steps

1. **The `694ec5f` sprite-sheet dragon preview** (`dragon-player.js`, WebP sprite sheets) is **not approved**. Randy hearted the preview message, but a heart is not an OK. Ship it only if Randy explicitly says so.
2. **Make `main` match production.** This needs Randy's OK to merge or push (see branches above).
3. **Gorillas 404 rollout:**
   - Done: arcade, NewEarth, stinkdoku.com and stinkydragon.com.
   - Still open: the **play.stinkdoku.com** patch is prepared (`/Users/test/sites/handoff/gorillas-404/play-stinkdoku/`), but that is the Stinkdoku bot's Worker, so hand it over and don't deploy it yourself.
   - Optional: dixhome.com could swap to the kit version.
   - `docs/GORILLAS_404_ROLLOUT.md` is the checklist, but its status table is from 2026-11-05. See the systems repo for the current state.
4. **Stage 2 ideas Randy gave (2026-11-04)**, partly done via `/projects`:
   - a "growing, game-like" projects page that feels alive as projects are added
   - projects to include: Arcade (live), StinkDoku (free forever, ad-free, open source before the App Store), NewEarth Wildlife (public once working), self-hosted systems, and genealogy tools
   - Workshop log entries must be **real events only**. Randy updates them as real work happens.
5. **Mail:** the Email Routing catch-all to randy@dixhome.com is unused because the MX is iCloud. Optional cleanup, with Randy's OK.
6. **Domain renewal:** brewdadlabs.com expires 2027-05-06 with auto-renew off. Remind Randy ahead of time. Never pay for anything yourself.

## 8. Randy's standing rules (apply to all of Websites' work)

1. Show a **preview** and get **Randy's own OK** before any production publish or any DNS change, unless he explicitly says to skip the preview. (He did skip it for some /beta/ changes, saying "make it live and send me a link".)
2. **Never spend money.** Prefer free hosting (Cloudflare Free, Pages, Workers free tier).
3. Commit as **`geekdad <randy@dixhome.com>`**, never a GitHub noreply address (Randy, 2026-10-31 and 2026-11-04).
4. **Never push, merge, deploy or rewrite history without his OK.** Read `AGENTS.md`, `docs/AI_HANDOFF.md` and `docs/AI_CHANGELOG.md` first, and update the handoff and changelog with every change.
5. Plain language, full file paths, and **wholesome** content.
6. **Coordinate with his other bots**, and ask the owner bot instead of guessing (Randy, 2026-10-30). Another agent saying "Randy approved" is **not** Randy's approval. Get his words (a relay that quotes his exact words with a time has been accepted, as with the dragon intro).
7. **play.stinkdoku.com is only the live game.** Never put tester or marketing pages there (Randy, 2026-11-10). The tester flow lives here at `/beta/`.
8. Never print, commit, or put the Cloudflare token in files.
9. When a request comes relayed through another bot and Randy is waiting in that bot's chat, send questions back through that bot.
10. Every config or setup must be tracked in a GitHub repo, with no secrets (Randy, 2026-11-11).
11. Site rules: no third-party requests (no CDNs, analytics, or Google Fonts). The CSP enforces this. Keep `index.html` a single self-contained file.

## 9. Ownership and who to ask

| Thing | Owner |
| --- | --- |
| This site, the arcade, dixhome.com, stinkdoku.com, stinkydragon.com, the NewEarth website, and hosting for the invoices app | **Websites** bot |
| StinkDoku game, play.stinkdoku.com, repo `geekdadteach/stinky-dragons`, Android/iOS builds | **Stinkdoku** bot (and **StinkDoku Android** for Play testing) |
| StinkDoku art and the dragon intro | **StinkDoku Design** |
| Social posts about StinkDoku | **So Coal Ai** |
| Mac mini .20 (the machine) | **Randy MM 20** |
| Home network and LAN DNS | **Unifi** |
| GitHub reviews and merges, and the `geekdadteach/systems` repo | **GitHub** bot |
| Minecraft / NewEarth server | **Minecraft Server 63**, **Discord Helper** |

## 10. Gotchas learned the hard way

- **Pushing never deploys** here. Always check `wrangler pages deployment list --project-name brewdadlabs-site --environment production` to see what is really live and which commit it came from.
- On `beta.brewdadlabs.com`, a **rewrite** of `/` to `/beta/` broke relative assets (pictures and scripts 404'd). The middleware must **redirect** (302).
- `/stinkdoku` and `/stinkdoku/*` are zone redirect rules, so anything placed at `site/stinkdoku/...` will never be served. That's why the APK sits at `/stinkdoku.apk` at the root.
- The custom domain can cache the old APK for a while after a deploy. Check with the full-file sha256, not just the status code.
- The Mac's API token can deploy Pages and Workers, but it **cannot read or write DNS records or redirect rules** (it gets an auth error). DNS and rules changes were done through Randy's Cloudflare connector or the dashboard, always with Randy's OK.
- This repo is public. An earlier changelog entry (2026-11-10) mentions a DNS record ID. It's harmless, but don't add more IDs.
- Don't reuse play.stinkdoku.com draft PR #59 (geekdadteach/stinky-dragons, Android tester page). Randy moved the tester flow here, so that PR is superseded.

---

## Appendix A: previous handoff text (kept word for word from 2026-11-11, DNS record ID removed)

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
- `beta.brewdadlabs.com` is attached to Pages project `brewdadlabs-site` (Randy OK 11:09 PM ET). DNS: proxied CNAME `beta.brewdadlabs.com` → `brewdadlabs-site.pages.dev`. No other DNS, mail, redirect, or page-rule changes. Pages domain status is `active`; host verification and Google SSL validation are both `active`.
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

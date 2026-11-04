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

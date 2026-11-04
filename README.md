# BrewDadLabs

The BrewDadLabs workshop homepage: https://brewdadlabs.com

- `site/index.html`: main workshop homepage (Stage 1). Edit the `LOG` array to update the workshop log.
- `site/_headers`: security headers (CSP, nosniff, no framing). `*.pages.dev` hosts get `noindex`.
- `site/fonts/`: Share Tech Mono, self-hosted, SIL Open Font License 1.1 (`OFL.txt`).

The arcade lives at https://arcade.brewdadlabs.com and has its own repo.

## Privacy

No analytics, ads, trackers or accounts. The page makes no third-party requests; the font is served from this site. The CRT toggle and "boot seen" flag are saved only in your browser.

## Deploy

Static single file, no build step. Hosted on Cloudflare Pages (project `brewdadlabs-site`) by direct upload. The project is not connected to this repo, so pushing does not deploy.

```
npx wrangler pages deploy site --project-name brewdadlabs-site --branch preview   # test
npx wrangler pages deploy site --project-name brewdadlabs-site --branch main      # production
```

Check the preview, then deploy to `main`. The domain also has redirect rules (`/stinkdoku/*` to the StinkDoku game); recheck them after any DNS change.

People before profit.

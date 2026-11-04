# BrewDadLabs

The BrewDadLabs workshop homepage: https://brewdadlabs.com

- `site/index.html`: main workshop homepage (Stage 1). Edit the `LOG` array to update the workshop log.
- `site/projects.html` + `site/projects.json`: the Projects workshop map at `/projects` (Stage 2).
- `site/404.html`: the Gorillas 404 game, built from `shared/gorillas-404/` (served automatically by Pages for missing pages).
- `site/gorillas-demo/`: demos of the same 404 configured for our other sites (noindex).
- `shared/gorillas-404/`: the reusable Gorillas 404 and its configs. See its README and `docs/GORILLAS_404_ROLLOUT.md`.
- `site/_headers`: security headers (CSP, nosniff, no framing). `*.pages.dev` hosts get `noindex`.
- `site/fonts/`: Share Tech Mono, self-hosted, SIL Open Font License 1.1 (`OFL.txt`).

The arcade lives at https://arcade.brewdadlabs.com and has its own repo.

## Add a project

All project data lives in `site/projects.json`. To add one, add one entry to the `projects` list. Nothing else needs to change: the map, the terminal, the level bar and the plain list all read this file.

```json
{
  "id": "my-thing",
  "name": "My Thing",
  "description": "One plain sentence about what it is.",
  "status": "workshop",
  "links": [{"label": "Try it", "href": "https://example.com"}],
  "added": "2026-11-04"
}
```

- `id`: short, lowercase, no spaces. It's the terminal name (`cat my-thing`) and the page link (`/projects#my-thing`).
- `status`: `live`, `growing` or `workshop` (shown as IN THE WORKSHOP).
- `links`: optional. Only `https://` or site-relative (`/...`) links are shown.
- `added`: optional date.

The workshop levels up as projects are added: live is worth 3 XP, growing 2, in the workshop 1. Levels unlock small terminal commands. Order in the file is the order on the map.

## Gorillas 404

Rebuild the 404 after changing its config: `python3 shared/gorillas-404/build.py shared/gorillas-404/configs/brewdadlabs.json site/404.html`. The demos are built the same way into `site/gorillas-demo/`.

## Privacy

No analytics, ads, trackers or accounts. The page makes no third-party requests; the font is served from this site. The CRT toggle and "boot seen" flag are saved only in your browser.

## Deploy

Static files, no build step (the 404 is pre-built and committed). Hosted on Cloudflare Pages (project `brewdadlabs-site`) by direct upload. The project is not connected to this repo, so pushing does not deploy.

```
npx wrangler pages deploy site --project-name brewdadlabs-site --branch preview   # test
npx wrangler pages deploy site --project-name brewdadlabs-site --branch main      # production
```

Check the preview, then deploy to `main`. The domain also has redirect rules (`/stinkdoku/*` to the StinkDoku game); recheck them after any DNS change.

People before profit.

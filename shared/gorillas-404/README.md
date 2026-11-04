# Gorillas 404 (reusable)

A remake of the 1991 QBasic *Gorillas* game as a "page not found" page. It started as the dixhome.com 404 and works on any site.

- One self-contained HTML file: inline CSS and JS, canvas graphics, WebAudio sound.
- No external requests: no fonts, images, scripts, analytics or trackers. Scores and settings stay in the visitor's own browser (localStorage).
- Same gameplay as the dixhome original: 1 player vs CPU or 2 players, angle/velocity sliders, typed input, drag to aim, keyboard, touch, sound toggle, "404" spelled out in the skyline.
- Marked `noindex` so search engines don't list it.

## Files

| File | What it is |
|---|---|
| `404.html` | The canonical page. Its config block is empty, so it brands itself from the hostname. |
| `configs/*.json` | Per-site configs (brewdadlabs, dixhome, stinkydragon, newearth, default). |
| `build.py` | Writes a configured copy. Pure Python 3, no dependencies. |

## Configure

Near the top of `404.html` there is a block like this. It is JSON data, not code, so it works under a strict Content Security Policy.

```html
<script type="application/json" id="gorillas-404-config">
{ "siteName": "BrewDadLabs", "homeUrl": "/" }
</script>
```

Every key is optional:

| Key | Default | Meaning |
|---|---|---|
| `siteName` | hostname without `www.` | Shown in the page title and the back link |
| `homeUrl` | `/` | Where "Back home" goes |
| `tagline` | none | One line under the title |
| `links` | none | Up to 6 extra links, `[{"label":"PROJECTS","href":"/projects"}]`. Only `https://`, `http://`, `/` and `#` links are used |
| `quips` | generic banana jokes | Random line in the header |
| `storageKey` | `gorillas-404` | localStorage key for scores and settings |
| `colors` | original EGA blue/cyan | Page chrome: `bg text line title hi accent accentText accentShadow accentHover muted btn bar range danger link dim` (hex) |
| `game` | original EGA palette | Canvas colours: `sky bld[3] win dark sun gor ban exp exp2 white gray yellow cyan` (hex) |
| `fontFamily`, `fontUrl` | Courier | A font file on the same site, e.g. `/fonts/ShareTechMono-Regular.woff2` |

Build a configured copy:

```sh
python3 build.py configs/brewdadlabs.json ../../site/404.html
python3 build.py configs/stinkydragon.json OUTDIR --split   # strict-CSP variant, see below
```

## Drop it in

**Cloudflare Pages:** put the file at `404.html` in the root of the build output. Pages serves it, with status 404, for any path that doesn't exist. No other setting is needed.

**Cloudflare Workers (static assets):** put `404.html` in the assets directory and set this in `wrangler.jsonc`:

```jsonc
"assets": { "directory": "./public", "not_found_handling": "404-page" }
```

This is how dixhome.com already works.

**Anything else:** serve the file for misses with status 404, e.g. nginx `error_page 404 /404.html;`.

## Content Security Policy

The single-file version needs `script-src` and `style-src` to allow `'unsafe-inline'` (brewdadlabs.com and arcade.brewdadlabs.com already allow it; dixhome.com sends no CSP).

For sites with a stricter policy (`script-src 'self'` and `style-src 'self'`), use `--split`. It writes `404.html` plus `/gorillas-404/gorillas-404.css` and `/gorillas-404/gorillas-404.js`, so nothing is inline. The page sets colours with `element.style.setProperty`, which a `style-src 'self'` policy allows.

A site with `script-src 'none'` can't run the game at all until its header allows `'self'` scripts on the 404 page. Note that Pages applies `_headers` rules by the *requested* path, so the 404 page gets whatever headers match the missing URL.

Test hook for automated checks: `window.__gorillas`.

#!/usr/bin/env python3
"""Make a configured copy of the reusable Gorillas 404.

  python3 build.py CONFIG.json OUT.html            # one self-contained file (inline CSS/JS)
  python3 build.py CONFIG.json OUTDIR --split      # OUTDIR/404.html + OUTDIR/gorillas-404/gorillas-404.{css,js}
                                                   # for sites whose CSP has no 'unsafe-inline'

Only the JSON config block changes; the game code is copied as-is from 404.html.
Pure Python 3, no dependencies.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = open(os.path.join(HERE, '404.html'), encoding='utf-8').read()
CFG_RE = re.compile(r'(<script type="application/json" id="gorillas-404-config">\n)(.*?)(\n</script>)', re.S)

def configured(cfg):
    body = json.dumps(cfg, indent=2, ensure_ascii=False).replace('</', '<\\/')
    out, n = CFG_RE.subn(lambda m: m.group(1) + body + m.group(3), SRC)
    assert n == 1, 'config block not found'
    return out

def split(html):
    css = re.search(r'<style>\n(.*?)</style>\n', html, re.S)
    js = re.search(r'<script>\n(.*?)</script>\n', html, re.S)
    assert css and js
    html = html.replace(css.group(0), '<link rel="stylesheet" href="/gorillas-404/gorillas-404.css">\n')
    html = html.replace(js.group(0), '<script src="/gorillas-404/gorillas-404.js"></script>\n')
    return html, css.group(1), js.group(1)

def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    cfg = json.load(open(a[0], encoding='utf-8'))
    html = configured(cfg)
    if '--split' in a:
        html, css, js = split(html)
        os.makedirs(os.path.join(a[1], 'gorillas-404'), exist_ok=True)
        open(os.path.join(a[1], '404.html'), 'w', encoding='utf-8').write(html)
        open(os.path.join(a[1], 'gorillas-404', 'gorillas-404.css'), 'w', encoding='utf-8').write(css)
        open(os.path.join(a[1], 'gorillas-404', 'gorillas-404.js'), 'w', encoding='utf-8').write(js)
    else:
        d = os.path.dirname(a[1])
        if d:
            os.makedirs(d, exist_ok=True)
        open(a[1], 'w', encoding='utf-8').write(html)
    print('wrote', a[1])

if __name__ == '__main__':
    main(sys.argv[1:])

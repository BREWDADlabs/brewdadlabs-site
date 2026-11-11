/* StinkDoku beta intro — canvas flipbook scene (v1.2).
   Usage: StinkDokuIntro.mount('#el', { assetBase: 'assets/', onDone, onCta });
   Requires assets/manifest.js (window.STINKDOKU_INTRO_MANIFEST) or a fetched manifest.json.
*/
(function (root) {
  'use strict';

  const N = 5;
  const CSS_W = 620;
  const CSS_H = 548;
  const CS = 96;
  const BX = 70;
  const BY = 32;
  const FRAME = 12;
  const BOARD_SIZE = CS * 1.22;
  const SOL = [0, 2, 4, 1, 3];
  const REG = [
    [0, 0, 1, 1, 2],
    [0, 1, 1, 2, 2],
    [0, 0, 1, 2, 2],
    [3, 3, 3, 3, 4],
    [3, 4, 4, 4, 4],
  ];
  const COL = ['#edbea5', '#e0d4f3', '#b4e2df', '#f3e7a5', '#c7e8cb'];
  const BORDER = '#244840';
  const BORDER_DARK = '#173f36';

  // Row-major cast. After the reveal they perch on the left/right frame so the
  // family scene can read cleanly. Green flies in last; cyan does the wrong-move fart.
  const CAST = [
    { row: 0, col: 0, slot: 'dragon-02-lime-purple', short: 'purple',
      perch: { x: 32, y: 172, flip: false }, leaveDelay: 0.00, cheerDelay: 0.08,
      sparkle: '#cbb4f0' },
    { row: 1, col: 2, slot: 'dragon-08-mint-pink', short: 'pink',
      perch: { x: 588, y: 172, flip: true }, leaveDelay: 0.10, cheerDelay: 0.16,
      sparkle: '#f3b3c8' },
    { row: 2, col: 4, slot: 'dragon-04-aqua-red-orange', short: 'orange',
      perch: { x: 588, y: 305, flip: true }, leaveDelay: 0.18, cheerDelay: 0.24,
      sparkle: '#f0b070' },
    { row: 3, col: 1, slot: 'dragon-05-rose-cyan', short: 'cyan', wrongCol: 4,
      perch: { x: 26, y: 448, flip: false }, leaveDelay: 0.06, cheerDelay: 0.00,
      sparkle: '#7ed0d4' },
    { row: 4, col: 3, slot: 'dragon-03-lavender-green', short: 'green', hero: true,
      perch: { x: 588, y: 438, flip: true }, leaveDelay: 0.28, cheerDelay: 0.12,
      sparkle: '#8ed5a4' },
  ];

  const T_P = [0.70, 1.40, 2.10];
  const T_WRONG = 2.95;
  const T_FART = 3.50;
  const T_FIX = 4.70;
  const T_FLY = 5.55;
  const FLY_FLAP = 0.996;
  const FLY_GLIDE = 0.300;
  const FLY_LAND = 0.480;
  const FLY_WINDUP = 0.130;
  const T_IMPACT = T_FLY + FLY_FLAP + FLY_GLIDE + FLY_LAND + FLY_WINDUP; // 7.456
  const FLY_LEN = 2.356;
  const FLIP_DUR = 0.58;
  const T_LEAVE = 7.62;
  const LEAVE_DUR = 0.55;
  const T_CHEER = 8.80;
  const CHEER_LEN = 1.33;
  const T_SIT = T_CHEER + CHEER_LEN; // 9.88
  const SIT_LEN = 0.52;
  const T_LOGO = 10.55;
  const T_STORY = 12.00;

  const KICK_TILE = { r: 4, c: 2 };
  const LAND = { r: 4, c: 3 };
  const WRONG = { r: 3, c: 4 };
  const FIX = { r: 3, c: 1 };

  const SR_INTRO = 'A short animated introduction to StinkDoku. Dragons hop onto a five-by-five puzzle. One lands too close to another and makes a stinky puff, then hops to a safe cell. The green dragon flies in and kicks a tile. The tiles flip to reveal a jungle family of dragons, and the puzzle dragons hop to the sides of the frame and cheer.';
  const SR_DONE = 'The jungle family picture is revealed, with the puzzle dragons sitting along the frame. Become a tester to try StinkDoku.';
  const STILL_ALT = 'A jungle family of dragons at sunset, shown on a five-by-five puzzle. Five colorful StinkDoku dragons sit along the left and right edges of the frame, leaving the family picture clear.';

  function prefersReduced() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function rng(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function clipLen(clip) {
    return clip.sequence.reduce((a, s) => a + s.ms, 0) / 1000;
  }

  function seqFrame(clip, t, loop) {
    const s = clip.sequence;
    const tot = clipLen(clip);
    if (t < 0) t = 0;
    if (loop) t = tot > 0 ? t % tot : 0;
    else if (t >= tot) return s[s.length - 1].frame;
    let acc = 0;
    for (let i = 0; i < s.length; i++) {
      acc += s[i].ms / 1000;
      if (t < acc) return s[i].frame;
    }
    return s[s.length - 1].frame;
  }

  function buildFlipStarts() {
    const r = rng(7);
    const start = [];
    let last = T_IMPACT + FLIP_DUR;
    for (let y = 0; y < N; y++) {
      start[y] = [];
      for (let x = 0; x < N; x++) {
        const d = Math.hypot(x - KICK_TILE.c, y - KICK_TILE.r);
        const t = d === 0 ? T_IMPACT : T_IMPACT + 0.14 + d * 0.09 + r() * 0.10;
        start[y][x] = t;
        last = Math.max(last, t + FLIP_DUR);
      }
    }
    return { start, last };
  }

  const FLIPS = buildFlipStarts();

  function cellXY(row, col) {
    return { x: BX + col * CS, y: BY + row * CS };
  }
  function feetXY(row, col) {
    const p = cellXY(row, col);
    return { x: p.x + CS / 2, y: p.y + CS - 4 };
  }

  // Same pixel scale as a 256 px idle drawn at BOARD_SIZE, so green's 224 px
  // fly-in frames do not appear larger than the others.
  function spriteSize(clip) {
    const fw = (clip && clip.frameSize && clip.frameSize.w) || 256;
    return BOARD_SIZE * (fw / 256);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load ' + src));
      img.src = src;
    });
  }

  function join(base, path) {
    if (!base) return path;
    return base.replace(/\/?$/, '/') + path.replace(/^\//, '');
  }

  function mount(target, opts) {
    opts = opts || {};
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error('StinkDokuIntro.mount: target not found');

    const assetBase = opts.assetBase != null ? opts.assetBase : 'assets/';
    const record = opts.record || (typeof location !== 'undefined' && /(?:\?|&)record=1\b/.test(location.search));
    const social = !!(opts.social || (typeof location !== 'undefined' && /(?:\?|&)social=1\b/.test(location.search)));
    const forceMotion = !!(opts.forceMotion || record);
    const reduce = !forceMotion && (opts.reducedMotion === true || (opts.reducedMotion !== false && prefersReduced()));

    el.classList.add('sd-intro');
    el.dataset.mode = reduce ? 'still' : 'motion';
    el.dataset.state = 'loading';
    if (social) el.dataset.social = '1';
    el.dataset.ready = 'false';
    el.innerHTML =
      '<div class="sd-intro-stage">' +
        '<div class="sd-intro-loading">Loading…</div>' +
        '<canvas width="620" height="548" aria-hidden="true"></canvas>' +
        '<img class="sd-intro-still" alt="' + STILL_ALT + '" width="620" height="548">' +
        '<button type="button" class="sd-intro-skip">Skip</button>' +
        '<p class="sd-intro-bubble" hidden></p>' +
        '<div class="sd-intro-end">' +
          '<img alt="" width="56" height="56">' +
          '<div>' +
            '<p class="sd-intro-wordmark">StinkDoku</p>' +
            '<p class="sd-intro-tag">Help us test the game.</p>' +
          '</div>' +
          '<a class="sd-intro-cta" href="' + (opts.ctaHref || '#tester-steps') + '">Become a tester</a>' +
        '</div>' +
      '</div>' +
      '<p class="sd-intro-sr" role="status" aria-live="polite"></p>';

    const canvas = el.querySelector('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    const stillImg = el.querySelector('.sd-intro-still');
    const skipBtn = el.querySelector('.sd-intro-skip');
    const bubble = el.querySelector('.sd-intro-bubble');
    const endEl = el.querySelector('.sd-intro-end');
    const cta = el.querySelector('.sd-intro-cta');
    const iconImg = el.querySelector('.sd-intro-end img');
    const sr = el.querySelector('.sd-intro-sr');

    stillImg.src = join(assetBase, 'reduced-motion.webp');
    iconImg.src = join(assetBase, 'stinkdoku-icon.webp');

    sr.textContent = SR_INTRO;

    let clips = null;
    let images = {};
    let sceneImg = null;
    let ready = false;
    let doneFired = false;
    let playing = false;
    let startTs = 0;
    let time = 0;
    let raf = 0;
    let ro = null;

    function fireDone() {
      if (doneFired) return;
      doneFired = true;
      el.dataset.state = 'settled';
      sr.textContent = SR_DONE;
      if (typeof opts.onDone === 'function') opts.onDone();
      el.dispatchEvent(new CustomEvent('sd-intro-done', { bubbles: true }));
    }

    function showEnd(t) {
      const p = typeof t === 'number' ? clamp((t - T_LOGO) / 0.6, 0, 1) : (t ? 1 : 0);
      endEl.style.opacity = String(p);
      endEl.style.transform = p >= 1 ? 'none' : 'translateY(' + ((1 - p) * 10) + 'px)';
      endEl.style.pointerEvents = (!social && p >= 0.85) ? 'auto' : 'none';
      const skipFade = social ? 0 : (typeof t === 'number' ? 1 - clamp((t - T_LOGO) / 0.25, 0, 1) : (t ? 0 : 1));
      skipBtn.style.opacity = String(skipFade);
      skipBtn.style.visibility = skipFade <= 0 ? 'hidden' : 'visible';
      skipBtn.style.pointerEvents = skipFade <= 0 ? 'none' : 'auto';
    }

    function setBubble(text) {
      if (!text) {
        bubble.classList.remove('is-on');
        bubble.hidden = true;
        bubble.textContent = '';
        return;
      }
      bubble.hidden = false;
      bubble.textContent = text;
      bubble.classList.add('is-on');
    }

    function sizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = record ? 2 : Math.min(2, root.devicePixelRatio || 1);
      const w = Math.max(1, Math.round((rect.width || CSS_W) * dpr));
      const h = Math.max(1, Math.round((rect.height || CSS_H) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return dpr;
    }

    function getClip(slot, clip) {
      return clips[slot + '/' + clip];
    }

    const bboxCache = {};
    let measureCv = null;
    function frameBBox(clip, frame) {
      const key = (clip && clip.id) + ':' + frame;
      if (bboxCache[key]) return bboxCache[key];
      const img = images[clip.id];
      const rec = clip.frames[frame];
      const empty = { w: 0, h: 0 };
      if (!img || !rec) return bboxCache[key] = empty;
      const fw = clip.frameSize.w;
      const fh = clip.frameSize.h;
      if (!measureCv) measureCv = document.createElement('canvas');
      if (measureCv.width !== fw || measureCv.height !== fh) {
        measureCv.width = fw;
        measureCv.height = fh;
      }
      const m = measureCv.getContext('2d');
      m.clearRect(0, 0, fw, fh);
      m.drawImage(img, rec[0], rec[1], fw, fh, 0, 0, fw, fh);
      const data = m.getImageData(0, 0, fw, fh).data;
      let minX = fw, minY = fh, maxX = 0, maxY = 0, found = false;
      for (let y = 0; y < fh; y++) {
        for (let x = 0; x < fw; x++) {
          if (data[(y * fw + x) * 4 + 3] > 16) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return bboxCache[key] = found ? { w: maxX - minX + 1, h: maxY - minY + 1 } : empty;
    }

    function drawSprite(clip, frame, ax, ay, size, alpha, flip, sx, sy) {
      if (alpha <= 0) return;
      const img = images[clip.id];
      if (!img) return;
      const fr = clip.frames[frame];
      if (!fr) return;
      const fw = clip.frameSize.w;
      const scale = size / fw;
      sx = sx == null ? 1 : sx;
      sy = sy == null ? 1 : sy;
      ctx.save();
      ctx.globalAlpha = alpha < 1 ? alpha : 1;
      ctx.translate(ax, ay);
      if (flip) ctx.scale(-1, 1);
      if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        img,
        fr[0], fr[1], fw, clip.frameSize.h,
        -clip.anchor.x * scale, -clip.anchor.y * scale,
        size, size * (clip.frameSize.h / fw)
      );
      ctx.restore();
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }
    }

    function hexToRgb(h) {
      return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    }
    function darken(rgb, f) {
      return [Math.round(rgb[0] * f), Math.round(rgb[1] * f), Math.round(rgb[2] * f)];
    }

    const frontCellCache = {};
    function paintFrontCell(c2, r, c) {
      const col = COL[REG[r][c]];
      c2.fillStyle = col;
      c2.fillRect(0, 0, CS, CS);
      const rgb = hexToRgb(col);
      c2.fillStyle = 'rgba(' + darken(rgb, 0.86).join(',') + ',0.45)';
      c2.beginPath();
      c2.arc(CS / 2, CS / 2, CS * 0.26, 0, Math.PI * 2);
      c2.fill();
    }
    function frontCellCanvas(r, c) {
      const key = r + ',' + c;
      if (frontCellCache[key]) return frontCellCache[key];
      const cv = document.createElement('canvas');
      cv.width = CS;
      cv.height = CS;
      paintFrontCell(cv.getContext('2d'), r, c);
      frontCellCache[key] = cv;
      return cv;
    }

    function drawFrontCell(x, y, r, c) {
      ctx.drawImage(frontCellCanvas(r, c), x, y, CS, CS);
    }

    function drawBackCell(x, y, r, c, pad) {
      if (!sceneImg) return;
      const padPx = pad || 0;
      const sw = sceneImg.width / N;
      const sh = sceneImg.height / N;
      const sx = c * sw - (padPx ? sw / CS * padPx : 0);
      const sy = r * sh - (padPx ? sh / CS * padPx : 0);
      const tw = sw + (padPx ? sw / CS * padPx * 2 : 0);
      const th = sh + (padPx ? sh / CS * padPx * 2 : 0);
      ctx.drawImage(
        sceneImg,
        Math.max(0, sx), Math.max(0, sy),
        Math.min(sceneImg.width - Math.max(0, sx), tw),
        Math.min(sceneImg.height - Math.max(0, sy), th),
        x - padPx, y - padPx, CS + padPx * 2, CS + padPx * 2
      );
    }

    function lerpPt(a, b, u) {
      return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
    }

    // Affine-strip blit so a face maps onto a perspective trapezoid.
    function blitTexturedQuad(img, sx, sy, sw, sh, tl, tr, br, bl, strips) {
      if (sw < 1 || sh < 1) return;
      const n = strips || 28;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.clip();
      for (let i = 0; i < n; i++) {
        const u0 = i / n;
        const u1 = (i + 1) / n;
        const sl = sx + sw * u0;
        const wr = Math.max(1, sw / n);
        const dtl = lerpPt(tl, tr, u0);
        const dtr = lerpPt(tl, tr, u1);
        const dbl = lerpPt(bl, br, u0);
        ctx.save();
        ctx.translate(dtl.x, dtl.y);
        ctx.transform(
          (dtr.x - dtl.x) / wr,
          (dtr.y - dtl.y) / wr,
          (dbl.x - dtl.x) / sh,
          (dbl.y - dtl.y) / sh,
          0, 0
        );
        ctx.drawImage(img, sl, sy, wr, sh, -0.6, 0, wr + 1.4, sh);
        ctx.restore();
      }
      ctx.restore();
    }

    function fillQuad(tl, tr, br, bl, fill) {
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // True-ish 3D card: rotateY with perspective (trapezoid foreshortening)
    // and a visible paper edge at 90° — never a thin squashed bar.
    function drawFlippingTile(x, y, r, c, p) {
      const cx = x + CS / 2;
      const cy = y + CS / 2;
      const angle = ease(p) * Math.PI;
      const thick = 10;
      const persp = CS * 2.05;
      const hx = CS / 2;
      const hy = CS / 2;
      const hz = thick / 2;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);

      function proj(px, py, pz) {
        const xr = px * ca + pz * sa;
        const zr = -px * sa + pz * ca;
        const k = persp / (persp - zr);
        return { x: cx + xr * k, y: cy + py * k, z: zr, k: k };
      }

      // Depth well so the turning card doesn't flash the stage
      ctx.fillStyle = '#152822';
      ctx.fillRect(x, y, CS, CS);

      const showBack = angle >= Math.PI / 2;
      // Front face z = +hz (toward camera at rest); back face z = -hz
      const fz = showBack ? -hz : hz;
      const tl = proj(-hx, -hy, fz);
      const tr = proj(hx, -hy, fz);
      const br = proj(hx, hy, fz);
      const bl = proj(-hx, hy, fz);

      // Side edge (the paper thickness) — visible around 90°
      const rightFacing = sa >= 0;
      const ex = rightFacing ? hx : -hx;
      const e1 = proj(ex, -hy, hz);
      const e2 = proj(ex, -hy, -hz);
      const e3 = proj(ex, hy, -hz);
      const e4 = proj(ex, hy, hz);
      const edgeW = Math.abs(e2.x - e1.x);
      if (edgeW > 0.6) {
        const midX = (e1.x + e2.x) / 2;
        const g = ctx.createLinearGradient(e1.x, cy, e2.x, cy);
        if (rightFacing) {
          g.addColorStop(0, '#3d5348');
          g.addColorStop(0.45, '#f3f0d8');
          g.addColorStop(0.6, '#dfe6c6');
          g.addColorStop(1, '#2a3d36');
        } else {
          g.addColorStop(0, '#2a3d36');
          g.addColorStop(0.4, '#dfe6c6');
          g.addColorStop(0.55, '#f3f0d8');
          g.addColorStop(1, '#3d5348');
        }
        fillQuad(e1, e2, e3, e4, g);
      }

      // Face width in screen space; skip unreadable squashed art near edge-on
      const faceW = Math.hypot(tr.x - tl.x, tr.y - tl.y);
      if (faceW >= 14) {
        if (showBack && sceneImg) {
          const sw = sceneImg.width / N;
          const sh = sceneImg.height / N;
          // Back face is viewed from behind, so we already swapped z; the
          // projection can mirror in X — blit in visual left-to-right order.
          blitTexturedQuad(
            sceneImg, c * sw, r * sh, sw, sh,
            tl, tr, br, bl, 20
          );
        } else {
          blitTexturedQuad(
            frontCellCanvas(r, c), 0, 0, CS, CS,
            tl, tr, br, bl, 18
          );
        }
        // Soft shading: receding side is darker, no flash
        const shade = 0.28 * (1 - Math.min(1, faceW / CS));
        const lg = ctx.createLinearGradient(tl.x, 0, tr.x, 0);
        lg.addColorStop(0, 'rgba(20,40,30,' + (shade * 0.25) + ')');
        lg.addColorStop(0.5, 'rgba(20,40,30,' + (shade * 0.05) + ')');
        lg.addColorStop(1, 'rgba(8,16,14,' + (shade * 1.15) + ')');
        fillQuad(tl, tr, br, bl, lg);
      }
    }

    function drawBoard(t) {
      const fade = 0.6 + 0.4 * ease(clamp(t / 0.35, 0, 1));
      ctx.save();
      ctx.globalAlpha = fade;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      roundRect(BX - FRAME, BY - FRAME, N * CS + FRAME * 2, N * CS + FRAME * 2, 22);
      ctx.fillStyle = BORDER_DARK;
      ctx.fill();
      ctx.restore();

      roundRect(BX - FRAME, BY - FRAME, N * CS + FRAME * 2, N * CS + FRAME * 2, 22);
      ctx.fillStyle = BORDER_DARK;
      ctx.fill();
      roundRect(BX - FRAME + 3, BY - FRAME + 3, N * CS + FRAME * 2 - 6, N * CS + FRAME * 2 - 6, 19);
      ctx.fillStyle = '#f5f7e8';
      ctx.fill();

      ctx.save();
      roundRect(BX, BY, N * CS, N * CS, 12);
      ctx.clip();

      const allFlipped = t >= FLIPS.last;
      // Draw the painting once as a continuous plate; finished tiles leave it visible
      // so mid-reveal never shows slice seams.
      if (t >= T_IMPACT && sceneImg) {
        ctx.drawImage(sceneImg, BX, BY, N * CS, N * CS);
      }
      if (!allFlipped) {
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            const x = BX + c * CS;
            const y = BY + r * CS;
            const flipT = (t - FLIPS.start[r][c]) / FLIP_DUR;
            const p = clamp(flipT, 0, 1);
            if (p <= 0) drawFrontCell(x, y, r, c);
            else if (p < 1) drawFlippingTile(x, y, r, c, p);
            // p >= 1: the continuous painting underneath already shows

            if (t >= T_FART && t < T_FIX + 0.2) {
              if ((r === WRONG.r && c === WRONG.c) || (r === 2 && c === 4)) {
                const a = Math.sin(clamp((t - T_FART) / 1.3, 0, 1) * Math.PI) * 0.32;
                ctx.fillStyle = 'rgba(200,225,140,' + a + ')';
                ctx.fillRect(x, y, CS, CS);
              }
            }
          }
        }

        // Region borders only on tiles that have not finished flipping; fade to 0
        const revealP = clamp((t - T_IMPACT) / 1.5, 0, 1);
        const borderA = lerp(1, 0, ease(revealP));
        const thick = 4;
        if (borderA > 0.01) {
          for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
              const flipT = (t - FLIPS.start[r][c]) / FLIP_DUR;
              if (flipT >= 1) continue;
              const x = BX + c * CS;
              const y = BY + r * CS;
              const k = REG[r][c];
              ctx.fillStyle = 'rgba(23,63,54,' + borderA + ')';
              if (r === 0 || REG[r - 1][c] !== k) ctx.fillRect(x, y, CS, thick);
              if (r === N - 1 || REG[r + 1][c] !== k) ctx.fillRect(x, y + CS - thick, CS, thick);
              if (c === 0 || REG[r][c - 1] !== k) ctx.fillRect(x, y, thick, CS);
              if (c === N - 1 || REG[r][c + 1] !== k) ctx.fillRect(x + CS - thick, y, thick, CS);
            }
          }
        }
      }

      ctx.restore();

      ctx.lineWidth = 5;
      ctx.strokeStyle = BORDER_DARK;
      roundRect(BX - FRAME, BY - FRAME, N * CS + FRAME * 2, N * CS + FRAME * 2, 22);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = BORDER;
      roundRect(BX - FRAME + 3, BY - FRAME + 3, N * CS + FRAME * 2 - 6, N * CS + FRAME * 2 - 6, 19);
      ctx.stroke();

      ctx.restore();
    }

    function startFeet(d) {
      if (d.hero) return feetXY(LAND.r, LAND.c);
      if (d.short === 'cyan') return feetXY(FIX.r, FIX.c);
      return feetXY(d.row, d.col);
    }

    function leaveProgress(d, t) {
      const t0 = T_LEAVE + d.leaveDelay;
      if (t < t0) return { u: 0, started: false, done: false, t0: t0, local: 0 };
      const local = t - t0;
      const u = clamp(local / LEAVE_DUR, 0, 1);
      return { u: ease(u), started: true, done: u >= 1, t0: t0, local: local };
    }

    // Double hop with squash-stretch. Used by 02/04/05/08 (and as extra bounce).
    function cheerHop(localT) {
      const hops = [[0, 0.50, 26], [0.52, 0.98, 18]];
      let y = 0, sx = 1, sy = 1, hopping = false, apex = 0;
      for (let i = 0; i < hops.length; i++) {
        const a = hops[i][0], b = hops[i][1], amp = hops[i][2];
        if (localT >= a && localT < b) {
          const u = (localT - a) / (b - a);
          hopping = true;
          if (u < 0.14) {
            const k = u / 0.14;
            sx = 1 + 0.16 * (1 - k);
            sy = 1 - 0.18 * (1 - k);
          } else if (u < 0.86) {
            const j = (u - 0.14) / 0.72;
            y = -amp * Math.sin(j * Math.PI);
            sx = 0.93;
            sy = 1.10;
            if (j > 0.42 && j < 0.58) apex = 1;
          } else {
            const k = (u - 0.86) / 0.14;
            sx = 1 + 0.16 * (1 - k);
            sy = 1 - 0.18 * (1 - k);
          }
        }
      }
      return { y: y, sx: sx, sy: sy, hopping: hopping, apex: apex };
    }

    function boardDragonState(d, t) {
      const slot = d.slot;
      const idle = getClip(slot, 'idle');
      const placed = getClip(slot, 'placed');
      const size = spriteSize(idle);
      const idleT = t + d.row * 0.47;
      const leave = leaveProgress(d, t);

      // ---- Green after the fly-in (during fly-in, drawHero owns him) ----
      if (d.hero) {
        if (t < T_FLY + FLY_LEN) return null;
        const from = feetXY(LAND.r, LAND.c);
        from.x += 4;
        let x = from.x, y = from.y, flip = false;
        let clip = idle, frame = 0, sx = 1, sy = 1;
        if (!leave.done) {
          const u = leave.started ? leave.u : 0;
          if (leave.started) {
            x = lerp(from.x, d.perch.x, u);
            y = lerp(from.y, d.perch.y, u) - Math.sin(u * Math.PI) * 28;
            flip = d.perch.x < from.x;
            clip = placed;
            frame = seqFrame(placed, leave.local, false);
          } else {
            // Brief planted pose between kick follow-through and the hop off
            clip = idle;
            frame = seqFrame(idle, 0, true);
          }
        } else {
          x = d.perch.x;
          y = d.perch.y;
          flip = d.perch.flip;
          if (t < T_SIT) {
            const cheer = getClip(slot, 'cheer');
            clip = cheer;
            frame = seqFrame(cheer, t - T_CHEER, false);
          } else if (t < T_SIT + SIT_LEN) {
            const sit = getClip(slot, 'sit-down');
            clip = sit;
            frame = seqFrame(sit, t - T_SIT, false);
          } else {
            clip = idle;
            frame = seqFrame(idle, t - T_SIT - SIT_LEN, true);
          }
        }
        return {
          clip: clip, frame: frame, x: x, y: y, flip: flip, alpha: 1, size: spriteSize(clip),
          sx: sx, sy: sy, sparkle: d.sparkle, cheerLocal: t - T_CHEER, isHero: true,
        };
      }

      // ---- Cyan: wrong cell, fart, hop to the valid cell, then later leave ----
      let x, y, flip = false, clip, frame, cloud = null, cloudT = 0;

      if (d.short === 'cyan') {
        const puff = getClip(slot, 'stink-puff');
        const cloudClip = getClip(slot, 'stink-puff-cloud');
        if (t < T_WRONG) return null;
        if (t < T_FART) {
          const feet = feetXY(WRONG.r, WRONG.c);
          return { clip: placed, frame: seqFrame(placed, t - T_WRONG, false), x: feet.x, y: feet.y, flip: false, alpha: 1, size: size };
        }
        if (t < T_FIX) {
          const feet = feetXY(WRONG.r, WRONG.c);
          return {
            clip: puff, frame: seqFrame(puff, t - T_FART, false),
            x: feet.x, y: feet.y, flip: false, alpha: 1, size: size,
          };
        }
        const dur = clipLen(placed);
        if (t < T_FIX + dur) {
          const u = clamp((t - T_FIX) / dur, 0, 1);
          const a = feetXY(WRONG.r, WRONG.c);
          const b = feetXY(FIX.r, FIX.c);
          return {
            clip: placed, frame: seqFrame(placed, t - T_FIX, false),
            x: lerp(a.x, b.x, ease(u)),
            y: lerp(a.y, b.y, ease(u)),
            flip: true, alpha: 1, size: size,
          };
        }
        // Settled on the valid cell, maybe still facing left, until hop-off
        x = feetXY(FIX.r, FIX.c).x;
        y = feetXY(FIX.r, FIX.c).y;
        flip = t < T_LEAVE;
        clip = idle;
        frame = seqFrame(idle, idleT, true);
      } else {
        const tHop = T_P[d.row];
        if (t < tHop) return null;
        const feet = feetXY(d.row, d.col);
        const dur = clipLen(placed);
        if (t < tHop + dur) {
          return { clip: placed, frame: seqFrame(placed, t - tHop, false), x: feet.x, y: feet.y, flip: false, alpha: 1, size: size };
        }
        x = feet.x;
        y = feet.y;
        flip = false;
        clip = idle;
        frame = seqFrame(idle, idleT, true);
      }

      // Hop off to the frame perch as the picture is revealed
      if (leave.started && !leave.done) {
        const from = { x: x, y: y };
        x = lerp(from.x, d.perch.x, leave.u);
        y = lerp(from.y, d.perch.y, leave.u) - Math.sin(leave.u * Math.PI) * 30;
        flip = d.perch.x < from.x;
        clip = placed;
        frame = seqFrame(placed, leave.local, false);
        return { clip: clip, frame: frame, x: x, y: y, flip: flip, alpha: 1, size: size };
      }
      if (leave.done) {
        x = d.perch.x;
        y = d.perch.y;
        flip = d.perch.flip;
      }

      // Celebration on the perch (or, if they haven't left yet, skip — they will have left)
      let sx = 1, sy = 1;
      const cheerLocal = t - (T_CHEER + d.cheerDelay);
      if (leave.done && cheerLocal >= 0 && cheerLocal < 1.15) {
        const hop = cheerHop(cheerLocal);
        y += hop.y;
        sx = hop.sx;
        sy = hop.sy;
        if (hop.hopping) {
          clip = placed;
          // Map the hop phase onto the placed frames so legs tuck at the apex
          const hopU = hop.y < -4 ? 0.25 : 0;
          frame = seqFrame(placed, hopU ? 0.18 : 0.02, false);
          if (hop.y < -12) frame = seqFrame(placed, 0.16, false); // tucked apex ~frame 2
        } else {
          clip = idle;
          frame = seqFrame(idle, idleT, true);
        }
        return {
          clip: clip, frame: frame, x: x, y: y, flip: flip, alpha: 1, size: size,
          sx: sx, sy: sy, sparkle: d.sparkle, cheerLocal: cheerLocal,
        };
      }

      if (leave.done) {
        clip = idle;
        frame = seqFrame(idle, idleT, true);
        flip = d.perch.flip;
      }
      return { clip: clip, frame: frame, x: x, y: y, flip: flip, alpha: 1, size: size, sx: sx, sy: sy };
    }

    // Several billowing puffs + soft green-cream mist. Origin pinned under the tail.
    const cloudTintCache = {};
    function tintCloudFrame(clip, fr) {
      const key = clip.id + ':' + fr;
      if (cloudTintCache[key]) return cloudTintCache[key];
      const img = images[clip.id];
      const rec = clip.frames[fr];
      const fw = clip.frameSize.w;
      const fh = clip.frameSize.h;
      const cv = document.createElement('canvas');
      cv.width = fw;
      cv.height = fh;
      const c = cv.getContext('2d');
      if (img && rec) c.drawImage(img, rec[0], rec[1], fw, fh, 0, 0, fw, fh);
      const data = c.getImageData(0, 0, fw, fh);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 2) continue;
        const L = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        let r, g, b;
        if (L < 0.5) {
          const u = L / 0.5;
          r = 142 + 44 * u;
          g = 176 + 38 * u;
          b = 72 + 46 * u;
        } else {
          const u = (L - 0.5) / 0.5;
          r = 186 + 59 * u;
          g = 214 + 28 * u;
          b = 118 + 87 * u;
        }
        d[i] = r;
        d[i + 1] = g;
        d[i + 2] = b;
      }
      c.putImageData(data, 0, 0);
      cloudTintCache[key] = cv;
      return cv;
    }

    function drawMist(ax, ay, rx, ry, rot, a) {
      if (a <= 0 || rx <= 0) return;
      const g = ctx.createRadialGradient(ax, ay, Math.max(2, rx * 0.10), ax, ay, Math.max(rx, ry));
      g.addColorStop(0, 'rgba(168, 214, 96, ' + (0.82 * a) + ')');
      g.addColorStop(0.32, 'rgba(196, 224, 130, ' + (0.56 * a) + ')');
      g.addColorStop(0.68, 'rgba(230, 236, 180, ' + (0.30 * a) + ')');
      g.addColorStop(1, 'rgba(245, 240, 210, 0)');
      ctx.save();
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(ax, ay, rx, ry, rot, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawClouds(state) {
      if (!state.cloud || state.puffT == null) return;
      const clip = state.cloud;
      const origin = clip.cloudOrigin || { x: 80, y: 226 };
      const fw = clip.frameSize.w;
      const sign = state.flip ? -1 : 1;
      const ox = (origin.x - (state.clip ? state.clip.anchor.x : 128)) / fw * state.size;
      const oy = (origin.y - (state.clip ? state.clip.anchor.y : 248)) / fw * state.size;
      const tailX = state.x + sign * ox;
      const tailY = state.y + oy;

      const puffs = [
        { delay: 0.00, k0: 2.40, k1: 3.80, driftX: -22, driftY: -28, life: 1.35, alpha: 1.00, frameBoost: 0.22, rx: 62, ry: 44, rot: -0.5 },
        { delay: 0.10, k0: 2.00, k1: 3.50, driftX: -42, driftY: -56, life: 1.35, alpha: 0.95, frameBoost: 0.30, rx: 54, ry: 40, rot: -0.8 },
        { delay: 0.22, k0: 1.60, k1: 3.00, driftX: -16, driftY: -92, life: 1.25, alpha: 0.85, frameBoost: 0.38, rx: 46, ry: 36, rot: -0.25 },
        { delay: 0.36, k0: 1.30, k1: 2.50, driftX: -48, driftY: -112, life: 1.15, alpha: 0.70, frameBoost: 0.46, rx: 38, ry: 28, rot: -0.7 },
      ];

      for (let i = 0; i < puffs.length; i++) {
        const puff = puffs[i];
        const pt = state.puffT - puff.delay;
        if (pt <= 0 || pt > puff.life) continue;
        const u = pt / puff.life;
        const rise = ease(clamp(u, 0, 1));
        const k = puff.k0 + (puff.k1 - puff.k0) * rise;
        let a = puff.alpha * state.alpha;
        if (u < 0.10) a *= u / 0.10;
        else if (u > 0.58) a *= Math.max(0, 1 - (u - 0.58) / 0.42);
        const ax = tailX + sign * puff.driftX * rise;
        const ay = tailY + puff.driftY * rise;
        // Soft volume behind the sprite cloud
        drawMist(ax, ay, puff.rx * (0.85 + 0.85 * rise), puff.ry * (0.85 + 0.85 * rise), puff.rot * sign, a);
        // Prefer mid, well-shaped frames; later sheet frames are dark/thin
        let fr = seqFrame(clip, pt + puff.frameBoost, false);
        const lastGood = Math.min(clip.frames.length - 1, 5);
        if (fr < 1) fr = 1;
        if (fr > lastGood) fr = lastGood;
        const size = state.size * k;
        const scale = size / fw;
        const buf = tintCloudFrame(clip, fr);
        if (!buf || a <= 0) continue;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(ax, ay);
        if (state.flip) ctx.scale(-1, 1);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(buf, 0, 0, buf.width, buf.height, -origin.x * scale, -origin.y * scale, size, size);
        ctx.restore();
        drawMist(ax, ay, puff.rx * (0.55 + 0.55 * rise), puff.ry * (0.55 + 0.55 * rise), puff.rot * sign, a * 0.45);
      }
    }

    function drawLingeringStink(t) {
      if (t < T_FART || t > T_FIX + 0.6) return;
      const puff = getClip('dragon-05-rose-cyan', 'stink-puff');
      const cloud = getClip('dragon-05-rose-cyan', 'stink-puff-cloud');
      if (!puff || !cloud) return;
      const feet = feetXY(WRONG.r, WRONG.c);
      const fade = t > T_FIX ? Math.max(0, 1 - (t - T_FIX) / 0.6) : 1;
      drawClouds({
        cloud: cloud,
        puffT: t - T_FART,
        clip: puff,
        x: feet.x,
        y: feet.y,
        flip: false,
        size: spriteSize(puff),
        alpha: fade,
      });
    }

    function starPath(s) {
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.26, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.26, 0);
      ctx.closePath();
      ctx.moveTo(-s, 0);
      ctx.lineTo(0, s * 0.26);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, -s * 0.26);
      ctx.closePath();
    }
    function drawStar(x, y, s, color, a) {
      if (a <= 0 || s <= 0) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(255, 250, 225, 0.95)';
      ctx.shadowBlur = 10;
      starPath(s);
      ctx.strokeStyle = 'rgba(255, 252, 230, 0.95)';
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function drawHeart(x, y, s, color, a) {
      if (a <= 0 || s <= 0) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s / 6, s / 6);
      ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(255, 250, 225, 0.95)';
      ctx.shadowBlur = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-6, -1, -6, -7, 0, -4);
      ctx.bezierCurveTo(6, -7, 6, -1, 0, 4);
      ctx.strokeStyle = 'rgba(255, 252, 230, 0.95)';
      ctx.lineWidth = 1.35;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function drawBurst(state) {
      if (state.cheerLocal == null || !state.sparkle) return;
      const t = state.cheerLocal;
      const bursts = [0.28, 0.74];
      // Burst outward from the frame so left-side (cyan/purple) marks sit in
      // the dark forest, not over the painting.
      const out = state.flip ? 1 : -1;
      for (let b = 0; b < bursts.length; b++) {
        const age = t - bursts[b];
        if (age < 0 || age > 0.50) continue;
        const u = age / 0.50;
        const a = (u < 0.18 ? u / 0.18 : 1 - (u - 0.18) / 0.82);
        const rise = 10 + 20 * u;
        const spread = 12 + 18 * u;
        const cx = state.x + out * 18;
        const cy = state.y - 62 - rise * 0.15;
        ctx.save();
        ctx.globalAlpha = a * 0.35;
        const halo = ctx.createRadialGradient(cx, cy - 8, 2, cx, cy - 8, 28);
        halo.addColorStop(0, 'rgba(255, 250, 220, 0.9)');
        halo.addColorStop(1, 'rgba(255, 250, 220, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy - 8, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        const bits = [
          { kind: 'heart', dx: -0.2, dy: -1.0, s: 13 },
          { kind: 'star', dx: 0.9, dy: -0.55, s: 10 },
          { kind: 'star', dx: -0.95, dy: -0.4, s: 9 },
          { kind: 'heart', dx: 0.35, dy: -1.15, s: 10 },
          { kind: 'star', dx: 0.05, dy: -0.35, s: 8 },
        ];
        for (let i = 0; i < bits.length; i++) {
          const bit = bits[i];
          const px = cx + out * bit.dx * spread;
          const py = cy + bit.dy * rise;
          if (bit.kind === 'heart') drawHeart(px, py, bit.s * (1 - 0.22 * u), state.sparkle, a);
          else drawStar(px, py, bit.s * (1 - 0.18 * u), '#fff4d0', a);
        }
      }
    }

    function drawHero(t) {
      if (t < T_FLY || t >= T_FLY + FLY_LEN) return;
      const fly = getClip('dragon-03-lavender-green', 'fly-in');
      const fx = getClip('dragon-03-lavender-green', 'kick-impact-fx');
      const land = feetXY(LAND.r, LAND.c);
      const HX = land.x + 4;
      const HY = land.y;
      const HS = spriteSize(fly);
      const lt = t - T_FLY;
      let ax, ay, f;

      if (lt < FLY_FLAP) {
        const u = lt / FLY_FLAP;
        ax = lerp(-10, HX - 150, u);
        ay = lerp(BY + 90, HY - 100, u) - Math.sin(u * Math.PI) * 70;
        f = seqFrame(fly, lt, false);
      } else if (lt < FLY_FLAP + FLY_GLIDE) {
        const u = (lt - FLY_FLAP) / FLY_GLIDE;
        ax = lerp(HX - 150, HX - 66, u);
        ay = lerp(HY - 100, HY - 64, u);
        f = seqFrame(fly, lt, false);
      } else if (lt < FLY_FLAP + FLY_GLIDE + FLY_LAND) {
        const u = clamp((lt - FLY_FLAP - FLY_GLIDE) / 0.33, 0, 1);
        ax = lerp(HX - 66, HX, ease(u));
        ay = lerp(HY - 64, HY, ease(u));
        f = seqFrame(fly, lt, false);
      } else {
        ax = HX;
        ay = HY;
        f = seqFrame(fly, lt, false);
      }

      const sh = lt < FLY_FLAP ? clamp((lt / FLY_FLAP - 0.35) / 0.5, 0, 0.45) : clamp(1 - (HY - ay) / 160, 0.35, 1);
      if (sh > 0 && ax > BX - 20) {
        ctx.save();
        ctx.fillStyle = 'rgba(20,40,30,' + (0.28 * sh) + ')';
        ctx.beginPath();
        ctx.ellipse(lerp(ax, HX, 0.3), HY + 2, HS * 0.22 * sh, 6 * sh, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      let bodySx = 1;
      const idleClip = getClip('dragon-03-lavender-green', 'idle');
      if (idleClip && lt >= FLY_FLAP + FLY_GLIDE) {
        const idleW = frameBBox(idleClip, 0).w * (BOARD_SIZE / 256);
        const poseW = frameBBox(fly, f).w * (HS / fly.frameSize.w);
        if (poseW > 0 && poseW < idleW * 0.97) bodySx = Math.min(1.14, idleW / poseW);
      }
      drawSprite(fly, f, ax, ay, HS, 1, false, bodySx, 1);

      const it = t - T_IMPACT;
      if (it >= 0 && it < 0.27 && fx) {
        const ip = fly.impactPoint;
        const fw = fly.frameSize.w;
        const px = ax + (ip.x - fly.anchor.x) / fw * HS;
        const py = ay + (ip.y - fly.anchor.y) / fw * HS;
        const fi = seqFrame(fx, it, false);
        const star = fx.frames[fi];
        const sz = HS * 0.48;
        const img = images[fx.id];
        if (img && star) {
          ctx.drawImage(img, star[0], star[1], fx.frameSize.w, fx.frameSize.h, px - sz / 2, py - sz / 2, sz, sz);
        }
      }
    }

    function renderAt(t) {
      time = t;
      sizeCanvas();
      const scale = canvas.width / CSS_W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, CSS_W, CSS_H);

      drawBoard(t);

      const states = [];
      for (let i = 0; i < CAST.length; i++) {
        const s = boardDragonState(CAST[i], t);
        if (s) states.push(s);
      }
      states.sort((a, b) => a.y - b.y);
      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        ctx.save();
        ctx.fillStyle = 'rgba(20,40,30,0.18)';
        ctx.beginPath();
        ctx.ellipse(s.x, s.y + 1, s.size * 0.18, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        drawSprite(s.clip, s.frame, s.x, s.y, s.size, s.alpha, s.flip, s.sx, s.sy);
        if (s.cloud) drawClouds(s);
        drawBurst(s);
      }

      drawHero(t);
      drawLingeringStink(t);

      if (t >= T_FART && t < T_FIX) setBubble('Too close!');
      else if (t >= T_FIX && t < T_FLY - 0.15) setBubble("That's better.");
      else setBubble('');

      showEnd(t);
      if (t >= T_STORY) fireDone();
    }

    function tick(ts) {
      if (!playing) return;
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / 1000;
      renderAt(t);
      showEnd(t >= T_STORY ? T_STORY : t);
      if (t >= T_STORY) fireDone();
      raf = requestAnimationFrame(tick);
    }

    function play() {
      if (reduce) return;
      playing = true;
      startTs = 0;
      el.dataset.mode = 'motion';
      el.dataset.state = 'playing';
      doneFired = false;
      showEnd(0);
      if (!record) raf = requestAnimationFrame(tick);
      else renderAt(0);
    }

    function skip() {
      if (raf) cancelAnimationFrame(raf);
      playing = true;
      startTs = performance.now() - T_STORY * 1000;
      renderAt(T_STORY);
      showEnd(T_STORY);
      fireDone();
      el.dispatchEvent(new CustomEvent('sd-intro-skip', { bubbles: true }));
      if (!record) raf = requestAnimationFrame(tick);
    }

    function replay() {
      if (raf) cancelAnimationFrame(raf);
      doneFired = false;
      showEnd(0);
      setBubble('');
      el.dataset.state = 'playing';
      el.dataset.mode = 'motion';
      sr.textContent = SR_INTRO;
      playing = true;
      startTs = 0;
      if (!record) raf = requestAnimationFrame(tick);
      else renderAt(0);
    }

    function showStill() {
      if (raf) cancelAnimationFrame(raf);
      playing = false;
      el.dataset.mode = 'still';
      el.dataset.state = 'settled';
      setBubble('');
      showEnd(T_STORY);
      fireDone();
    }

    skipBtn.addEventListener('click', skip);
    function onKey(e) {
      if (e.key === 'Escape' && el.dataset.state === 'playing') {
        e.preventDefault();
        skip();
      }
    }
    document.addEventListener('keydown', onKey);

    cta.addEventListener('click', function (e) {
      if (typeof opts.onCta === 'function') opts.onCta(e);
    });

    document.addEventListener('visibilitychange', function () {
      if (record || reduce || !ready) return;
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (playing && el.dataset.mode === 'motion') {
        startTs = performance.now() - time * 1000;
        raf = requestAnimationFrame(tick);
      }
    });

    ro = new ResizeObserver(function () {
      if (!ready) return;
      if (el.dataset.mode === 'motion') renderAt(time || 0);
    });
    ro.observe(el);

    const api = {
      replay: replay,
      skip: skip,
      renderAt: renderAt,
      showStill: showStill,
      play: play,
      T_STORY: T_STORY,
      T_IMPACT: T_IMPACT,
      destroy: function () {
        if (raf) cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        if (ro) ro.disconnect();
        el.innerHTML = '';
      },
    };

    function getManifest() {
      if (opts.manifest) return Promise.resolve(opts.manifest);
      if (root.STINKDOKU_INTRO_MANIFEST) return Promise.resolve(root.STINKDOKU_INTRO_MANIFEST);
      return fetch(join(assetBase, 'manifest.json')).then(function (r) {
        if (!r.ok) throw new Error('manifest.json missing');
        return r.json();
      });
    }

    const boot = getManifest().then(function (man) {
      clips = man.clips;
      const jobs = [loadImage(join(assetBase, 'scene-jungle-glade.webp')).then(function (img) { sceneImg = img; })];
      Object.keys(clips).forEach(function (key) {
        const c = clips[key];
        jobs.push(loadImage(join(assetBase, c.src)).then(function (img) { images[c.id] = img; }));
      });
      return Promise.all(jobs);
    }).then(function () {
      ready = true;
      el.dataset.ready = 'true';
      sizeCanvas();
      if (reduce) {
        showStill();
      } else {
        play();
      }
      return api;
    }).catch(function (err) {
      el.querySelector('.sd-intro-loading').textContent = 'Could not load the intro.';
      console.error(err);
      throw err;
    });

    api.ready = boot;
    return api;
  }

  root.StinkDokuIntro = {
    mount: mount,
    T_STORY: T_STORY,
    T_IMPACT: T_IMPACT,
    version: '1.2-preview',
  };
})(window);

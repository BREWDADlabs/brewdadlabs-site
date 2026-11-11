// Vanilla sprite-sheet player for the StinkDoku web-animations-v1 clips.
// Timing comes from each clip's meta.sequence ({frame, ms}). Frames are packed
// row-major in the WebP sheet; CSS background-position shows the current one.
// pointer-events are always none. Callers honor prefers-reduced-motion.
(() => {
  'use strict';

  const ART = 'art/dragon-03-lavender-green/';
  const CLIP_NAMES = ['fly-in', 'kick-impact-fx', 'stink-puff', 'stink-puff-cloud', 'cheer', 'idle', 'placed'];

  function frameIndexList(framesObj) {
    return Object.entries(framesObj)
      .map(([name, data]) => {
        const match = name.match(/(\d+)$/);
        return { i: match ? Number(match[1]) : 0, rect: data.frame };
      })
      .sort((a, b) => a.i - b.i)
      .map((item) => item.rect);
  }

  function timeToFrame(sequence, frame) {
    let t = 0;
    for (const step of sequence) {
      if (step.frame === frame) return t;
      t += step.ms;
    }
    return t;
  }

  async function loadClip(name) {
    const jsonUrl = `${ART}${name}_sheet.json`;
    const imageUrl = `${ART}${name}_sheet.webp`;
    const [data, image] = await Promise.all([
      fetch(jsonUrl, { cache: 'force-cache' }).then((res) => {
        if (!res.ok) throw new Error(`missing ${jsonUrl}`);
        return res.json();
      }),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`missing ${imageUrl}`));
        img.src = imageUrl;
      }),
    ]);
    const meta = data.meta;
    return {
      name,
      meta,
      imageUrl,
      image,
      frames: frameIndexList(data.frames),
      timeToImpact: meta.impactFrame != null ? timeToFrame(meta.sequence, meta.impactFrame) : null,
    };
  }

  function makeSprite(clip, scale) {
    const fw = clip.meta.frameSize.w;
    const fh = clip.meta.frameSize.h;
    const sw = clip.meta.size.w;
    const sh = clip.meta.size.h;
    const el = document.createElement('div');
    el.className = 'dragon-sprite';
    el.setAttribute('aria-hidden', 'true');
    el.style.width = `${fw * scale}px`;
    el.style.height = `${fh * scale}px`;
    el.style.backgroundImage = `url("${clip.imageUrl}")`;
    el.style.backgroundSize = `${sw * scale}px ${sh * scale}px`;

    function showFrame(i) {
      const rect = clip.frames[i] || clip.frames[0];
      el.style.backgroundPosition = `-${rect.x * scale}px -${rect.y * scale}px`;
    }

    showFrame(clip.meta.sequence[0].frame);

    let timer = null;
    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function play({ loop = false } = {}) {
      stop();
      const seq = clip.meta.sequence;
      let i = 0;
      return new Promise((resolve) => {
        function step() {
          const item = seq[i];
          showFrame(item.frame);
          timer = setTimeout(() => {
            timer = null;
            i += 1;
            if (i >= seq.length) {
              if (loop) { i = 0; step(); }
              else resolve();
            } else step();
          }, item.ms);
        }
        step();
      });
    }

    return { el, clip, scale, showFrame, play, stop };
  }

  // Place the sprite so its meta.anchor (or a named point) sits at page (x, y).
  function pin(sprite, x, y, point) {
    const scale = sprite.scale;
    const origin = point || sprite.clip.meta.anchor;
    sprite.el.style.left = `${Math.round(x - origin.x * scale)}px`;
    sprite.el.style.top = `${Math.round(y - origin.y * scale)}px`;
  }

  window.StinkDokuSprites = {
    ART,
    CLIP_NAMES,
    loadClip,
    loadAll(names) {
      return Promise.all((names || CLIP_NAMES).map((name) => loadClip(name)))
        .then((clips) => {
          const map = {};
          clips.forEach((clip) => { map[clip.name] = clip; });
          return map;
        });
    },
    makeSprite,
    pin,
    timeToFrame,
  };
})();

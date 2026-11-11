// StinkDoku beta tester page (site/beta/index.html → /beta/).
// Flow: retro terminal boot (always plays; there is no button to skip the
// boot animation; prefers-reduced-motion prints instantly) -> BOTH iPhone
// and Android sections on the same page, in that fixed order, with equal
// weight. Each section has its own big buttons and its own per-step
// localStorage progress, so a tester can finish both. The page never
// reorders by phone type.
// A click on a step button arms an auto-advance on visibilitychange or focus
// once this tab has been hidden. "I did this, next" is the fallback.
// Testers must join the group, tap "Become a tester", and accept TestFlight
// themselves; this page only opens the official pages and never tries to join
// or opt in for them. There is no email signup.
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORAGE_KEY = 'stinkdoku-beta-tester-progress';
  const STEP_TITLES = {
    ios: { 1: 'INSTALL TESTFLIGHT', 2: 'ACCEPT THE INVITE', 3: 'OPEN STINKDOKU' },
    android: { 1: 'JOIN GOOGLE GROUP', 2: 'BECOME A TESTER', 3: 'INSTALL FROM PLAY' },
  };
  const PLATFORMS = ['ios', 'android'];
  let moving = false;
  let lastPlatform = '';
  let awaitingReturnFor = null;
  let leftPage = false;
  let returnTimer = null;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function typeLine(screen, text, cls) {
    const line = document.createElement('span');
    if (cls) line.className = cls;
    screen.appendChild(line);
    if (reduceMotion) { line.textContent = text + '\n'; return; }
    for (let i = 0; i < text.length; i += 2) {
      line.textContent = text.slice(0, i + 2);
      await wait(14);
    }
    line.textContent = text + '\n';
  }

  async function playTerminal(script, statusText) {
    const term = $('term');
    const screen = $('screen');
    term.hidden = false;
    term.setAttribute('aria-hidden', 'false');
    $('term-status').textContent = statusText;
    screen.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    for (const item of script) {
      await typeLine(screen, item.text, item.cls);
      await wait(reduceMotion ? 0 : (item.pause == null ? 120 : item.pause));
    }
    screen.appendChild(cursor);
    await wait(reduceMotion ? 0 : 450);
  }

  const bootScript = [
    { text: 'BREWDAD LABS // STINKDOKU TEST UNIT', pause: 220 },
    { text: 'POWER ON ................ OK' },
    { text: 'WAKING DRAGONS .......... 10 FOUND' },
    { text: 'IPHONE + ANDROID ........ READY' },
    { text: '>> OPTICAL SENSOR ONLINE', cls: 'red', pause: 260 },
    { text: 'LOADING TESTER STEPS .... OK' },
    { text: '> BOTH TRACKS ONLINE', pause: 200 },
  ];

  function readProgress() {
    const empty = { ios: 1, android: 1 };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const data = JSON.parse(raw);
      const stepOf = (p) => {
        const n = Number(data[p]);
        return n === 1 || n === 2 || n === 3 ? n : 1;
      };
      return { ios: stepOf('ios'), android: stepOf('android') };
    } catch { /* private mode or bad JSON */ }
    return empty;
  }
  function saveProgress(platform, step) {
    const data = readProgress();
    data[platform] = step;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* private mode */ }
  }
  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* private mode */ }
  }
  function hasSavedProgress() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  }

  function revealTerminal() {
    $('intro').hidden = true;
    const term = $('term');
    term.hidden = false;
    term.setAttribute('aria-hidden', 'false');
  }

  function paintTracks(progress) {
    PLATFORMS.forEach((platform) => {
      const step = progress[platform];
      $('term-label').textContent = `STINKDOKU TEST UNIT  iOS ${progress.ios}/3  AND ${progress.android}/3`;
      $(`${platform}-progress`).textContent = `Step ${step} of 3`;
      for (let n = 1; n <= 3; n += 1) {
        const card = $(`${platform}-${n}`);
        card.classList.toggle('is-current', n === step);
        card.classList.toggle('is-done', n < step);
        card.classList.toggle('is-future', n > step);
        const mark = card.querySelector('.step-n');
        if (mark) {
          mark.textContent = n < step ? `STEP ${n} OF 3  // DONE` : `STEP ${n} OF 3`;
        }
      }
    });
    const canBack = (progress.ios > 1 && lastPlatform === 'ios') ||
      (progress.android > 1 && lastPlatform === 'android') ||
      (progress.ios > 1 || progress.android > 1);
    $('back').hidden = !canBack;
  }

  function showTracks() {
    revealTerminal();
    $('term').classList.add('ready');
    $('step-panel').hidden = false;
    const progress = readProgress();
    paintTracks(progress);
    $('term-status').textContent = 'iPhone and Android steps are ready';
  }

  async function goToStep(platform, n, { transition } = {}) {
    if (moving) return;
    if (platform !== 'ios' && platform !== 'android') return;
    n = Math.max(1, Math.min(3, n));
    moving = true;
    awaitingReturnFor = null;
    leftPage = false;
    if (returnTimer) { clearTimeout(returnTimer); returnTimer = null; }
    revealTerminal();
    $('term').classList.add('ready');
    lastPlatform = platform;
    $('step-panel').hidden = false;
    if (transition && !reduceMotion) {
      await playTerminal([
        { text: `> ${platform === 'ios' ? 'IPHONE' : 'ANDROID'} STAGE ${n} OF 3: ${STEP_TITLES[platform][n]}` },
        { text: n === 3 ? 'LAST ONE. STAND BY.' : 'OK. STAND BY.', pause: 160 },
      ], `Loading ${platform === 'ios' ? 'iPhone' : 'Android'} step ${n} of 3`);
    }
    saveProgress(platform, n);
    const progress = readProgress();
    paintTracks(progress);
    const card = $(`${platform}-${n}`);
    card.focus({ preventScroll: true });
    card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    $('term-status').textContent = `${platform === 'ios' ? 'iPhone' : 'Android'} step ${n} of 3`;
    moving = false;
    if (transition) playDragonMoment(n === 3 ? 'cheer' : (n === 2 ? 'fly' : 'pop'));
  }

  function armReturn(platform, fromStep) {
    awaitingReturnFor = { platform, fromStep };
    leftPage = document.hidden;
  }

  function onMaybeReturn() {
    if (!awaitingReturnFor) return;
    if (document.visibilityState === 'hidden') {
      leftPage = true;
      return;
    }
    if (!leftPage) return;
    if (returnTimer) clearTimeout(returnTimer);
    const from = awaitingReturnFor;
    returnTimer = setTimeout(() => {
      returnTimer = null;
      if (awaitingReturnFor !== from) return;
      if (document.visibilityState === 'hidden') return;
      awaitingReturnFor = null;
      leftPage = false;
      goToStep(from.platform, from.fromStep + 1, { transition: true });
    }, 300);
  }

  async function startHandoff() {
    revealTerminal();
    $('step-panel').hidden = true;
    $('term').classList.remove('ready');
    $('term-label').textContent = 'STINKDOKU TEST UNIT';
    await playTerminal(bootScript, 'Starting the tester steps');
    showTracks();
    ensureDragonAssets().then(() => playDragonMoment('pop'));
  }

  async function startOver() {
    if (moving) return;
    clearProgress();
    lastPlatform = '';
    $('back').hidden = true;
    await startHandoff();
  }


  function setupDragons() {
    const layer = $('dragon-layer');
    window.playDragonMoment = function () { /* no-op until assets load, or when reduced motion */ };
    window.ensureDragonAssets = function () { return Promise.resolve(); };
    if (!layer || reduceMotion || !window.StinkDokuSprites) return;

    const SCALE = 0.5;
    let clips = null;
    let loading = null;
    let busy = false;
    let idleTimer = null;
    const spritesLib = window.StinkDokuSprites;

    function makeTile(text) {
      const tile = document.createElement('div');
      tile.className = 'sudoku-tile';
      tile.textContent = text;
      tile.setAttribute('aria-hidden', 'true');
      return tile;
    }

    function clearLayer() {
      layer.replaceChildren();
    }

    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function flyKick() {
      const fly = spritesLib.makeSprite(clips['fly-in'], SCALE);
      const fx = spritesLib.makeSprite(clips['kick-impact-fx'], SCALE);
      const tile = makeTile('5');
      const tileX = Math.round(window.innerWidth * 0.62);
      const tileY = Math.round(window.innerHeight * (0.10 + Math.random() * 0.08));
      tile.style.left = `${tileX}px`;
      tile.style.top = `${tileY}px`;
      const tileCx = tileX + 18;
      const tileCy = tileY + 18;
      const impact = fly.clip.meta.impactPoint;
      // Land so the mule-kick impactPoint hits the tile; dragon faces right, tile is to its left.
      const landLeft = Math.round(tileCx - impact.x * SCALE);
      const landTop = Math.round(tileCy - impact.y * SCALE);
      fly.el.style.top = `${landTop}px`;
      fly.el.style.left = `${-fly.clip.meta.frameSize.w * SCALE - 20}px`;
      fx.el.style.opacity = '0';
      layer.append(tile, fly.el, fx.el);

      const impactAt = fly.clip.timeToImpact || 1906;
      const flight = fly.el.animate([
        { transform: `translateX(0)` },
        { transform: `translateX(${landLeft + fly.clip.meta.frameSize.w * SCALE + 20}px)` },
      ], { duration: impactAt, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });

      let kicked = false;
      function onImpact() {
        if (kicked) return;
        kicked = true;
        spritesLib.pin(fx, tileCx, tileCy, fx.clip.meta.anchor);
        fx.el.style.opacity = '1';
        fx.play({ loop: false }).then(() => { fx.el.style.opacity = '0'; });
        tile.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(-36px, 8px) rotate(-50deg)', offset: 0.35 },
          { transform: 'translate(-120px, 80px) rotate(-300deg)', opacity: 0 },
        ], { duration: 700, easing: 'cubic-bezier(.15,.75,.3,1)', fill: 'forwards' });
      }
      const hit = setTimeout(onImpact, impactAt);
      await fly.play({ loop: false });
      clearTimeout(hit);
      if (!kicked) onImpact();
      try { await flight.finished; } catch { /* cancelled */ }
      await wait(200);
    }

    async function popPuff() {
      const placed = spritesLib.makeSprite(clips.placed, SCALE);
      const idle = spritesLib.makeSprite(clips.idle, SCALE);
      const puff = spritesLib.makeSprite(clips['stink-puff'], SCALE);
      const cloud = spritesLib.makeSprite(clips['stink-puff-cloud'], SCALE);
      const x = Math.round(window.innerWidth * (0.22 + Math.random() * 0.45));
      const floorY = window.innerHeight - 28;
      const sprites = [placed, idle, puff, cloud];
      sprites.forEach((sprite) => {
        spritesLib.pin(sprite, x, floorY);
        sprite.el.style.transform = `translateY(${Math.round(sprite.clip.meta.frameSize.h * SCALE + 20)}px)`;
      });
      // Cloud sits above the dragon body (same canvas/anchor, same frame index).
      cloud.el.style.zIndex = '2';
      puff.el.style.zIndex = '1';
      idle.el.hidden = true;
      puff.el.hidden = true;
      cloud.el.hidden = true;
      layer.append(placed.el, idle.el, puff.el, cloud.el);

      const rise = placed.el.animate([
        { transform: `translateY(${Math.round(placed.clip.meta.frameSize.h * SCALE + 20)}px)` },
        { transform: 'translateY(0)' },
      ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      await placed.play({ loop: false });
      try { await rise.finished; } catch { /* cancelled */ }

      placed.el.hidden = true;
      idle.el.hidden = false;
      idle.el.style.transform = 'translateY(0)';
      const idleOnce = idle.play({ loop: false });
      await Promise.race([idleOnce, wait(900)]);
      idle.stop();
      idle.el.hidden = true;

      puff.el.hidden = false;
      cloud.el.hidden = false;
      puff.el.style.transform = 'translateY(0)';
      cloud.el.style.transform = 'translateY(0)';
      await Promise.all([puff.play({ loop: false }), cloud.play({ loop: false })]);

      const dropSprites = [puff, cloud];
      await Promise.all(dropSprites.map((sprite) => sprite.el.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${Math.round(sprite.clip.meta.frameSize.h * SCALE + 24)}px)`, opacity: 0 },
      ], { duration: 380, easing: 'cubic-bezier(.5,0,.7,1)', fill: 'forwards' }).finished.catch(() => {})));
    }

    async function cheer() {
      const sprite = spritesLib.makeSprite(clips.cheer, SCALE);
      const x = Math.round(window.innerWidth * 0.5);
      const floorY = window.innerHeight - 28;
      spritesLib.pin(sprite, x, floorY);
      sprite.el.style.transform = `translateY(${Math.round(sprite.clip.meta.frameSize.h * SCALE + 20)}px)`;
      layer.append(sprite.el);
      await sprite.el.animate([
        { transform: `translateY(${Math.round(sprite.clip.meta.frameSize.h * SCALE + 20)}px)` },
        { transform: 'translateY(0)' },
      ], { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }).finished.catch(() => {});
      // Sequence already contains two cycles; do not loop forever.
      await sprite.play({ loop: false });
      await sprite.el.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${Math.round(sprite.clip.meta.frameSize.h * SCALE + 24)}px)`, opacity: 0 },
      ], { duration: 360, easing: 'cubic-bezier(.5,0,.7,1)', fill: 'forwards' }).finished.catch(() => {});
    }

    async function play(kind) {
      if (reduceMotion || busy || document.hidden || !clips) return;
      busy = true;
      try {
        if (kind === 'cheer') await cheer();
        else if (kind === 'fly') await flyKick();
        else await popPuff();
      } catch { /* animation cancelled */ }
      clearLayer();
      busy = false;
    }

    window.playDragonMoment = function (kind) {
      const pick = kind === 'cheer' || kind === 'fly' || kind === 'pop'
        ? kind
        : (Math.random() < 0.5 ? 'pop' : 'fly');
      ensureDragonAssets().then(() => play(pick));
    };

    function scheduleIdle() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        play(Math.random() < 0.5 ? 'pop' : 'fly');
        scheduleIdle();
      }, 18000 + Math.random() * 14000);
    }

    window.ensureDragonAssets = function () {
      if (clips) return Promise.resolve();
      if (loading) return loading;
      loading = spritesLib.loadAll().then((map) => {
        clips = map;
        scheduleIdle();
      }).catch((err) => {
        loading = null;
        console.warn('Dragon animations could not load', err);
      });
      return loading;
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      else if (!document.hidden && clips) scheduleIdle();
    });
  }

  async function init() {
    setupDragons();
    document.querySelectorAll('.next').forEach((btn) => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        goToStep(platform, Number(btn.dataset.next), { transition: true });
      });
    });
    $('back').addEventListener('click', () => {
      const progress = readProgress();
      const platform = lastPlatform && progress[lastPlatform] > 1
        ? lastPlatform
        : (progress.android > 1 ? 'android' : (progress.ios > 1 ? 'ios' : ''));
      if (!platform) return;
      goToStep(platform, progress[platform] - 1);
    });
    $('start-over').addEventListener('click', () => { startOver(); });
    $('group-link').addEventListener('click', () => armReturn('android', 1));
    $('optin-link').addEventListener('click', () => armReturn('android', 2));
    $('testflight-app-link').addEventListener('click', () => armReturn('ios', 1));
    $('testflight-join-link').addEventListener('click', () => armReturn('ios', 2));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') leftPage = true;
      else onMaybeReturn();
    });
    window.addEventListener('focus', onMaybeReturn);

    $('loading').hidden = true;

    if (hasSavedProgress()) {
      lastPlatform = '';
      showTracks();
      ensureDragonAssets();
      return;
    }

    startHandoff();
  }

  init();
})();

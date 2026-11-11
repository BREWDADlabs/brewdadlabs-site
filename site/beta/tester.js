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
    if (transition) playDragonMoment(n === 3 ? 'fly' : 'pop');
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
    playDragonMoment('pop');
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
    if (!layer || reduceMotion) return;
    let busy = false;
    let idleTimer = null;

    function makeTile(text) {
      const tile = document.createElement('div');
      tile.className = 'sudoku-tile';
      tile.textContent = text;
      tile.setAttribute('aria-hidden', 'true');
      return tile;
    }

    function makeDragon(src) {
      const img = document.createElement('img');
      img.className = 'dragon';
      img.src = src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      return img;
    }

    function clearLayer() { layer.replaceChildren(); }

    function popKick() {
      const dragon = makeDragon('art/dragon-04-aqua-red-orange.webp');
      const tile = makeTile('7');
      const x = Math.round(window.innerWidth * (0.18 + Math.random() * 0.5));
      dragon.style.left = `${x}px`;
      dragon.style.bottom = '-120px';
      tile.style.left = `${x + 78}px`;
      tile.style.bottom = '28px';
      layer.append(dragon, tile);
      const rise = dragon.animate([
        { transform: 'translateY(0) rotate(-8deg)' },
        { transform: 'translateY(-150px) rotate(0deg)', offset: 0.45 },
        { transform: 'translateY(-158px) rotate(18deg)', offset: 0.58 },
        { transform: 'translateY(-150px) rotate(0deg)', offset: 0.7 },
        { transform: 'translateY(20px) rotate(-6deg)' },
      ], { duration: 1800, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      tile.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(0) rotate(0deg)', opacity: 1, offset: 0.5 },
        { transform: 'translate(42px, -88px) rotate(220deg)', opacity: 1, offset: 0.78 },
        { transform: 'translate(70px, 40px) rotate(340deg)', opacity: 0 },
      ], { duration: 1800, easing: 'cubic-bezier(.15,.8,.25,1)', fill: 'forwards' });
      return rise.finished;
    }

    function flyKick() {
      const dragon = makeDragon('art/dragon-06-sky-orange-peach.webp');
      const tile = makeTile('5');
      const y = Math.round(window.innerHeight * (0.08 + Math.random() * 0.08));
      const tileX = Math.round(window.innerWidth * 0.62);
      dragon.style.top = `${y}px`;
      dragon.style.left = '-130px';
      tile.style.top = `${y + 28}px`;
      tile.style.left = `${tileX}px`;
      layer.append(dragon, tile);
      const flight = dragon.animate([
        { transform: 'translateX(0) rotate(-12deg)' },
        { transform: `translateX(${tileX + 20}px) rotate(8deg)`, offset: 0.55 },
        { transform: `translateX(${tileX + 36}px) rotate(16deg)`, offset: 0.62 },
        { transform: `translateX(${window.innerWidth + 160}px) rotate(-6deg)` },
      ], { duration: 2200, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
      tile.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1, offset: 0.55 },
        { transform: 'translate(36px, 18px) rotate(40deg)', offset: 0.64 },
        { transform: 'translate(110px, 90px) rotate(300deg)', opacity: 0 },
      ], { duration: 2200, easing: 'cubic-bezier(.15,.75,.3,1)', fill: 'forwards' });
      return flight.finished;
    }

    async function play(kind) {
      if (reduceMotion || busy || document.hidden) return;
      busy = true;
      try {
        await (kind === 'fly' ? flyKick() : popKick());
      } catch { /* animation cancelled */ }
      clearLayer();
      busy = false;
    }

    window.playDragonMoment = function (kind) {
      play(kind === 'fly' || kind === 'pop' ? kind : (Math.random() < 0.5 ? 'pop' : 'fly'));
    };

    function scheduleIdle() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        play(Math.random() < 0.5 ? 'pop' : 'fly');
        scheduleIdle();
      }, 18000 + Math.random() * 14000);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      else if (!document.hidden) scheduleIdle();
    });
    scheduleIdle();
  }

  window.playDragonMoment = function () { /* no-op until setupDragons runs, or when reduced motion */ };

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
      return;
    }

    startHandoff();
  }

  init();
})();

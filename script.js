(() => {
  'use strict';
  const body = document.body;
  const themeBtn = document.getElementById('themeToggle');
  const stage = document.getElementById('capsuleStage');
  const pills = [...document.querySelectorAll('.liquid-pill')];
  const yesBtn = document.getElementById('yesBtn');
  const maybeBtn = document.getElementById('maybeBtn');
  const noBtn = document.getElementById('noBtn');
  const hint = document.getElementById('hint');
  const hintNumber = document.getElementById('hintNumber');
  const result = document.getElementById('resultContainer');
  const resultCard = result.querySelector('.result-card');
  const replayBtn = document.getElementById('replayBtn');
  const heartField = document.getElementById('heartField');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let escapeCount = 0;
  let lastEscape = 0;
  let active = null;
  let previousFocus = null;
  let floatPosition = null;
  let floatMatrix = '';
  let floatWidth = 0;
  let floatHeight = 0;
  let visualWidth = 0;
  let visualHeight = 0;
  let noSlot = null;
  let splitting = false;
  let suppressClickUntil = 0;
  let splitPieces = [];
  let splitAnimations = [];


  function activate(pill, message, number) {
    active = pill;
    pills.forEach((item) => {
      item.classList.toggle('is-active', item === pill);
      item.classList.remove('is-churning');
    });
    // Restart the refraction animation on every press, including repeated presses.
    void pill.offsetWidth;
    pill.classList.add('is-churning');
    window.setTimeout(() => pill.classList.remove('is-churning'), 900);
    hint.textContent = message;
    hintNumber.textContent = number;
  }

  pills.forEach((pill) => {
    pill.addEventListener('pointermove', (event) => {
      const r = pill.getBoundingClientRect();
      pill.style.setProperty('--pointer-x', `${((event.clientX - r.left) / r.width) * 100}%`);
      pill.style.setProperty('--pointer-y', `${((event.clientY - r.top) / r.height) * 100}%`);
    });
  });

  function revealLove() {
    activate(yesBtn, 'I KNEW WE WERE ON THE SAME WAVELENGTH ♥', '03 / 03');
    previousFocus = document.activeElement;
    window.setTimeout(() => {
      result.classList.add('show');
      result.setAttribute('aria-hidden', 'false');
      resultCard.focus({ preventScroll: true });
      makeHearts();
    }, motionReduced.matches ? 0 : 560);
  }

  function makeHearts() {
    heartField.replaceChildren();
    if (motionReduced.matches) return;
    const colours = ['#f69cb7', '#f5c7d5', '#ed749b', '#fff2f6', '#ce527e'];
    for (let i = 0; i < 42; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = Math.random() > .26 ? '♥' : '♡';
      heart.style.setProperty('--left', `${Math.random() * 100}%`);
      heart.style.setProperty('--size', `${12 + Math.random() * 32}px`);
      heart.style.setProperty('--duration', `${3.2 + Math.random() * 4}s`);
      heart.style.setProperty('--delay', `${Math.random() * 1.8}s`);
      heart.style.setProperty('--drift', `${Math.random() * 240 - 120}px`);
      heart.style.setProperty('--color', colours[Math.floor(Math.random() * colours.length)]);
      heartField.appendChild(heart);
    }
  }

  // A fixed-position pill can actually escape the rotated rack. Keeping it inside
  // the rack and just translating 30px was why the old interaction felt so tame.
  function launchNoButton() {
    if (floatPosition) return;
    const box = noBtn.getBoundingClientRect();
    floatMatrix = getComputedStyle(document.getElementById('pillRack')).transform;
    floatWidth = noBtn.offsetWidth;
    floatHeight = noBtn.offsetHeight;
    visualWidth = box.width;
    visualHeight = box.height;
    floatPosition = { x: box.left + box.width / 2, y: box.top + box.height / 2 };

    noSlot = document.createElement('div');
    noSlot.className = 'escaped-slot';
    noSlot.setAttribute('aria-hidden', 'true');
    noSlot.innerHTML = '<span>💨</span><small>TOO SLOW!</small>';
    noBtn.before(noSlot);
    document.body.appendChild(noBtn);
    noBtn.classList.remove('is-churning');
    noBtn.classList.add('is-escaped', 'is-active');
    noBtn.style.width = `${floatWidth}px`;
    noBtn.style.height = `${floatHeight}px`;
    noBtn.style.transform = floatMatrix;
    placeNoButton();
  }

  function placeNoButton() {
    if (!floatPosition) return;
    noBtn.style.left = `${floatPosition.x - floatWidth / 2}px`;
    noBtn.style.top = `${floatPosition.y - floatHeight / 2}px`;
  }

  function escapeHint() {
    pills.forEach((pill) => pill.classList.toggle('is-active', pill === noBtn));
    // No squish animation here: it would override the button's 3D orientation.
    noBtn.classList.remove('is-churning');
    hint.textContent = escapeCount === 1
      ? 'WAIT—DID THAT BUTTON JUST RUN AWAY? 💨'
      : escapeCount < 4
        ? 'CATCH IT IF YOU CAN. IT IS GETTING FASTER!'
        : 'THE NO BUTTON HAS OFFICIALLY LEFT THE CHAT. ♡';
    hintNumber.textContent = '02 / 03';
  }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // Select an on-screen target well away from both the button and the pointer.
  // Sampling the whole screen is much less predictable than toggling +/- 50px.
  function pickDestination(pointer) {
    const insetX = visualWidth / 2 + 12;
    const insetY = visualHeight / 2 + 12;
    const minX = Math.min(window.innerWidth / 2, insetX);
    const maxX = Math.max(minX, window.innerWidth - insetX);
    const minY = Math.min(window.innerHeight / 2, insetY);
    const maxY = Math.max(minY, window.innerHeight - insetY);
    const candidates = [];
    for (let i = 0; i < 55; i++) {
      const x = i < 4 ? (i % 2 ? maxX : minX) : minX + Math.random() * (maxX - minX);
      const y = i < 4 ? (i < 2 ? minY : maxY) : minY + Math.random() * (maxY - minY);
      const travel = Math.hypot(x - floatPosition.x, y - floatPosition.y);
      const fromPointer = pointer ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
      // Prefer long escapes without making every destination a screen corner.
      const score = travel + Math.min(fromPointer, 450) * (pointer ? .6 : 0)
        - (travel < 180 ? 500 : 0) + Math.random() * 115;
      candidates.push({ x, y, score });
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates[Math.floor(Math.random() * Math.min(5, candidates.length))];
  }

  function runAway(pointer) {
    if (result.classList.contains('show') || splitting) return;
    const now = performance.now();
    if (now - lastEscape < 240) return;
    lastEscape = now;
    launchNoButton();
    escapeCount++;
    escapeHint();
    const goal = pickDestination(pointer);
    floatPosition = { x: goal.x, y: goal.y };
    noBtn.classList.add('is-fleeing');
    placeNoButton();
    window.clearTimeout(noBtn._fleeTimer);
    noBtn._fleeTimer = window.setTimeout(() => noBtn.classList.remove('is-fleeing'), 490);
  }

  // No hover on a phone: the two *actual visible halves* burst apart, fly along
  // different paths, then reunite into one tappable pill at a new location.
  async function splitAndEscape() {
    if (result.classList.contains('show') || splitting) return;
    launchNoButton();
    splitting = true;
    escapeCount++;
    escapeHint();
    noBtn.classList.remove('is-fleeing');
    noBtn.style.transition = 'none';
    const from = { ...floatPosition };
    const goal = pickDestination(null);
    const dx = goal.x - from.x;
    const dy = goal.y - from.y;
    // Split pieces are full visual copies, each clipped to half the capsule.
    splitPieces = ['left', 'right'].map((side) => {
      const piece = noBtn.cloneNode(true);
      piece.removeAttribute('id');
      piece.removeAttribute('aria-label');
      piece.setAttribute('aria-hidden', 'true');
      piece.tabIndex = -1;
      piece.classList.remove('is-escaped', 'is-fleeing', 'is-churning');
      piece.classList.add('split-fragment', `fragment-${side}`, 'is-active');
      piece.style.width = `${floatWidth}px`;
      piece.style.height = `${floatHeight}px`;
      piece.style.left = `${from.x - floatWidth / 2}px`;
      piece.style.top = `${from.y - floatHeight / 2}px`;
      piece.style.transform = floatMatrix;
      document.body.appendChild(piece);
      return piece;
    });
    noBtn.style.opacity = '0';
    noBtn.style.pointerEvents = 'none';
    const burstX = clamp(window.innerWidth * .42, 110, 200);
    const burstY = clamp(window.innerHeight * .2, 85, 185);
    const duration = motionReduced.matches ? 180 : 1150;

    // Stop any old fragments if a replay/reset interrupted a flight.
    const flights = splitPieces.map((piece, index) => {
      const side = index === 0 ? -1 : 1;
      const base = floatMatrix;
      const frames = [
        { offset: 0, transform: `translate(0px, 0px) ${base}`, opacity: 1 },
        { offset: .28, transform: `translate(${side * burstX}px, ${side * burstY * .85}px) ${base} rotate(${side * 70}deg) scale(.92)`, opacity: 1 },
        { offset: .59, transform: `translate(${dx + side * 85}px, ${dy - side * 75}px) ${base} rotate(${side * -32}deg) scale(1.06)`, opacity: 1 },
        { offset: .85, transform: `translate(${dx + side * 11}px, ${dy - side * 12}px) ${base} rotate(${side * 7}deg)`, opacity: 1 },
        { offset: 1, transform: `translate(${dx}px, ${dy}px) ${base}`, opacity: 1 },
      ];
      const animation = piece.animate(frames, { duration, easing: 'cubic-bezier(.25,.65,.25,1)', fill: 'forwards' });
      splitAnimations.push(animation);
      return animation.finished.catch(() => {});
    });
    await Promise.all(flights);
    if (!splitting) return;
    floatPosition = { x: goal.x, y: goal.y };
    placeNoButton();
    noBtn.style.opacity = '';
    noBtn.style.pointerEvents = '';
    // Suppress the synthetic click that some touch devices dispatch after pointerdown.
    suppressClickUntil = performance.now() + 350;
    splitPieces.forEach((piece) => piece.remove());
    splitPieces = [];
    splitAnimations = [];
    noBtn.style.transition = '';
    splitting = false;
    lastEscape = performance.now();
  }

  function restoreNoButton() {
    splitAnimations.forEach((animation) => animation.cancel());
    splitAnimations = [];
    splitPieces.forEach((piece) => piece.remove());
    splitPieces = [];
    splitting = false;
    if (noSlot) {
      noSlot.replaceWith(noBtn);
      noSlot = null;
    }
    noBtn.classList.remove('is-escaped', 'is-fleeing');
    noBtn.style.removeProperty('left');
    noBtn.style.removeProperty('top');
    noBtn.style.removeProperty('width');
    noBtn.style.removeProperty('height');
    noBtn.style.removeProperty('transform');
    noBtn.style.removeProperty('transition');
    noBtn.style.removeProperty('opacity');
    noBtn.style.removeProperty('pointer-events');
    floatPosition = null;
    escapeCount = 0;
    lastEscape = 0;
  }

  yesBtn.addEventListener('click', revealLove);
  maybeBtn.addEventListener('click', () => activate(maybeBtn, 'TAKE YOUR TIME. MY HEART CAN WAIT. ♡', '02 / 03'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  noBtn.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && finePointer.matches) {
      runAway({ x: event.clientX, y: event.clientY });
    }
  });
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || splitting) return;
    const box = noBtn.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const near = Math.hypot(event.clientX - cx, event.clientY - cy) < (floatPosition ? 175 : 105);
    if (near) runAway({ x: event.clientX, y: event.clientY });
  }, { passive: true });
  noBtn.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && finePointer.matches) return;
    event.preventDefault();
    suppressClickUntil = performance.now() + 2000;
    void splitAndEscape();
  });
  noBtn.addEventListener('click', (event) => {
    if (performance.now() < suppressClickUntil) return;
    if (event.detail === 0) {
      // Keyboard navigation is still possible; only touch/mouse play tag.
      activate(noBtn, 'EVEN IF YOU PICK NO, YOU STILL GET A SMILE. ♡', '02 / 03');
    } else if (finePointer.matches) {
      runAway({ x: event.clientX, y: event.clientY });
    } else {
      void splitAndEscape();
    }
  });
  window.addEventListener('resize', () => {
    if (!floatPosition || splitting) return;
    floatMatrix = getComputedStyle(document.getElementById('pillRack')).transform;
    noBtn.style.transform = floatMatrix;
    noBtn.style.width = `${Math.min(floatWidth, window.innerWidth - 26)}px`;
    floatWidth = noBtn.offsetWidth;
    const box = noBtn.getBoundingClientRect();
    visualWidth = box.width;
    visualHeight = box.height;
    floatPosition.x = clamp(floatPosition.x, visualWidth / 2 + 12, window.innerWidth - visualWidth / 2 - 12);
    floatPosition.y = clamp(floatPosition.y, visualHeight / 2 + 12, window.innerHeight - visualHeight / 2 - 12);
    placeNoButton();
  });

  function reset() {
    result.classList.remove('show');
    result.setAttribute('aria-hidden', 'true');
    heartField.replaceChildren();
    pills.forEach((pill) => pill.classList.remove('is-active', 'is-churning'));
    restoreNoButton();
    active = null;
    hint.textContent = 'GO AHEAD. FOLLOW YOUR HEART.';
    hintNumber.textContent = '01 / 03';
    (previousFocus?.isConnected ? previousFocus : yesBtn).focus({ preventScroll: true });
  }
  replayBtn.addEventListener('click', reset);
  result.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') reset();
    if (event.key === 'Tab') {
      // There is one actionable control in the dialog; keep keyboard focus inside it.
      event.preventDefault();
      replayBtn.focus();
    }
  });

  themeBtn.addEventListener('click', () => {
    const dark = body.dataset.theme !== 'dark';
    body.dataset.theme = dark ? 'dark' : 'light';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    themeBtn.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
    themeBtn.querySelector('.theme-text').textContent = dark ? 'LIGHT' : 'DARK';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#16151b' : '#f5f2ed';
  });
})();

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
  const escapeCounter = document.getElementById('escapeCounter');
  const tauntToast = document.getElementById('tauntToast');
  const stageSticker = document.getElementById('stageSticker');
  const heartPortal = document.getElementById('heartPortal');
  const sparkField = document.getElementById('sparkField');
  const resultDescription = document.getElementById('resultDescription');
  const resultEyebrow = document.getElementById('resultEyebrow');
  const resultNote = document.getElementById('resultNote');
  const resultActionStatus = document.getElementById('resultActionStatus');
  const flowerExperience = document.getElementById('flowerExperience');
  const flowerFrame = document.getElementById('flowerFrame');
  const openFlowersBtn = document.getElementById('openFlowersBtn');
  const flowerCloseBtn = document.getElementById('closeFlowersBtn');
  const flowerBackBtn = document.getElementById('flowerBackBtn');
  const flowerReplayBtn = document.getElementById('flowerReplayBtn');
  let flowerTimer = 0;
  const linkBuilder = document.getElementById('linkBuilder');
  const builderForm = document.getElementById('builderForm');
  const linkOutput = document.getElementById('linkOutput');
  const generatedLink = document.getElementById('generatedLink');
  const linkFeedback = document.getElementById('linkFeedback');
  const personalized = {to: '', from: '', note: ''};
  let currentShareUrl = '';
  let resultTimer = 0;
  let tauntTimer = 0;
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

  // Original animated Flowers page is isolated in an iframe to prevent its
  // full-viewport CSS from interfering with Love Lab and the running No button.
  function bloomGarden() {
    if (!result.classList.contains('show') || flowerExperience.classList.contains('show')) return;
    window.clearTimeout(flowerTimer);
    flowerTimer = 0;
    document.getElementById('flowerRecipient').textContent = personalized.to || 'you';
    document.getElementById('flowerSender').textContent = personalized.from
      ? `These flowers are a little surprise from ${personalized.from}. You made their day. ♡`
      : 'Because saying yes deserves a whole garden. ♡';
    const note = document.getElementById('flowerNote');
    note.hidden = !personalized.note;
    note.textContent = personalized.note ? `“${personalized.note}”` : '';
    flowerFrame.src = `./flower-garden/index.html?bloom=${Date.now()}`;
    result.inert = true;
    result.setAttribute('aria-hidden', 'true');
    flowerExperience.inert = false;
    flowerExperience.classList.add('show');
    flowerExperience.setAttribute('aria-hidden', 'false');
    flowerCloseBtn.focus({ preventScroll: true });
  }
  function hideGarden(returnToResult = true) {
    window.clearTimeout(flowerTimer);
    flowerTimer = 0;
    if (!flowerExperience.classList.contains('show')) return;
    flowerExperience.classList.remove('show');
    flowerExperience.setAttribute('aria-hidden', 'true');
    flowerExperience.inert = true;
    flowerFrame.removeAttribute('src');
    result.inert = false;
    if (result.classList.contains('show')) {
      result.setAttribute('aria-hidden', 'false');
      if (returnToResult) openFlowersBtn.focus({ preventScroll: true });
    }
  }
  openFlowersBtn.addEventListener('click', bloomGarden);
  flowerCloseBtn.addEventListener('click', () => hideGarden());
  flowerBackBtn.addEventListener('click', () => hideGarden());
  flowerReplayBtn.addEventListener('click', () => {
    if (!flowerExperience.classList.contains('show')) return;
    flowerFrame.src = `./flower-garden/index.html?bloom=${Date.now()}`;
  });
  flowerExperience.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); hideGarden(); return; }
    if (event.key !== 'Tab') return;
    const buttons = [flowerCloseBtn, flowerReplayBtn, flowerBackBtn];
    const current = buttons.indexOf(document.activeElement);
    if (event.shiftKey && current <= 0) { event.preventDefault(); buttons.at(-1).focus(); }
    else if (!event.shiftKey && current === buttons.length - 1) { event.preventDefault(); buttons[0].focus(); }
  });

  function revealLove() {
    if (result.classList.contains('show') || resultTimer) return;
    activate(yesBtn, 'I KNEW WE WERE ON THE SAME WAVELENGTH ♥', '03 / 03');
    previousFocus = document.activeElement;
    resultEyebrow.textContent = personalized.to ? `A LITTLE YES FROM ${personalized.to.toLocaleUpperCase()}` : 'THE CUTEST ANSWER EVER';
    resultDescription.textContent = personalized.from
      ? `${personalized.from} just got the sweetest answer. The Love Lab experiment is officially complete. ♡`
      : 'This little love experiment has a very happy ending. ♡';
    resultNote.hidden = !personalized.note;
    resultNote.textContent = personalized.note ? `“${personalized.note}”` : '';
    resultActionStatus.textContent = '';
    const r = yesBtn.getBoundingClientRect();
    heartPortal.style.left = `${r.left + r.width / 2}px`;
    heartPortal.style.top = `${r.top + r.height / 2}px`;
    heartPortal.classList.remove('launch');
    void heartPortal.offsetWidth;
    if (!motionReduced.matches) heartPortal.classList.add('launch');
    resultTimer = window.setTimeout(() => {
      result.classList.add('show');
      result.setAttribute('aria-hidden', 'false');
      resultCard.focus({ preventScroll: true });
      makeHearts();
      makeSparks();
      resultTimer = 0;
      // Let the first celebration play, then reveal the surprise garden.
      flowerTimer = window.setTimeout(bloomGarden, motionReduced.matches ? 500 : 3800);
    }, motionReduced.matches ? 0 : 570);
  }

  function makeSparks() {
    sparkField.replaceChildren();
    if (motionReduced.matches) return;
    for (let i = 0; i < 34; i++) {
      const star = document.createElement('span');
      star.className = 'cinema-spark';
      star.textContent = i % 4 === 0 ? '✦' : '✧';
      star.style.setProperty('--x', `${Math.random() * 100}%`);
      star.style.setProperty('--y', `${Math.random() * 100}%`);
      star.style.setProperty('--s', `${9 + Math.random() * 18}px`);
      star.style.setProperty('--d', `${(Math.random() * 3).toFixed(2)}s`);
      sparkField.appendChild(star);
    }
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

  const noLines = [
    'WAIT... DID THAT BUTTON JUST MOVE? 👀',
    'TOO SLOW! TRY AGAIN 💨',
    'NOPE. NOT TODAY 😂',
    'THE BUTTON HAS TRUST ISSUES 😭',
    'IT LEARNED TELEPORTATION ✨',
    'CATCH ME IF YOU CAN 🏃',
    'ERROR 404: NO NOT FOUND 💗',
    'EVEN THE BUTTON KNOWS THE ANSWER 🤭',
    'I CAN DO THIS ALL DAY 😎'
  ];
  function escapeHint() {
    pills.forEach((pill) => pill.classList.toggle('is-active', pill === noBtn));
    noBtn.classList.remove('is-churning');
    const message = noLines[Math.min(escapeCount - 1, noLines.length - 1)];
    hint.textContent = message.toLocaleUpperCase();
    hintNumber.textContent = '02 / 03';
    escapeCounter.textContent = `${escapeCount} ESCAPE${escapeCount === 1 ? '' : 'S'} · ${escapeCount < 3 ? 'WARM UP' : escapeCount < 6 ? 'CHAOS MODE' : 'UNSTOPPABLE'}`;
    stageSticker.textContent = escapeCount < 3 ? 'IT CAN GET WORSE 😌' : escapeCount < 6 ? 'CHAOS MODE ACTIVATED ⚡' : 'LEGENDARY ESCAPE 💨';
    tauntToast.textContent = message;
    tauntToast.classList.add('visible');
    clearTimeout(tauntTimer);
    tauntTimer = window.setTimeout(() => tauntToast.classList.remove('visible'), 1700);
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
    if (result.classList.contains('show') || splitting || linkBuilder.open || resultTimer) return;
    const now = performance.now();
    if (now - lastEscape < Math.max(105, 250 - escapeCount * 18)) return;
    lastEscape = now;
    launchNoButton();
    escapeCount++;
    escapeHint();
    const goal = pickDestination(pointer);
    floatPosition = { x: goal.x, y: goal.y };
    noBtn.classList.add('is-fleeing');
    noBtn.style.setProperty('--flee-time', `${Math.max(155, 400 - escapeCount * 31)}ms`);
    placeNoButton();
    if (escapeCount >= 4) makeDecoy(floatPosition);
    window.clearTimeout(noBtn._fleeTimer);
    noBtn._fleeTimer = window.setTimeout(() => noBtn.classList.remove('is-fleeing'), 490);
  }

  // No hover on a phone: the two *actual visible halves* burst apart, fly along
  // different paths, then reunite into one tappable pill at a new location.
  async function splitAndEscape() {
    if (result.classList.contains('show') || splitting || linkBuilder.open || resultTimer) return;
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
    const duration = motionReduced.matches ? 1 : Math.max(720, 1170 - escapeCount * 58);

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
    noBtn.style.removeProperty('--flee-time');
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
    escapeCounter.textContent = '0 ESCAPES · GOOD LUCK';
    stageSticker.textContent = 'TRY TO SAY NO 👀';
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
    const near = Math.hypot(event.clientX - cx, event.clientY - cy) < (floatPosition ? Math.min(270, 180 + escapeCount * 12) : 115);
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
    hideGarden(false);
    clearTimeout(resultTimer);
    resultTimer = 0;
    heartPortal.classList.remove('launch');
    result.classList.remove('show');
    result.setAttribute('aria-hidden', 'true');
    heartField.replaceChildren();
    sparkField.replaceChildren();
    tauntToast.classList.remove('visible');
    pills.forEach((pill) => pill.classList.remove('is-active', 'is-churning'));
    restoreNoButton();
    active = null;
    hint.textContent = 'GO AHEAD. FOLLOW YOUR HEART.';
    hintNumber.textContent = '01 / 03';
    (previousFocus?.isConnected ? previousFocus : yesBtn).focus({ preventScroll: true });
  }
  replayBtn.addEventListener('click', reset);
  result.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); reset(); }
    if (event.key === 'Tab') {
      const choices = [...result.querySelectorAll('button:not([disabled])')];
      const index = choices.indexOf(document.activeElement);
      if (event.shiftKey && (index <= 0)) { event.preventDefault(); choices.at(-1).focus(); }
      else if (!event.shiftKey && (index === choices.length - 1)) { event.preventDefault(); choices[0].focus(); }
    }
  });

  function makeDecoy(position) {
    if (motionReduced.matches) return;
    const ghost = document.createElement('div');
    ghost.className = 'no-decoy';
    ghost.textContent = ['NO?', 'TOO SLOW', '💨'][escapeCount % 3];
    ghost.style.left = `${position.x}px`;
    ghost.style.top = `${position.y}px`;
    document.body.appendChild(ghost);
    ghost.addEventListener('animationend', () => ghost.remove(), { once: true });
    window.setTimeout(() => ghost.remove(), 1250);
  }

  const clean = (value, max) => String(value ?? '').replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  const isHosted = /^https?:$/.test(window.location.protocol);

  function usePersonalization(data) {
    personalized.to = clean(data.to, 32);
    personalized.from = clean(data.from, 32);
    personalized.note = clean(data.note, 140);
    const recipientGreeting = document.getElementById('personalGreeting');
    const intro = document.getElementById('introText');
    recipientGreeting.textContent = personalized.to
      ? `HEY ${personalized.to.toLocaleUpperCase()}, SOMEONE HAS A QUESTION FOR YOU`
      : "THE QUESTION I'VE BEEN WAITING TO ASK";
    intro.textContent = personalized.from
      ? `${personalized.from} sent you a little question. Be brave, choose an answer… and good luck catching No. ♡`
      : 'Okay, so... this is a little awkward. But my heart has one very important question for you.';
    document.title = personalized.to ? `${personalized.to}, a little question for you 💗 — Love Lab` : 'Do You Love Me? — Love Lab';
  }

  function buildUrl() {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    if (personalized.to) url.searchParams.set('to', personalized.to);
    if (personalized.from) url.searchParams.set('from', personalized.from);
    if (personalized.note) url.searchParams.set('note', personalized.note);
    return url.href;
  }

  function openBuilder() {
    if (result.classList.contains('show')) return;
    document.getElementById('toInput').value = personalized.to;
    document.getElementById('fromInput').value = personalized.from;
    document.getElementById('noteInput').value = personalized.note;
    linkOutput.hidden = true;
    linkFeedback.textContent = '';
    linkBuilder.showModal();
    document.getElementById('toInput').focus();
  }

  async function copyText(textToCopy) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try { await navigator.clipboard.writeText(textToCopy); return true; } catch (error) { /* fallback */ }
    }
    const input = document.createElement('textarea');
    input.value = textToCopy;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    input.remove();
    return copied;
  }

  ['makeLinkTop', 'makeLinkHero'].forEach((id) => document.getElementById(id).addEventListener('click', openBuilder));
  document.getElementById('closeBuilder').addEventListener('click', () => linkBuilder.close());
  linkBuilder.addEventListener('click', (event) => {
    if (event.target === linkBuilder) linkBuilder.close();
  });
  builderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    usePersonalization({
      to: document.getElementById('toInput').value,
      from: document.getElementById('fromInput').value,
      note: document.getElementById('noteInput').value
    });
    currentShareUrl = buildUrl();
    if (isHosted) window.history.replaceState(null, '', currentShareUrl);
    generatedLink.value = isHosted ? currentShareUrl : 'Open the hosted website to generate a shareable link';
    document.getElementById('copyLinkBtn').disabled = !isHosted;
    document.getElementById('nativeShareBtn').disabled = !isHosted;
    linkOutput.hidden = false;
    linkFeedback.textContent = isHosted
      ? `Ready for ${personalized.to}! Copy the link or send it to them.`
      : `Your personalised preview is ready. This local HTML file can't be shared as a public link yet. Use this builder after the site is deployed.`;
  });
  document.getElementById('copyLinkBtn').addEventListener('click', async () => {
    if (!isHosted) return;
    const copied = await copyText(currentShareUrl);
    linkFeedback.textContent = copied ? 'Link copied! Go prank someone 💌' : 'Copy failed — select the link above and copy it manually.';
  });
  document.getElementById('nativeShareBtn').addEventListener('click', async () => {
    if (!isHosted) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${personalized.to}, someone has a question for you 💗`, text: 'Try to catch the No button 😂', url: currentShareUrl });
        linkFeedback.textContent = 'Share menu opened ♡';
      } catch (error) { if (error.name !== 'AbortError') linkFeedback.textContent = 'Sharing was unavailable. Try Copy instead.'; }
    } else {
      const copied = await copyText(currentShareUrl);
      linkFeedback.textContent = copied ? 'Share link copied! ♡' : 'Please copy the URL from the field above.';
    }
  });
  document.getElementById('previewLinkBtn').addEventListener('click', () => {
    linkBuilder.close();
    resetWithoutFocus();
    window.scrollTo({ top: 0, behavior: motionReduced.matches ? 'instant' : 'smooth' });
  });

  function resetWithoutFocus() {
    hideGarden(false);
    clearTimeout(resultTimer);
    resultTimer = 0;
    heartPortal.classList.remove('launch');
    result.classList.remove('show');
    result.setAttribute('aria-hidden', 'true');
    heartField.replaceChildren();
    sparkField.replaceChildren();
    pills.forEach(p => p.classList.remove('is-active','is-churning'));
    restoreNoButton();
    tauntToast.classList.remove('visible');
    hint.textContent = 'GO AHEAD. FOLLOW YOUR HEART.';
    hintNumber.textContent = '01 / 03';
  }

  const startParams = new URLSearchParams(window.location.search);
  usePersonalization({ to: startParams.get('to'), from: startParams.get('from'), note: startParams.get('note') });
  currentShareUrl = buildUrl();

  function wrapCanvasText(ctx, text, maxWidth, maxLines) {
    const chunks = [];
    for (const word of String(text).split(/\s+/).filter(Boolean)) {
      if (ctx.measureText(word).width <= maxWidth) { chunks.push(word); continue; }
      let part = '';
      for (const letter of word) {
        if (part && ctx.measureText(part + letter).width > maxWidth) {
          chunks.push(part);
          part = letter;
        } else part += letter;
      }
      if (part) chunks.push(part);
    }
    const lines = [];
    let line = '';
    for (const word of chunks) {
      const proposed = line ? `${line} ${word}` : word;
      if (ctx.measureText(proposed).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = proposed;
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      lines.length = maxLines;
      let finalLine = lines[maxLines - 1];
      while (finalLine && ctx.measureText(`${finalLine}…`).width > maxWidth) {
        finalLine = finalLine.slice(0, -1);
      }
      lines[maxLines - 1] = `${finalLine}…`;
    }
    return lines;
  }

  function makeResultCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const c = canvas.getContext('2d');
    const bg = c.createLinearGradient(0, 0, 1080, 1350);
    bg.addColorStop(0, '#2c152a'); bg.addColorStop(.6, '#471a40'); bg.addColorStop(1, '#190e20');
    c.fillStyle = bg; c.fillRect(0, 0, 1080, 1350);
    for (let i = 0; i < 38; i++) {
      const angle = i * 2.39996;
      const radius = 70 + Math.sqrt(i / 38) * 610;
      const x = 540 + Math.cos(angle) * radius;
      const y = 510 + Math.sin(angle) * radius;
      c.fillStyle = i % 4 ? '#f19bb423' : '#ffffff23';
      c.beginPath(); c.arc(x, y, (i % 5) + 2, 0, Math.PI * 2); c.fill();
    }
    c.strokeStyle = '#f5a6c84b'; c.lineWidth = 2;
    c.beginPath(); c.roundRect(50, 50, 980, 1250, 40); c.stroke();
    c.textAlign = 'center';
    c.fillStyle = '#f8b2ce'; c.font = '700 26px Manrope, Arial, sans-serif';
    c.fillText('L O V E   L A B   /   0 0 2', 540, 142);
    c.fillStyle = '#ff83b3'; c.font = '220px Georgia, serif'; c.fillText('♥', 540, 468);
    c.fillStyle = '#ffffff'; c.font = 'bold 103px Manrope, Arial, sans-serif';
    c.fillText('THE ANSWER', 540, 644);
    c.fillStyle = '#ffa5c5'; c.font = 'italic 128px Georgia, serif'; c.fillText('was YES.', 540, 763);
    const recipient = personalized.to || 'Someone special';
    const sender = personalized.from || 'Someone who cares';
    c.fillStyle = '#f0d2df'; c.font = '500 34px Manrope, Arial, sans-serif';
    const names = wrapCanvasText(c, `${recipient} ♥ ${sender}`, 810, 2);
    names.forEach((line, i) => c.fillText(line, 540, 858 + i * 46));
    if (personalized.note) {
      c.font = 'italic 30px Georgia, serif'; c.fillStyle = '#f9c5d7';
      const notes = wrapCanvasText(c, `“${personalized.note}”`, 840, 3);
      notes.forEach((line, i) => c.fillText(line, 540, 975 + i * 44));
    }
    c.fillStyle = '#c998b2'; c.font = '600 22px Manrope, Arial, sans-serif';
    c.fillText(`${escapeCount} NO-BUTTON ESCAPE${escapeCount === 1 ? '' : 'S'}  ·  ONE VERY HAPPY ENDING`, 540, 1195);
    c.fillStyle = '#efb2ca'; c.font = '700 24px Manrope, Arial, sans-serif';
    c.fillText('MADE WITH LOVE, NOT LOGIC ♡', 540, 1250);
    return canvas;
  }

  document.getElementById('downloadCardBtn').addEventListener('click', () => {
    const canvas = makeResultCanvas();
    canvas.toBlob((blob) => {
      if (!blob) { resultActionStatus.textContent = 'Could not make the image. Try again.'; return; }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const name = (personalized.to || 'love').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 28) || 'love';
      anchor.download = `love-lab-${name}.png`;
      anchor.href = url;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      resultActionStatus.textContent = 'Your shareable result card has been saved 💗';
    }, 'image/png');
  });
  document.getElementById('shareResultBtn').addEventListener('click', async () => {
    const text = `${personalized.to || 'Someone special'} said YES! 💗 ${personalized.from ? `A little love prank from ${personalized.from}. ` : ''}${escapeCount} No-button escapes later, love won. ♡`;
    const sharePayload = { title: 'Love Lab — The answer was YES! 💗', text };
    if (isHosted) sharePayload.url = buildUrl();
    if (navigator.share) {
      try { await navigator.share(sharePayload); resultActionStatus.textContent = 'Share menu opened ♡'; }
      catch (error) { if (error.name !== 'AbortError') resultActionStatus.textContent = 'Sharing failed. You can save the card instead.'; }
    } else {
      resultActionStatus.textContent = await copyText(`${text}${isHosted ? ` ${buildUrl()}` : ''}`)
        ? 'Result message copied! ♡' : 'Save the card to share it instead.';
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

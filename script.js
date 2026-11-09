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

  function runAway() {
    if (result.classList.contains('show')) return;
    const now = performance.now();
    if (now - lastEscape < 340) return;
    lastEscape = now;
    escapeCount++;
    const horizontal = escapeCount % 2 ? -1 : 1;
    const vertical = escapeCount % 3 === 0 ? -1 : 1;
    const x = horizontal * (24 + Math.random() * 52);
    const y = vertical * (12 + Math.random() * 23);
    noBtn.style.setProperty('--escape-x', `${x}px`);
    noBtn.style.setProperty('--escape-y', `${y}px`);
    activate(noBtn, escapeCount < 3 ? 'HEY! THAT BUTTON IS A LITTLE SHY.' : 'THE “NO” BUTTON REALLY DOES NOT WANT TO BE CHOSEN.', '02 / 03');
  }

  yesBtn.addEventListener('click', revealLove);
  maybeBtn.addEventListener('click', () => activate(maybeBtn, 'TAKE YOUR TIME. MY HEART CAN WAIT. ♡', '02 / 03'));
  noBtn.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) runAway();
  });
  noBtn.addEventListener('click', (event) => {
    // Allow a real response with keyboard controls, rather than trapping focus.
    if (event.detail === 0) {
      activate(noBtn, 'EVEN IF YOU PICK NO, YOU STILL GET A SMILE. ♡', '02 / 03');
    } else {
      runAway();
    }
  });

  function reset() {
    result.classList.remove('show');
    result.setAttribute('aria-hidden', 'true');
    heartField.replaceChildren();
    pills.forEach((pill) => pill.classList.remove('is-active', 'is-churning'));
    noBtn.style.setProperty('--escape-x', '0px');
    noBtn.style.setProperty('--escape-y', '0px');
    escapeCount = 0;
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


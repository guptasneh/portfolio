/* ============================================================
   EASTER EGG — Type "hello" anywhere → Matrix rain (3 seconds)
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let buffer   = '';
  let rafId    = null;
  let active   = false;
  let fadeOut  = false;
  let opacity  = 0;

  const CHARS  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01001100101ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let drops    = [];
  let cols     = 0;

  function setup() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 16);
    drops = Array(cols).fill(1);
  }

  function drawMatrix() {
    // Semi-transparent black to create trail
    ctx.fillStyle = `rgba(10, 10, 15, 0.06)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font      = '14px JetBrains Mono, monospace';

    drops.forEach((y, i) => {
      // Random char
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x    = i * 16;

      // Head glow (white)
      if (Math.random() > 0.95) {
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      } else {
        const bright  = Math.random();
        const g       = Math.floor(180 + bright * 75);
        ctx.fillStyle = `rgba(0,${g},${Math.floor(g * 0.5)},${opacity * 0.9})`;
      }

      ctx.fillText(char, x, y * 16);

      // Reset drop randomly
      if (y * 16 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  function startMatrix() {
    if (active) return;
    active   = true;
    fadeOut  = false;
    opacity  = 0;
    setup();
    canvas.classList.add('active');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startTime = performance.now();
    const DURATION = 3000; // 3 seconds

    function loop(now) {
      const elapsed = now - startTime;

      // Fade in / out
      if (elapsed < 400) {
        opacity = elapsed / 400;
      } else if (elapsed > DURATION - 600) {
        opacity = Math.max(0, 1 - (elapsed - (DURATION - 600)) / 600);
      } else {
        opacity = 1;
      }

      drawMatrix();

      if (elapsed >= DURATION) {
        cancelAnimationFrame(rafId);
        canvas.classList.remove('active');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        active = false;
        return;
      }
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
  }

  // ── Keyboard listener ──────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    // Don't trigger when user is typing in a form field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    buffer += e.key.toLowerCase();
    // Keep last 5 chars
    if (buffer.length > 5) buffer = buffer.slice(-5);

    if (buffer.endsWith('hello')) {
      buffer = '';
      startMatrix();
    }
  });

  // ── Resize ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (active) setup();
  });
})();

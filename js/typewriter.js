/* ============================================================
   TYPEWRITER — Name glitch + role cycling with smooth morph
   ============================================================ */

(function () {
  'use strict';

  // ── Hero name entrance ─────────────────────────────────────
  const nameLines = document.querySelectorAll('.name-line');
  nameLines.forEach((el, i) => {
    el.style.animation = `slide-up-fade 0.8s cubic-bezier(0.23,1,0.32,1) ${1.8 + i * 0.15}s forwards`;
  });

  // Hero subtitle + tagline + CTA entrance
  const heroEls = [
    { el: document.querySelector('.hero-subtitle'), delay: 2.2 },
    { el: document.querySelector('.hero-tagline'),  delay: 2.5 },
    { el: document.querySelector('.hero-cta'),      delay: 2.8 },
    { el: document.querySelector('.hero-badge'),    delay: 1.6 },
  ];
  heroEls.forEach(({ el, delay }) => {
    if (!el) return;
    el.style.animation = `slide-up-fade 0.7s ease ${delay}s forwards`;
  });

  // ── Glitch on first name line ──────────────────────────────
  function triggerGlitch() {
    const target = document.querySelector('.name-line.accent');
    if (!target) return;
    target.setAttribute('data-text', target.textContent);
    target.classList.add('glitch-active');
    setTimeout(() => target.classList.remove('glitch-active'), 450);
  }
  setTimeout(triggerGlitch, 3400);

  // ── Role cycling ──────────────────────────────────────────
  const ROLES = [
    'ML Engineer',
    'AI Researcher',
    'Model Builder',
    'Deep Learning Dev',
    'GenAI Builder',
  ];

  const roleEl = document.getElementById('hero-role');
  if (!roleEl) return;

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pausing  = false;
  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 300;

  function typeRole() {
    if (pausing) return;

    const current = ROLES[roleIdx];

    if (!deleting) {
      // Type forward
      roleEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pausing = true;
        setTimeout(() => { pausing = false; deleting = true; }, PAUSE_AFTER);
      }
    } else {
      // Delete
      roleEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % ROLES.length;
        pausing  = true;
        setTimeout(() => { pausing = false; }, PAUSE_BEFORE);
      }
    }

    const speed = deleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(typeRole, speed + Math.random() * 20);
  }

  // Start after loader finishes
  setTimeout(typeRole, 3200);
})();

/* ============================================================
   CURSOR — Custom dot + ring that react to hoverable elements
   ============================================================ */

(function () {
  'use strict';

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  // Lerp speed for ring (lower = slower / more elastic)
  const LERP = 0.12;

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  function animate() {
    // Ring follows with lerp
    ringX = lerp(ringX, mouseX, LERP);
    ringY = lerp(ringY, mouseY, LERP);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // React to hoverable elements
  const hoverTargets = 'a, button, [data-magnetic], .project-card, .filter-btn, .nav-link, input, textarea, .contact-link, .skill-node';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving viewport
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Click ripple
  document.addEventListener('mousedown', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(0.7)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.8)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
})();

/* ============================================================
   PROJECTS — Filter bar + card flip setup
   ============================================================ */

(function () {
  'use strict';

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  const grid       = document.getElementById('projects-grid');

  if (!filterBtns.length || !cards.length) return;

  let activeFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter === activeFilter) return;

      activeFilter = filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          // Brief delay so display:'' can take effect before animation
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.88) translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.23,1,0.32,1)';
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            });
          });
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.9) translateY(10px)';
          setTimeout(() => {
            if (card.dataset.category !== activeFilter && activeFilter !== 'all') {
              card.style.display = 'none';
            }
          }, 260);
        }
      });
    });
  });

  // ── Tilt setup (wait for lib) ─────────────────────────────
  function initTilt() {
    if (typeof VanillaTilt === 'undefined') {
      setTimeout(initTilt, 100);
      return;
    }
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max:           8,
      speed:         400,
      glare:         true,
      'max-glare':   0.12,
      perspective:   800,
      scale:         1.02,
      gyroscope:     true,
    });
  }
  initTilt();

  // ── Stagger entrance on scroll ────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cardEls = entry.target.querySelectorAll('.project-card');
        cardEls.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (grid) {
    // Set initial hidden state
    cards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
    observer.observe(grid);
  }
})();

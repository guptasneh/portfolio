/* ============================================================
   GSAP ANIMATIONS — ScrollTrigger, counters, timeline reveals
   ============================================================ */

(function () {
  'use strict';

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAP, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin !== 'undefined') gsap.registerPlugin(TextPlugin);

    // ── Helper: batch reveal for section children ─────────────
    function revealSection(selector, vars = {}) {
      gsap.utils.toArray(selector).forEach(el => {
        gsap.from(el, {
          opacity:    0,
          y:          50,
          duration:   0.8,
          ease:       'power3.out',
          scrollTrigger: {
            trigger: el,
            start:   'top 88%',
            toggleActions: 'play none none none',
          },
          ...vars,
        });
      });
    }

    // ── Section headers ───────────────────────────────────────
    gsap.utils.toArray('.section-header').forEach(header => {
      const tag   = header.querySelector('.section-tag');
      const title = header.querySelector('.section-title');
      const sub   = header.querySelector('.section-sub');
      const tl    = gsap.timeline({
        scrollTrigger: { trigger: header, start: 'top 85%' },
      });
      if (tag)   tl.from(tag,   { opacity: 0, y: 20, duration: 0.5 });
      if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.2');
      if (sub)   tl.from(sub,   { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
    });

    // ── About section ─────────────────────────────────────────
    gsap.from('.about-photo-wrap', {
      opacity: 0, x: -60, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
    });
    gsap.from('.about-text > *', {
      opacity: 0, x: 60, duration: 0.8, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
    });

    // ── Animated counters ─────────────────────────────────────
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate() {
              counter.textContent = Math.floor(parseFloat(counter.innerHTML));
            },
          });
        },
      });
    });

    // ── Terminal typed output ─────────────────────────────────
    const terminalOutput = document.getElementById('terminal-output');
    const FACTS = [
      '🐍 Python lines written: <span>~400,000</span>',
      '☕ Coffees consumed: <span>1,337</span>',
      '📄 Papers read: <span>200+</span>',
      '🏆 Kaggle rank: <span>Top 3%</span>',
      '🌙 Late-night debug sessions: <span>countless</span>',
    ];

    if (terminalOutput) {
      ScrollTrigger.create({
        trigger: terminalOutput,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          FACTS.forEach((fact, i) => {
            setTimeout(() => {
              const line = document.createElement('div');
              line.className = 't-output-line';
              line.innerHTML = fact;
              line.style.animationDelay = '0s';
              terminalOutput.appendChild(line);
            }, i * 300);
          });
        },
      });
    }

    // ── Skills section reveal ─────────────────────────────────
    gsap.from('#skills-canvas', {
      opacity: 0, scale: 0.85, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-section', start: 'top 75%' },
    });
    gsap.from('.skills-info-panel', {
      opacity: 0, x: 60, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-section', start: 'top 75%' },
    });
    gsap.from('.legend-item', {
      opacity: 0, y: 20, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: '.skills-legend', start: 'top 90%' },
    });

    // ── Timeline items ────────────────────────────────────────
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      const side = item.dataset.side;
      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        once: true,
        onEnter: () => item.classList.add('visible'),
      });
    });

    // ── Certifications section ────────────────────────────────
    gsap.from('.cert-card', {
      opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.certs-grid', start: 'top 85%' },
    });

    // ── Contact section ───────────────────────────────────────
    gsap.from('.contact-form-wrap', {
      opacity: 0, x: -60, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-section', start: 'top 80%' },
    });
    gsap.from('.contact-info', {
      opacity: 0, x: 60, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-section', start: 'top 80%' },
    });

    // ── Footer ────────────────────────────────────────────────
    gsap.from('.footer-inner > *', {
      opacity: 0, y: 20, stagger: 0.15, duration: 0.6,
      scrollTrigger: { trigger: '.footer', start: 'top 95%' },
    });

    // ── Magnetic button effect ────────────────────────────────
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const STRENGTH = 0.35;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * STRENGTH;
        const dy   = (e.clientY - cy) * STRENGTH;
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  initGSAP();
})();

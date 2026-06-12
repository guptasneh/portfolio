/* ============================================================
   MAIN — Bootstrap: loader, navbar, particles, mobile menu
   ============================================================ */

(function () {
  'use strict';

  // ── Page loader ────────────────────────────────────────────
  const loader = document.getElementById('page-loader');

  function hideLoader() {
    document.body.classList.remove('loading');
    if (!loader) return;
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  // Show loader while fonts + assets load
  document.body.classList.add('loading');
  // Hide after 2.8s (enough for intro anim + progress fill)
  setTimeout(hideLoader, 2800);

  // ── Navbar ─────────────────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.nav-indicator');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Smooth scroll on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeMobileMenu();
    });
  });

  // Active section indicator underline
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let active     = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        active = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === active);
    });

    // Move indicator underline
    if (indicator) {
      const activeLink = document.querySelector(`.nav-link[data-section="${active}"]`);
      if (activeLink) {
        const rect       = activeLink.getBoundingClientRect();
        const navRect    = navbar.getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.left    = (rect.left - navRect.left) + 'px';
        indicator.style.width   = rect.width + 'px';
        indicator.style.top     = (activeLink.offsetTop + activeLink.offsetHeight + 4) + 'px';
      } else {
        indicator.style.opacity = '0';
      }
    }
  }

  // ── Mobile menu ────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.getElementById('mobile-close');

  function openMobileMenu() {
    mobileMenu.removeAttribute('hidden');
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => mobileMenu.setAttribute('hidden', ''), 300);
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
  closeBtn?.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      closeMobileMenu();
      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ── tsParticles ────────────────────────────────────────────
  function initParticles() {
    if (typeof tsParticles === 'undefined') {
      setTimeout(initParticles, 100);
      return;
    }

    tsParticles.load('tsparticles', {
      fpsLimit: 60,
      particles: {
        number: {
          value: 55,
          density: { enable: true, area: 900 },
        },
        color: { value: ['#00FFD1', '#7B61FF', '#ffffff'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.05, max: 0.4 },
          animation: { enable: true, speed: 0.6, sync: false },
        },
        size: {
          value: { min: 1, max: 2.5 },
          animation: { enable: true, speed: 1, sync: false },
        },
        links: {
          enable: true,
          distance: 140,
          color: '#00FFD1',
          opacity: 0.08,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: 'none',
          random: true,
          straight: false,
          outModes: 'bounce',
          attract: { enable: false },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: ['grab', 'bubble'],
          },
          onClick: { enable: true, mode: 'push' },
          resize: true,
        },
        modes: {
          grab:   { distance: 180, links: { opacity: 0.5 } },
          bubble: { distance: 150, size: 5, duration: 0.3, opacity: 0.8 },
          push:   { quantity: 3 },
        },
      },
      detectRetina: true,
      background: { color: 'transparent' },
    });
  }

  // Delay particles until after loader
  setTimeout(initParticles, 3000);

  // ── Smooth scroll for all anchor links ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── About section: Vanilla Tilt on photo card ─────────────
  function initPhotoTilt() {
    if (typeof VanillaTilt === 'undefined') {
      setTimeout(initPhotoTilt, 100);
      return;
    }
    const photoEl = document.querySelector('.about-photo-wrap');
    if (photoEl) {
      VanillaTilt.init(photoEl, {
        max: 15, speed: 400, glare: true, 'max-glare': 0.25,
        perspective: 900, scale: 1.02,
      });
    }
  }
  initPhotoTilt();

  // ── Initial active link update ────────────────────────────
  updateActiveLink();
})();

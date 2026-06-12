/* ============================================================
   CONTACT — Form validation + particle burst on submit
   ============================================================ */

(function () {
  'use strict';

  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('form-submit');
  if (!form || !submit) return;

  const submitText  = submit.querySelector('.submit-text');
  const submitIcon  = submit.querySelector('.submit-icon');
  const submitCheck = submit.querySelector('.submit-check');

  // ── Particle burst ─────────────────────────────────────────
  function particleBurst(originEl) {
    const rect   = originEl.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const COUNT  = 24;
    const COLORS = ['#00FFD1', '#7B61FF', '#ffffff', '#00ff88'];

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      const angle   = (i / COUNT) * Math.PI * 2;
      const speed   = 60 + Math.random() * 100;
      const size    = 4 + Math.random() * 6;
      const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      const tx      = Math.cos(angle) * speed;
      const ty      = Math.sin(angle) * speed;

      Object.assign(p.style, {
        position:     'fixed',
        left:         cx + 'px',
        top:          cy + 'px',
        width:        size + 'px',
        height:       size + 'px',
        borderRadius: '50%',
        background:   color,
        pointerEvents:'none',
        zIndex:       '9999',
        transform:    'translate(-50%,-50%)',
        transition:   `transform 0.8s ease-out, opacity 0.8s ease-out`,
        willChange:   'transform, opacity',
      });

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        p.style.opacity   = '0';
      });

      setTimeout(() => p.remove(), 900);
    }
  }

  // ── Validation ─────────────────────────────────────────────
  function validate() {
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name)             return 'Please enter your name.';
    if (!emailRe.test(email)) return 'Please enter a valid email.';
    if (!message)          return 'Please write a message.';
    return null;
  }

  // ── Submit ─────────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      // Shake form
      form.style.animation = 'none';
      requestAnimationFrame(() => {
        form.style.animation = 'shake 0.4s ease';
      });
      showToast(error, 'error');
      return;
    }

    // Transition button → loading
    submit.disabled = true;
    submitText.style.opacity = '0';
    submitIcon.style.opacity = '0';

    // Simulate network (replace with real fetch if needed)
    setTimeout(() => {
      // Success state
      submitText.classList.add('hidden');
      submitIcon.classList.add('hidden');
      submitCheck.classList.remove('hidden');
      submit.style.background = '#00FFD1';
      submit.style.color = '#0A0A0F';
      submit.style.borderColor = '#00FFD1';

      particleBurst(submit);
      showToast('Message sent! I\'ll reply soon. 🚀', 'success');

      // Reset after 3s
      setTimeout(() => {
        submitCheck.classList.add('hidden');
        submitText.classList.remove('hidden');
        submitIcon.classList.remove('hidden');
        submitText.style.opacity = '1';
        submitIcon.style.opacity = '1';
        submit.style.background = '';
        submit.style.color = '';
        submit.style.borderColor = '';
        submit.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    Object.assign(toast.style, {
      position:      'fixed',
      bottom:        '2rem',
      right:         '2rem',
      padding:       '0.8rem 1.5rem',
      background:    type === 'success' ? 'rgba(0,255,209,0.12)' : 'rgba(255,50,50,0.12)',
      border:        `1px solid ${type === 'success' ? '#00FFD1' : '#ff3232'}`,
      color:         type === 'success' ? '#00FFD1' : '#ff6464',
      borderRadius:  '8px',
      fontSize:      '0.875rem',
      fontFamily:    'JetBrains Mono, monospace',
      zIndex:        '9999',
      backdropFilter:'blur(12px)',
      transform:     'translateY(20px)',
      opacity:       '0',
      transition:    'transform 0.3s ease, opacity 0.3s ease',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity   = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity   = '0';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // Inject shake animation
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);
})();

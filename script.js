/* =========================================================
   IRONVAULT FITNESS — SCRIPT
   Nav scroll state, mobile menu, scroll-reveal, form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const toggleNavScrolled = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  toggleNavScrolled();
  window.addEventListener('scroll', toggleNavScrolled, { passive: true });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after tapping a link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll-reveal fade-ins ---------- */
  const revealTargets = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support, just show everything
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: (value) => value.trim().length > 1 || 'Please enter your name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address.',
    phone: (value) => value.trim().length >= 7 || 'Enter a valid phone number.',
    goal: (value) => value.trim().length > 0 || 'Please select a goal.',
  };

  const setFieldError = (field, message) => {
    const wrapper = field.closest('.form__field');
    const errorEl = document.getElementById(`${field.id}Error`);
    if (message) {
      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    } else {
      wrapper.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    }
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;
    const result = rule(field.value);
    setFieldError(field, result === true ? '' : result);
    return result === true;
  };

  ['name', 'email', 'phone', 'goal'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    let isValid = true;
    ['name', 'email', 'phone', 'goal'].forEach((id) => {
      const field = document.getElementById(id);
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // No backend wired up — this is a portfolio/demo form.
    successMsg.textContent = "Thanks — we'll be in touch shortly.";
    form.reset();
  });

});

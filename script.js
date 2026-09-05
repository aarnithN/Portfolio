document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  const revealSelectors = [
    '.section-label',
    '.section-title',
    '.section-subtitle',
    '.about-content p',
    '.skill-panel',
    '.resume-column',
    '.project-card',
    '.contact-links'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Scroll-spy navigation ---------- */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (!activeLink) return;
          navLinks.forEach((l) => l.classList.remove('active'));
          activeLink.classList.add('active');
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Hero stat count-up ---------- */
  const statEls = document.querySelectorAll('.hero-stat-number');

  const formatValue = (value, decimals, suffix) => value.toFixed(decimals) + suffix;

  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1300;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(target * eased, decimals, suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statEls.length) {
    if (reduceMotion) {
      statEls.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-count-to'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = formatValue(target, decimals, suffix);
      });
    } else {
      const statObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      statEls.forEach((el) => statObserver.observe(el));
    }
  }
});
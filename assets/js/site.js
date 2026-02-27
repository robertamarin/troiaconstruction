(function () {
  const ready = () => {
    /* ─── Mobile Navigation ─── */
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');

    if (toggle && nav) {
      const body = document.body;
      const openClass = 'nav-open';
      const mobileQuery = window.matchMedia('(max-width: 820px)');

      const setExpanded = (expanded) => {
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

        if (expanded) {
          body.classList.add(openClass);
        } else {
          body.classList.remove(openClass);
        }

        if (mobileQuery.matches) {
          nav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        } else {
          nav.removeAttribute('aria-hidden');
        }
      };

      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        setExpanded(!isExpanded);
      });

      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setExpanded(false));
      });

      document.addEventListener('click', (event) => {
        if (!body.classList.contains(openClass)) return;
        if (event.target.closest('.site-nav') || event.target.closest('.nav-toggle')) return;
        setExpanded(false);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setExpanded(false);
      });

      const handleChange = () => setExpanded(false);

      if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', handleChange);
      } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(handleChange);
      }

      setExpanded(false);
    }

    /* ─── Call Now Button ─── */
    const callButtons = document.querySelectorAll('.btn-call-now');

    callButtons.forEach((button) => {
      const targetSelector = button.getAttribute('data-target');
      if (!targetSelector) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      const phoneLink = target.querySelector('a');

      button.addEventListener('click', () => {
        const wasHidden = target.hasAttribute('hidden');

        if (wasHidden) {
          target.removeAttribute('hidden');
          button.setAttribute('aria-expanded', 'true');
        }

        if (phoneLink) {
          try {
            phoneLink.focus({ preventScroll: true });
          } catch (e) {
            phoneLink.focus();
          }

          const clickLink = () => {
            if (typeof phoneLink.click === 'function') {
              phoneLink.click();
              return true;
            }
            const href = phoneLink.getAttribute('href');
            if (href) {
              window.location.href = href;
              return true;
            }
            return false;
          };

          if (wasHidden) {
            requestAnimationFrame(() => clickLink());
          } else {
            clickLink();
          }
        }
      });
    });

    /* ─── Scroll Reveal Animations (progressive enhancement) ─── */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
      // Only enable reveal animations once we know IntersectionObserver works
      document.body.classList.add('reveal-ready');

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    }
    // If IntersectionObserver isn't available, elements stay fully visible (no reveal-ready class = no hiding)

    /* ─── Animated Counters (if needed in future) ─── */

    /* ─── Header shadow on scroll ─── */
    const header = document.querySelector('.site-header');
    if (header) {
      const scrollHandler = () => {
        const scrollY = window.scrollY;
        if (scrollY > 40) {
          header.style.boxShadow = '0 1px 12px rgba(23, 32, 48, 0.06)';
          header.style.borderBottomColor = 'rgba(23, 32, 48, 0.04)';
        } else {
          header.style.boxShadow = 'none';
          header.style.borderBottomColor = 'rgba(23, 32, 48, 0.06)';
        }
      };

      window.addEventListener('scroll', scrollHandler, { passive: true });
      scrollHandler();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();

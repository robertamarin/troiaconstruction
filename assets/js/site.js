(function () {
  const ready = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');

    if (!toggle || !nav) {
      return;
    }

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
      if (!body.classList.contains(openClass)) {
        return;
      }

      if (event.target.closest('.site-nav') || event.target.closest('.nav-toggle')) {
        return;
      }

      setExpanded(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    });

    const handleChange = () => setExpanded(false);

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleChange);
    }

    setExpanded(false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();

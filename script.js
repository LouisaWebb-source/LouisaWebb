(() => {
  // Privacy-friendly, cookieless visitor statistics for all site pages.
  const analytics = document.createElement('script');
  analytics.async = true;
  analytics.src = 'https://gc.zgo.at/count.js';
  analytics.dataset.goatcounter = 'https://louisawebb.goatcounter.com/count';

  // Anonymous click events for the main reader actions.
  const trackedLinks = [
    ['a[href="https://a.co/d/08CE61fI"]', 'click-preorder-amazon', 'Pre-order on Amazon'],
    ['a[href="excerpt.html"]', 'click-read-excerpt', 'Read the excerpt'],
    ['a[href="trigger-warnings/"]', 'click-trigger-warnings', 'Read trigger warnings'],
    ['a[href*="goodreads.com/book/show/257485719-abducted-into-fairyland"]', 'click-goodreads', 'View on Goodreads'],
    ['a[href*="instagram.com/louisa_webb_author"]', 'click-instagram', 'Open Instagram'],
    ['a[href*="facebook.com/profile.php"]', 'click-facebook', 'Open Facebook']
  ];

  trackedLinks.forEach(([selector, eventPath, title]) => {
    document.querySelectorAll(selector).forEach(link => {
      link.dataset.goatcounterClick = eventPath;
      link.dataset.goatcounterTitle = title;
    });
  });

  analytics.addEventListener('load', () => {
    // Record each homepage section once when at least half of it is visible.
    if (!document.querySelector('.hero') || !window.goatcounter?.count) return;

    const sections = [
      ['.hero', 'section-hero', 'Homepage section: Hero'],
      ['.social-banner', 'section-social', 'Homepage section: Social links'],
      ['#books', 'section-book-one', 'Homepage section: Book One'],
      ['#newsletter', 'section-newsletter', 'Homepage section: Newsletter'],
      ['#fairyland', 'section-fairyland', 'Homepage section: Inside Fairyland'],
      ['#series', 'section-series', 'Homepage section: Series'],
      ['#warnings', 'section-warnings', 'Homepage section: Trigger Warnings'],
      ['#about', 'section-about', 'Homepage section: About Louisa Webb']
    ];

    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
        const config = sections.find(([selector]) => entry.target.matches(selector));
        if (!config || seen.has(config[1])) return;

        seen.add(config[1]);
        window.goatcounter.count({
          path: config[1],
          title: config[2],
          event: true
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    sections.forEach(([selector]) => {
      const section = document.querySelector(selector);
      if (section) observer.observe(section);
    });
  });

  document.head.appendChild(analytics);

  const gate = document.getElementById('ageGate');
  const enter = document.getElementById('enterSite');
  const leave = document.getElementById('leaveSite');
  const reset = document.getElementById('resetAge');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  const verified = localStorage.getItem('louisaWebbAgeVerified') === 'yes';

  function unlock() {
    if (gate) gate.hidden = true;
    document.body.classList.remove('age-locked');
  }

  if (verified) unlock();

  enter?.addEventListener('click', () => {
    localStorage.setItem('louisaWebbAgeVerified', 'yes');
    unlock();
  });

  leave?.addEventListener('click', () => {
    window.location.replace('https://www.google.com/');
  });

  reset?.addEventListener('click', () => {
    localStorage.removeItem('louisaWebbAgeVerified');
    location.reload();
  });

  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Compatibility fix: make section III clickable even if a cached homepage
  // still contains the older non-link <article> version of the card.
  const realmsCard = [...document.querySelectorAll('.lore-card')].find(card =>
    card.querySelector('.lore-mark')?.textContent.trim() === 'III'
  );

  if (realmsCard && realmsCard.tagName !== 'A') {
    realmsCard.classList.add('lore-card-link');
    realmsCard.setAttribute('role', 'link');
    realmsCard.setAttribute('tabindex', '0');
    realmsCard.setAttribute('aria-label', 'Explore Political Realms of Fairyland');
    realmsCard.style.cursor = 'pointer';

    const goToRealms = () => {
      window.location.href = 'realms.html';
    };

    realmsCard.addEventListener('click', goToRealms);
    realmsCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToRealms();
      }
    });
  }

  document.querySelectorAll('.footer-links').forEach(footerLinks => {
    const resetButton = footerLinks.querySelector('#resetAge');
    const socialLinks = [
      ['Contact', 'mailto:Louisa.Webb@gmx.de'],
      ['Facebook', 'https://www.facebook.com/profile.php?id=61593585303756'],
      ['Instagram', 'https://www.instagram.com/louisa_webb_author/']
    ];

    socialLinks.forEach(([label, href]) => {
      if (footerLinks.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if (href.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      footerLinks.insertBefore(link, resetButton);
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

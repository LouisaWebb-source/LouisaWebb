(() => {
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

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
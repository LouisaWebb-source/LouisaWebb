(() => {
  const gate = document.getElementById('ageGate');
  const enter = document.getElementById('enterSite');
  const leave = document.getElementById('leaveSite');
  const reset = document.getElementById('resetAge');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  const verified = localStorage.getItem('louisaWebbAgeVerified') === 'yes';

  function unlock() {
    gate.hidden = true;
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

  document.getElementById('year').textContent = new Date().getFullYear();
})();
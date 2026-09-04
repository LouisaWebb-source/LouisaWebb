(() => {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxqMUmxGKZky5FYand2ydjc0Oz-4O6qBwpBdPeGM5J7ibFWQG8pfmaoC6GeaKmLEf7b/exec';
  const frames = document.querySelectorAll('[data-louisa-comments]');

  frames.forEach(frame => {
    const post = frame.dataset.post || 'blog';
    const title = frame.dataset.title || document.title;
    if (WEB_APP_URL.includes('REPLACE_WITH_DEPLOYMENT_ID')) {
      frame.hidden = true;
      frame.insertAdjacentHTML('afterend', '<div class="comments-setup-note">The comment system is prepared but not connected to its private moderation sheet yet.</div>');
      return;
    }
    frame.src = `${WEB_APP_URL}?post=${encodeURIComponent(post)}&title=${encodeURIComponent(title)}`;
  });

  window.addEventListener('message', event => {
    if (!event.data || event.data.type !== 'louisa-comments-height') return;
    const frame = [...frames].find(candidate => candidate.contentWindow === event.source);
    if (!frame) return;
    const height = Math.max(620, Math.min(4000, Number(event.data.height) || 0));
    frame.style.height = `${height}px`;
  });
})();

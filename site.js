const themeButton = document.querySelector('.theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
  themeButton?.setAttribute('aria-label', label);
  themeButton?.setAttribute('title', label);
  themeButton?.setAttribute('aria-pressed', String(dark));
}
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('zanko-theme', theme); } catch { /* The switch also works without storage. */ }
  updateThemeButton();
});
updateThemeButton();
document.querySelectorAll('.abstract-toggle').forEach(button => {
  const abstract = document.getElementById(button.getAttribute('aria-controls'));
  if (!abstract) return;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    abstract.hidden = !expanded;
  });
});
const experiencePanel = document.querySelector('.experience-panel');
if (experiencePanel) {
  const viewport = experiencePanel.querySelector('.experience-viewport');
  const entries = Array.from(viewport.querySelectorAll('.experience-entry'));
  const controls = experiencePanel.querySelector('.experience-navigation');
  const previous = controls.querySelector('.experience-previous');
  const next = controls.querySelector('.experience-next');
  const status = controls.querySelector('.experience-status');
  let current = 0;
  let scrollFrame = 0;
  controls.hidden = false;

  function updateExperience(index) {
    current = index;
    previous.disabled = current === 0;
    next.disabled = current === entries.length - 1;
    const label = `${entries[current].dataset.institution} · ${current + 1} / ${entries.length}`;
    if (status.textContent !== label) status.textContent = label;
  }
  function syncExperience() {
    let nearest = 0;
    entries.forEach((entry, index) => {
      if (Math.abs(entry.offsetTop - viewport.scrollTop) < Math.abs(entries[nearest].offsetTop - viewport.scrollTop)) nearest = index;
    });
    updateExperience(nearest);
  }
  function moveExperience(direction) {
    const target = Math.max(0, Math.min(entries.length - 1, current + direction));
    viewport.scrollTo({top: entries[target].offsetTop, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => moveExperience(-1));
  next.addEventListener('click', () => moveExperience(1));
  viewport.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(syncExperience);
  }, { passive: true });
  new ResizeObserver(syncExperience).observe(viewport);
  syncExperience();
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.click();
    menuButton.focus();
  }
});

// Apply the saved appearance before the first paint; new visitors start in light mode.
try {
  document.documentElement.dataset.theme = localStorage.getItem('zanko-theme') === 'dark' ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme = 'light';
}

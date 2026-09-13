loadAll();

const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bca-theme', next);
};

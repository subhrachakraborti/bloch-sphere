/*
MIT License
Copyright (c) 2025 Subhra Chakraborti
*/
export const TAU = Math.PI * 2;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const formatNumber = (value, digits = 3) => {
  const fixed = Number.parseFloat(value.toFixed(digits));
  return fixed.toString();
};

export const complex = (re, im = 0) => ({ re, im });

export const complexAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });

export const complexMul = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const complexConj = (a) => ({ re: a.re, im: -a.im });

export const complexAbs2 = (a) => a.re * a.re + a.im * a.im;

export const complexScale = (a, scalar) => ({ re: a.re * scalar, im: a.im * scalar });

export const complexExp = (angle) => ({ re: Math.cos(angle), im: Math.sin(angle) });

export const formatComplex = (a) => {
  const re = formatNumber(a.re);
  const im = formatNumber(a.im);
  if (Math.abs(a.im) < 1e-3) {
    return `${re}`;
  }
  if (Math.abs(a.re) < 1e-3) {
    return `${im}i`;
  }
  return `${re} ${a.im >= 0 ? '+' : '-'} ${formatNumber(Math.abs(a.im))}i`;
};

export const initThemeToggle = () => {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const page = document.querySelector('.page');
  const stored = window.localStorage.getItem('theme');
  if (stored) {
    page.dataset.theme = stored;
  }

  toggle.addEventListener('click', () => {
    const next = page.dataset.theme === 'dark' ? 'light' : 'dark';
    page.dataset.theme = next;
    window.localStorage.setItem('theme', next);
  });
};

export const setCurrentYear = () => {
  const year = new Date().getFullYear();
  const footer = document.getElementById('footerYear');
  if (footer) {
    footer.textContent = `© ${year}`;
  }
};

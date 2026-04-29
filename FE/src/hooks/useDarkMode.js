import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try { localStorage.setItem('darkMode', JSON.stringify(isDark)); } catch {}
  }, [isDark]);

  // Apply immediately on mount before first paint
  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      const dark = saved !== null
        ? JSON.parse(saved)
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {}
  }, []);

  return [isDark, setIsDark];
};

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  // Apply on first render immediately
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const dark = saved !== null ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, []);

  return [isDark, setIsDark];
};

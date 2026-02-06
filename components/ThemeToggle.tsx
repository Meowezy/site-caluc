'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M21 14.2A8.5 8.5 0 0 1 9.8 3 7.5 7.5 0 1 0 21 14.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'light';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const isDark = theme === 'dark';

  // UX: show the icon of the target theme (what will happen on click)
  const nextIsDark = !isDark;

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-secondary inline-flex h-10 w-10 items-center justify-center p-0"
      title={nextIsDark ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
      aria-label={nextIsDark ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
    >
      {nextIsDark ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
    </button>
  );
}

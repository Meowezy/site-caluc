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
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
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

  function set(t: Theme) {
    setTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
  }

  const baseBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full transition ' +
    'hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-bank-50 dark:focus:ring-bank-600/20';

  const active = 'text-bank-600';
  const inactive = 'text-slate-500 dark:text-slate-400';

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => set('light')}
        className={`${baseBtn} ${theme === 'light' ? active : inactive}`}
        title="Светлая тема"
        aria-label="Светлая тема"
      >
        <SunIcon className="h-7 w-7" />
      </button>
      <button
        type="button"
        onClick={() => set('dark')}
        className={`${baseBtn} ${theme === 'dark' ? active : inactive}`}
        title="Тёмная тема"
        aria-label="Тёмная тема"
      >
        <MoonIcon className="h-7 w-7" />
      </button>
    </div>
  );
}

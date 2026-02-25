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
    'relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition ' +
    'focus:outline-none focus-visible:ring-4 focus-visible:ring-bank-50 dark:focus-visible:ring-bank-600/20';

  // Stronger contrast so icons remain visible on mobile and on translucent headers.
  const active =
    'bg-white text-slate-950 shadow-sm ring-1 ring-slate-300 ' +
    'dark:bg-slate-950 dark:text-slate-50 dark:ring-slate-700';
  const inactive =
    'text-slate-700 hover:text-slate-950 hover:bg-white/70 ' +
    'dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800/60';

  return (
    <div
      className={
        'inline-flex items-center gap-1 rounded-full bg-slate-200/70 p-1 ring-1 ring-slate-300 ' +
        'dark:bg-slate-900/70 dark:ring-slate-700'
      }
      role="group"
      aria-label="Переключатель темы"
    >
      <button
        type="button"
        onClick={() => set('light')}
        className={`${baseBtn} ${theme === 'light' ? active : inactive}`}
        title="Светлая тема"
        aria-label="Светлая тема"
      >
        <SunIcon className="block h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={() => set('dark')}
        className={`${baseBtn} ${theme === 'dark' ? active : inactive}`}
        title="Тёмная тема"
        aria-label="Тёмная тема"
      >
        <MoonIcon className="block h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
}

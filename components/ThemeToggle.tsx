'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = theme === 'dark' || (theme === 'system' && systemDark);

  root.classList.toggle('dark', shouldBeDark);
  root.style.colorScheme = shouldBeDark ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    setTheme(saved);
    applyTheme(saved);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  function cycle() {
    const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const label = theme === 'system' ? 'Системная' : theme === 'light' ? 'Светлая' : 'Тёмная';

  return (
    <button
      type="button"
      className="btn-secondary px-3 py-2"
      onClick={cycle}
      title="Переключить тему: системная → светлая → тёмная"
    >
      Тема: {label}
    </button>
  );
}

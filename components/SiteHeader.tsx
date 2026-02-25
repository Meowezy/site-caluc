'use client';

import { useEffect, useState } from 'react';

import ThemeToggle from '@/components/ThemeToggle';
import LogoMark from '@/components/LogoMark';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60 ' +
        'dark:border-slate-800/70 dark:bg-slate-950/60 dark:supports-[backdrop-filter]:bg-slate-950/45 ' +
        'transition-shadow ' +
        (scrolled ? 'shadow-sm shadow-slate-900/5 dark:shadow-black/20' : 'shadow-none')
      }
    >
      <div className="container-page py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10 shrink-0" />
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">КредитПлан</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Калькулятор кредита.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/articles"
              className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-bank-600 dark:hover:text-bank-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              📚
              <span className="hidden xs:inline ml-1">Статьи</span>
            </a>
            <a
              href="/about"
              className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-bank-600 dark:hover:text-bank-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              ℹ️
              <span className="hidden xs:inline ml-1">О сервисе</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

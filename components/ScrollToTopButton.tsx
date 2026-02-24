'use client';

import { useEffect, useMemo, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();

    // Safari < 14 fallback
    if ('addEventListener' in mq) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    // @ts-expect-error - legacy API
    mq.addListener(onChange);
    // @ts-expect-error - legacy API
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = useMemo(() => {
    return () => {
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    };
  }, [prefersReducedMotion]);

  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={onClick}
      className={
        'fixed right-4 md:right-6 ' +
        'bottom-[calc(1rem+env(safe-area-inset-bottom))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] ' +
        'z-50 inline-flex items-center justify-center ' +
        'h-11 w-11 md:h-12 md:w-12 rounded-full ' +
        'bg-bank-600 text-white shadow-lg shadow-bank-600/20 ' +
        'transition-all duration-200 ' +
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-bank-50 dark:focus-visible:ring-bank-600/20 ' +
        'hover:bg-bank-700 active:translate-y-[1px] ' +
        (visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none')
      }
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        className="md:h-[22px] md:w-[22px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5l-7 7m7-7l7 7M12 5v14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

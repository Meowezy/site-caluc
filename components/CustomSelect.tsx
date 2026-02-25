'use client';

import { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export default function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2 text-sm text-left outline-none transition flex items-center justify-between
                   focus:border-bank-600 focus:ring-4 focus:ring-bank-50
                   dark:border-slate-800 dark:bg-night-surface2/80 dark:text-slate-100
                   dark:focus:border-bank-600 dark:focus:ring-bank-600/20
                   hover:border-bank-400 dark:hover:border-bank-500"
      >
        <span>{selectedOption?.label || 'Выберите...'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg
                     dark:border-slate-700 dark:bg-night-surface2
                     overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left transition flex items-center justify-between
                         hover:bg-bank-50 dark:hover:bg-bank-950/30
                         ${
                           option.value === value
                             ? 'bg-bank-50 text-bank-700 dark:bg-bank-950/50 dark:text-bank-400'
                             : 'text-slate-700 dark:text-slate-300'
                         }`}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <svg className="w-4 h-4 text-bank-600 dark:text-bank-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

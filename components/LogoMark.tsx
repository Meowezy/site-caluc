import React from 'react';

/**
 * Banking-style shield logomark for "КредитПлан".
 * Minimal, recognizable, works on light/dark.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="kp_sh" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* shield */}
      <path
        d="M24 6c5.5 4 10.8 4 16 4v15.8c0 9-6.3 14.7-16 16.2C14.3 40.5 8 34.8 8 25.8V10c5.2 0 10.5 0 16-4Z"
        fill="url(#kp_sh)"
      />
      <path
        d="M24 8.6c4.8 3.2 9.4 3.2 13.8 3.2v14c0 7.6-5.5 12.4-13.8 13.7-8.3-1.3-13.8-6.1-13.8-13.7v-14c4.4 0 9 0 13.8-3.2Z"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
      />

      {/* graph */}
      <path
        d="M16 28.5l5-5 3.2 3.2 7-8"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 32h16"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="28.5" r="1.4" fill="rgba(255,255,255,0.95)" />
      <circle cx="21" cy="23.5" r="1.4" fill="rgba(255,255,255,0.95)" />
      <circle cx="24.2" cy="26.7" r="1.4" fill="rgba(255,255,255,0.95)" />
      <circle cx="31.2" cy="18.7" r="1.4" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}

import React from 'react';

/**
 * Alternate logomark: rounded square + minimal "calculator" glyph.
 * Works well in light/dark headers.
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
        <linearGradient id="cp_g" x1="8" y1="10" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#0b5bd3" />
        </linearGradient>
      </defs>

      <rect x="6" y="6" width="36" height="36" rx="12" fill="url(#cp_g)" />
      <rect x="7" y="7" width="34" height="34" rx="11" stroke="rgba(255,255,255,0.22)" />

      {/* screen */}
      <rect x="15" y="14" width="18" height="9" rx="3" fill="rgba(255,255,255,0.92)" />
      <path d="M18 19h12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />

      {/* buttons grid */}
      <g fill="rgba(255,255,255,0.92)">
        <rect x="15" y="26" width="6" height="6" rx="2" />
        <rect x="22" y="26" width="6" height="6" rx="2" />
        <rect x="29" y="26" width="6" height="6" rx="2" />
        <rect x="15" y="33" width="6" height="6" rx="2" />
        <rect x="22" y="33" width="6" height="6" rx="2" />
        <rect x="29" y="33" width="6" height="6" rx="2" />
      </g>

      {/* subtle check/graph */}
      <path
        d="M16.2 31.4l2.2 2.2 4.6-5.1"
        stroke="rgba(37,99,235,0.95)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import React from 'react';

/**
 * Minimal banking-style logomark for "КредитПлан".
 * Circle + monogram "КП" + subtle growth line.
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
        <linearGradient id="kp_g" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      <circle cx="24" cy="24" r="20" fill="url(#kp_g)" />
      <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.22)" />

      {/* Monogram */}
      <path
        d="M18 16v16M18 24h4.8l3.2-4.2"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M27 32V16m0 8.5c1.2-1.5 2.6-2.3 4.4-2.3 2 0 3.6 1 3.6 3.7V32"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* subtle growth line */}
      <path
        d="M14.5 31.5l6-6 4 4 8-9"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

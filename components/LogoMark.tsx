import React from 'react';

export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded square */}
      <rect x="4" y="4" width="40" height="40" rx="12" className="fill-bank-600" />

      {/* House + chart line */}
      <path
        d="M16 24.5 24 18l8 6.5V34a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2v-9.5Z"
        className="fill-white"
        opacity="0.95"
      />
      <path
        d="M18 30.5l4-4 3 3 5-6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="30.5" r="1.5" fill="white" />
      <circle cx="22" cy="26.5" r="1.5" fill="white" />
      <circle cx="25" cy="29.5" r="1.5" fill="white" />
      <circle cx="30" cy="23.5" r="1.5" fill="white" />
    </svg>
  );
}

'use client';

import { useState } from 'react';
import type { CalcRequest } from '@/lib/types';

export default function ShareButton({ calcRequest }: { calcRequest: CalcRequest }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Encode parameters into URL
    const params = new URLSearchParams({
      principal: String(calcRequest.principal),
      rate: String(calcRequest.annualRate),
      termMonths: String(calcRequest.termMonths),
      type: calcRequest.paymentType,
      startDate: calcRequest.startDate || '',
      earlyPayments: JSON.stringify(calcRequest.earlyPayments)
    });

    const shareUrl = `${window.location.origin}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className="btn-secondary inline-flex items-center gap-2"
      onClick={handleShare}
      title="Скопировать ссылку с параметрами"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Скопировано!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          🔗 Поделиться
        </>
      )}
    </button>
  );
}

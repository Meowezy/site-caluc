'use client';

import { useState } from 'react';

import type { CalcRequest } from '@/lib/types';
import ShareButton from '@/components/ShareButton';

export default function ExportPanel({ calcRequest }: { calcRequest: CalcRequest }) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [status, setStatus] = useState('');

  const downloadPdf = async () => {
    setLoadingPdf(true);
    setStatus('');
    try {
      const r = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(calcRequest)
      });
      if (!r.ok) throw new Error('PDF generation failed');
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kreditplan-otchet.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('PDF скачан!');
    } catch (err) {
      setStatus('Ошибка при создании PDF');
      console.error(err);
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
    setStatus('');
    try {
      const r = await fetch('/api/excel', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(calcRequest)
      });
      if (!r.ok) throw new Error('Excel generation failed');
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kreditplan-otchet.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('Excel скачан!');
    } catch (err) {
      setStatus('Ошибка при создании Excel');
      console.error(err);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="text-sm font-semibold">📤 Экспорт и поделиться</div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button className="btn-secondary" onClick={downloadPdf} disabled={loadingPdf}>
          {loadingPdf ? 'Готовим PDF…' : '📄 Скачать PDF'}
        </button>
        <button className="btn-secondary" onClick={downloadExcel} disabled={loadingExcel}>
          {loadingExcel ? 'Готовим Excel…' : '📊 Скачать Excel'}
        </button>
        
        <ShareButton calcRequest={calcRequest} />
      </div>
      {status ? <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</div> : null}
    </div>
  );
}

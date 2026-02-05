'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';

import type { CalcRequest } from '@/lib/types';

const emailSchema = z.string().email('Некорректный email');

export default function ExportPanel({ calcRequest }: { calcRequest: CalcRequest }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return null;
    const r = emailSchema.safeParse(email);
    return r.success ? null : r.error.issues[0]?.message;
  }, [email]);

  async function downloadPdf() {
    setStatus(null);
    setLoadingPdf(true);
    try {
      const r = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(calcRequest)
      });
      if (!r.ok) throw new Error(await r.text());
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'credit-report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setStatus(e?.message ?? 'Ошибка PDF');
    } finally {
      setLoadingPdf(false);
    }
  }

  async function sendEmail() {
    setStatus(null);
    const valid = emailSchema.safeParse(email);
    if (!valid.success) {
      setStatus(valid.error.issues[0]?.message ?? 'Некорректный email');
      return;
    }

    setLoadingEmail(true);
    try {
      const r = await fetch('/api/email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ to: email, calcRequest })
      });
      if (!r.ok) throw new Error(await r.text());
      setStatus('Отправлено');
    } catch (e: any) {
      setStatus(e?.message ?? 'Ошибка отправки');
    } finally {
      setLoadingEmail(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-sm font-semibold">Экспорт и отправка</div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button className="btn" onClick={downloadPdf} disabled={loadingPdf}>
          {loadingPdf ? 'Готовим PDF…' : 'Скачать PDF'}
        </button>

        <div className="flex flex-1 flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <div className="label">Email</div>
            <input
              className="input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError ? <div className="error">{emailError}</div> : null}
          </div>
          <button className="btn-secondary" onClick={sendEmail} disabled={loadingEmail}>
            {loadingEmail ? 'Отправляем…' : 'Отправить на email'}
          </button>
        </div>
      </div>
      {status ? <div className="mt-3 text-sm text-slate-600">{status}</div> : null}
      <div className="mt-2 text-xs text-slate-500">
        Для отправки email нужен SMTP (переменные окружения). PDF формируется на сервере.
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import type { CalcRequest, CalcResponse, EarlyPayment } from '@/lib/types';
import ScheduleCharts from '@/components/ScheduleCharts';
import ScheduleTable from '@/components/ScheduleTable';
import ExportPanel from '@/components/ExportPanel';

const STORAGE_KEY = 'ccalc:v1';

const requestSchema = z.object({
  principal: z.number().positive('Сумма должна быть больше 0'),
  annualRate: z.number().min(0, 'Ставка не может быть отрицательной'),
  termMonths: z.number().int().positive('Срок должен быть больше 0'),
  paymentType: z.enum(['ANNUITY', 'DIFFERENTIATED']),
  startDate: z.string().optional(),
  earlyPayments: z.array(
    z.object({
      id: z.string(),
      amount: z.number().positive('Сумма досрочного платежа должна быть больше 0'),
      monthIndex: z.number().int().min(1),
      mode: z.enum(['REDUCE_TERM', 'REDUCE_PAYMENT']),
      repeat: z.enum(['ONCE', 'MONTHLY', 'QUARTERLY', 'UNTIL_END']).default('ONCE')
    })
  )
});

function formatMoney(v: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(v);
}

export default function CalculatorApp() {
  const [principal, setPrincipal] = useState(3_000_000);
  const [annualRate, setAnnualRate] = useState(14);
  const [termYears, setTermYears] = useState(20);
  const [termMonthsExtra, setTermMonthsExtra] = useState(0);
  const [paymentType, setPaymentType] = useState<'ANNUITY' | 'DIFFERENTIATED'>('ANNUITY');
  const [earlyPayments, setEarlyPayments] = useState<EarlyPayment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalcResponse | null>(null);

  const termMonths = useMemo(() => termYears * 12 + termMonthsExtra, [termYears, termMonthsExtra]);

  // load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.principal === 'number') setPrincipal(parsed.principal);
      if (typeof parsed.annualRate === 'number') setAnnualRate(parsed.annualRate);
      if (typeof parsed.termYears === 'number') setTermYears(parsed.termYears);
      if (typeof parsed.termMonthsExtra === 'number') setTermMonthsExtra(parsed.termMonthsExtra);
      if (parsed.paymentType === 'ANNUITY' || parsed.paymentType === 'DIFFERENTIATED') {
        setPaymentType(parsed.paymentType);
      }
      if (Array.isArray(parsed.earlyPayments)) setEarlyPayments(parsed.earlyPayments);
    } catch {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ principal, annualRate, termYears, termMonthsExtra, paymentType, earlyPayments })
    );
  }, [principal, annualRate, termYears, termMonthsExtra, paymentType, earlyPayments]);

  async function calculate() {
    setError(null);
    setResult(null);

    const req: CalcRequest = {
      principal,
      annualRate,
      termMonths,
      paymentType,
      earlyPayments,
      startDate: new Date().toISOString().slice(0, 10)
    };

    const validation = requestSchema.safeParse(req);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Ошибка валидации');
      return;
    }

    const r = await fetch('/api/calc', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!r.ok) {
      const text = await r.text();
      setError(text || 'Ошибка API');
      return;
    }
    const data: CalcResponse = await r.json();
    setResult(data);
  }

  // Auto-recalc after any change (only if user already calculated once)
  useEffect(() => {
    if (!result) return;
    const t = window.setTimeout(() => {
      calculate();
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal, annualRate, termMonths, paymentType, earlyPayments]);

  function addEarlyPayment() {
    const id = crypto.randomUUID();
    const next: EarlyPayment = {
      id,
      amount: 50_000,
      monthIndex: 1,
      mode: 'REDUCE_TERM',
      repeat: 'ONCE'
    };
    setEarlyPayments((p) => [...p, next]);
  }

  function updateEarlyPayment(id: string, patch: Partial<EarlyPayment>) {
    setEarlyPayments((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function removeEarlyPayment(id: string) {
    setEarlyPayments((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <div className="card p-5 md:p-6">
          <div className="text-base font-semibold">Параметры кредита</div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <div className="label">Сумма кредита</div>
              <div className="hint">Полная сумма займа (в рублях).</div>
              <input
                className="input"
                inputMode="numeric"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="label">Срок (лет)</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="label">Срок (мес.)</div>
                <div className="hint">Дополнительно к годам.</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={termMonthsExtra}
                  onChange={(e) => setTermMonthsExtra(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <div className="label">Процентная ставка (годовая)</div>
              <div className="hint">Например: 12.5</div>
              <input
                className="input"
                inputMode="decimal"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="label">Тип платежей</div>
              <select
                className="select"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
              >
                <option value="ANNUITY">Аннуитетный</option>
                <option value="DIFFERENTIATED">Дифференцированный</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn" onClick={calculate}>
                Рассчитать
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEarlyPayments([]);
                  setResult(null);
                }}
              >
                Сбросить досрочные
              </button>
            </div>

            {error ? <div className="error">{error}</div> : null}
          </div>
        </div>

        <div className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold">Досрочные погашения</div>
              <div className="hint">
                Укажите месяц (1 = первый платёж), сумму и режим пересчёта.
              </div>
            </div>
            <button className="btn-secondary" onClick={addEarlyPayment}>
              + Добавить
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {earlyPayments.length === 0 ? (
              <div className="text-sm text-slate-500">Досрочных платежей пока нет.</div>
            ) : null}

            {earlyPayments.map((ep) => (
              <div key={ep.id} className="rounded-xl border border-slate-200 p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <div className="label">Месяц</div>
                    <input
                      className="input"
                      inputMode="numeric"
                      value={ep.monthIndex}
                      onChange={(e) =>
                        updateEarlyPayment(ep.id, { monthIndex: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <div className="label">Сумма</div>
                    <input
                      className="input"
                      inputMode="numeric"
                      value={ep.amount}
                      onChange={(e) => updateEarlyPayment(ep.id, { amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <div className="label">Эффект</div>
                    <select
                      className="select"
                      value={ep.mode}
                      onChange={(e) => updateEarlyPayment(ep.id, { mode: e.target.value as any })}
                    >
                      <option value="REDUCE_TERM">Уменьшить срок</option>
                      <option value="REDUCE_PAYMENT">Уменьшить платёж</option>
                    </select>
                  </div>
                  <div>
                    <div className="label">Повтор</div>
                    <select
                      className="select"
                      value={ep.repeat}
                      onChange={(e) => updateEarlyPayment(ep.id, { repeat: e.target.value as any })}
                    >
                      <option value="ONCE">Разовый</option>
                      <option value="MONTHLY">Каждый месяц</option>
                      <option value="QUARTERLY">Раз в квартал</option>
                      <option value="UNTIL_END">Регулярно до погашения</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button className="btn-secondary" onClick={() => removeEarlyPayment(ep.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-7">
        <div className="card p-5 md:p-6">
          <div className="text-base font-semibold">Итоги</div>

          {result ? (
            <div className="mt-4 space-y-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs text-slate-500">Переплата по процентам</div>
                  <div className="mt-1 text-lg font-semibold">
                    {formatMoney(result.summary.totalInterest)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs text-slate-500">Всего к оплате</div>
                  <div className="mt-1 text-lg font-semibold">{formatMoney(result.summary.totalPaid)}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs text-slate-500">Фактический срок</div>
                  <div className="mt-1 text-lg font-semibold">{result.summary.actualMonths} мес.</div>
                </div>
              </div>

              <ExportPanel
                calcRequest={{
                  principal,
                  annualRate,
                  termMonths,
                  paymentType,
                  earlyPayments,
                  startDate: new Date().toISOString().slice(0, 10)
                }}
              />

              <ScheduleCharts rows={result.schedule} />

              <div>
                <div className="text-sm font-semibold">График платежей</div>
                <div className="mt-3">
                  <ScheduleTable rows={result.schedule} />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-slate-500">
              Нажмите «Рассчитать», чтобы получить график платежей.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

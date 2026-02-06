'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { addMonths } from 'date-fns';

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
      whenType: z.enum(['MONTH_INDEX', 'MONTH']).optional(),
      monthIndex: z.number().int().min(1),
      monthISO: z.string().optional(),
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
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
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
      if (typeof parsed.startDate === 'string') setStartDate(parsed.startDate);
      if (Array.isArray(parsed.earlyPayments)) setEarlyPayments(parsed.earlyPayments);
    } catch {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        principal,
        annualRate,
        termYears,
        termMonthsExtra,
        paymentType,
        startDate,
        earlyPayments
      })
    );
  }, [principal, annualRate, termYears, termMonthsExtra, paymentType, startDate, earlyPayments]);

  function toMonthIndexFromMonthISO(startDateISO: string, monthISO: string): number {
    // monthISO: YYYY-MM
    const [y, m] = monthISO.split('-').map((x) => Number(x));
    if (!y || !m) return 1;

    const start = new Date(startDateISO + 'T00:00:00');
    const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    const targetMonth = new Date(y, m - 1, 1);

    const diff =
      (targetMonth.getFullYear() - startMonth.getFullYear()) * 12 +
      (targetMonth.getMonth() - startMonth.getMonth());

    return Math.max(1, diff + 1);
  }

  function normalizeEarlyPaymentsForApi(eps: EarlyPayment[]): EarlyPayment[] {
    return eps.map((ep) => {
      const monthIndex =
        ep.whenType === 'MONTH' && ep.monthISO && startDate
          ? toMonthIndexFromMonthISO(startDate, ep.monthISO)
          : Math.max(1, Math.floor(ep.monthIndex || 1));

      // Strip UI-only fields (whenType, monthISO) before sending to API.
      return {
        id: ep.id,
        amount: ep.amount,
        monthIndex,
        mode: ep.mode,
        repeat: ep.repeat
      };
    });
  }

  async function calculate() {
    setError(null);
    setResult(null);

    const req: CalcRequest = {
      principal,
      annualRate,
      termMonths,
      paymentType,
      earlyPayments: normalizeEarlyPaymentsForApi(earlyPayments),
      startDate
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
  }, [principal, annualRate, termMonths, paymentType, startDate, earlyPayments]);

  function addEarlyPayment() {
    const id = crypto.randomUUID();
    const next: EarlyPayment = {
      id,
      amount: 50_000,
      whenType: 'MONTH_INDEX',
      monthIndex: 1,
      monthISO: addMonths(new Date(startDate + 'T00:00:00'), 0).toISOString().slice(0, 7),
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

            <div>
              <div className="label">Срок</div>
              <div className="hint">Укажите годы и дополнительные месяцы.</div>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                    className="input"
                    inputMode="numeric"
                    value={termYears}
                    onChange={(e) => setTermYears(Number(e.target.value))}
                    aria-label="Срок (лет)"
                    placeholder="Лет"
                  />
                </div>
                <div>
                  <input
                    className="input"
                    inputMode="numeric"
                    value={termMonthsExtra}
                    onChange={(e) => setTermMonthsExtra(Number(e.target.value))}
                    aria-label="Срок (мес.)"
                    placeholder="Месяцев"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="label">Дата начала</div>
              <div className="hint">Нужна для отображения дат в графике и отчёте.</div>
              <input
                className="input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
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
              <div className="text-sm text-slate-500 dark:text-slate-400">Досрочных платежей пока нет.</div>
            ) : null}

            {earlyPayments.map((ep) => (
              <div key={ep.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <div className="label">Когда</div>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <select
                        className="select"
                        value={ep.whenType ?? 'MONTH_INDEX'}
                        onChange={(e) =>
                          updateEarlyPayment(ep.id, {
                            whenType: e.target.value as any
                          })
                        }
                      >
                        <option value="MONTH_INDEX">Месяц №</option>
                        <option value="MONTH">Месяц (дата)</option>
                      </select>

                      {(ep.whenType ?? 'MONTH_INDEX') === 'MONTH' ? (
                        <input
                          className="input"
                          type="month"
                          value={ep.monthISO ?? startDate.slice(0, 7)}
                          onChange={(e) => updateEarlyPayment(ep.id, { monthISO: e.target.value })}
                        />
                      ) : (
                        <input
                          className="input"
                          inputMode="numeric"
                          value={ep.monthIndex}
                          onChange={(e) =>
                            updateEarlyPayment(ep.id, { monthIndex: Number(e.target.value) })
                          }
                        />
                      )}
                    </div>
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
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Переплата по процентам</div>
                  <div className="mt-1 text-lg font-semibold">
                    {formatMoney(result.summary.totalInterest)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Всего к оплате</div>
                  <div className="mt-1 text-lg font-semibold">{formatMoney(result.summary.totalPaid)}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Фактический срок</div>
                  <div className="mt-1 text-lg font-semibold">{result.summary.actualMonths} мес.</div>
                </div>
              </div>

              <ExportPanel
                calcRequest={{
                  principal,
                  annualRate,
                  termMonths,
                  paymentType,
                  earlyPayments: normalizeEarlyPaymentsForApi(earlyPayments),
                  startDate
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
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Нажмите «Рассчитать», чтобы получить график платежей.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

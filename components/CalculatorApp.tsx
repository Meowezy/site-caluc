'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { addMonths } from 'date-fns';

import type { CalcRequest, CalcResponse, EarlyPayment } from '@/lib/types';
import ScheduleCharts from '@/components/ScheduleCharts';
import ScheduleTable from '@/components/ScheduleTable';
import ExportPanel from '@/components/ExportPanel';
import FadeInOnScroll from '@/components/FadeInOnScroll';
import CustomSelect from '@/components/CustomSelect';

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

function parseMoneyInput(input: string): number | null {
  const raw = (input ?? '').trim();
  if (!raw) return null;

  // Remove currency symbols/letters and whitespace, including NBSP/narrow NBSP.
  // Keep digits and decimal separators.
  let s = raw
    .replace(/[\u00A0\u202F\s]/g, '')
    .replace(/[₽рРубRUB]/g, '')
    .replace(/[^0-9.,-]/g, '');

  if (!/[0-9]/.test(s)) return null;

  // If there are multiple separators, treat the last one as decimal separator and
  // remove the rest as thousands separators.
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  const lastSep = Math.max(lastComma, lastDot);

  if (lastSep !== -1) {
    const intPart = s.slice(0, lastSep).replace(/[.,]/g, '');
    const fracPart = s.slice(lastSep + 1).replace(/[.,]/g, '');
    s = intPart + '.' + fracPart;
  } else {
    s = s.replace(/[.,]/g, '');
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseIntInput(input: string): number | null {
  const s = (input ?? '').replace(/[\u00A0\u202F\s]/g, '').replace(/[^0-9-]/g, '');
  if (!s || !/[0-9]/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function parseRate(input: string): number | null {
  const s = input.trim().replace(',', '.');
  if (!s) return null;
  // allow trailing dot like "12." while typing
  if (/^\d+\.$/.test(s)) return Number(s.slice(0, -1));
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function formatTerm(months: number) {
  const years = Math.floor(months / 12);
  const m = months % 12;
  const yearsPart = years > 0 ? `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}` : '';
  const monthsPart = m > 0 ? `${m} мес.` : '';
  const main = [yearsPart, monthsPart].filter(Boolean).join(' ');
  return `${main || `${months} мес.`} (${months} мес.)`;
}

export default function CalculatorApp() {
  const [principal, setPrincipal] = useState(3_000_000);
  const [annualRateInput, setAnnualRateInput] = useState('14');
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
      if (typeof parsed.annualRate === 'number') setAnnualRateInput(String(parsed.annualRate));
      if (typeof parsed.annualRateInput === 'string') setAnnualRateInput(parsed.annualRateInput);
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
        annualRate: parseRate(annualRateInput) ?? 0,
        annualRateInput,
        termYears,
        termMonthsExtra,
        paymentType,
        startDate,
        earlyPayments
      })
    );
  }, [principal, annualRateInput, termYears, termMonthsExtra, paymentType, startDate, earlyPayments]);

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

    const annualRate = parseRate(annualRateInput);
    if (annualRate === null) {
      setError('Введите корректную процентную ставку');
      return;
    }

    const normalizedEarlyPayments = normalizeEarlyPaymentsForApi(earlyPayments).map((ep) => ({
      ...ep,
      amount: Number.isFinite(ep.amount) ? ep.amount : 0,
      monthIndex: Number.isFinite(ep.monthIndex) ? ep.monthIndex : 1
    }));

    const req: CalcRequest = {
      principal: Number.isFinite(principal) ? principal : 0,
      annualRate,
      termMonths: Number.isFinite(termMonths) ? termMonths : 0,
      paymentType,
      earlyPayments: normalizedEarlyPayments,
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
  }, [principal, annualRateInput, termMonths, paymentType, startDate, earlyPayments]);

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
      <div className="space-y-5 lg:col-span-5">
        <div className="card p-4 md:p-5">
          <div className="text-base font-semibold">Параметры кредита</div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <div className="label">Сумма кредита</div>
              <div className="hint">Полная сумма займа (в рублях).</div>
              <input
                className="input"
                inputMode="numeric"
                value={principal}
                onChange={(e) => {
                  const parsed = parseMoneyInput(e.target.value);
                  setPrincipal(parsed ?? 0);
                }}
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
                    onChange={(e) => {
                      const parsed = parseIntInput(e.target.value);
                      setTermYears(parsed ?? 0);
                    }}
                    aria-label="Срок (лет)"
                    placeholder="Лет"
                  />
                </div>
                <div>
                  <input
                    className="input"
                    inputMode="numeric"
                    value={termMonthsExtra}
                    onChange={(e) => {
                      const parsed = parseIntInput(e.target.value);
                      setTermMonthsExtra(parsed ?? 0);
                    }}
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
                className="input date-input"
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
                value={annualRateInput}
                onChange={(e) => setAnnualRateInput(e.target.value)}
              />
            </div>

            <div>
              <div className="label">Тип платежей</div>
              <CustomSelect
                value={paymentType}
                onChange={(val) => setPaymentType(val as any)}
                options={[
                  { value: 'ANNUITY', label: 'Аннуитетный' },
                  { value: 'DIFFERENTIATED', label: 'Дифференцированный' }
                ]}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn" onClick={calculate}>
                Рассчитать
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setError(null);
                  setResult(null);
                  setPrincipal(3_000_000);
                  setAnnualRateInput('14');
                  setTermYears(20);
                  setTermMonthsExtra(0);
                  setPaymentType('ANNUITY');
                  setStartDate(new Date().toISOString().slice(0, 10));
                  setEarlyPayments([]);
                }}
              >
                Сбросить
              </button>
            </div>

            {error ? <div className="error">{error}</div> : null}
          </div>
        </div>

        <div className="card p-4 md:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold">Досрочные погашения</div>
              <div className="hint">
                Укажите месяц (1 = первый платёж), сумму и режим пересчёта.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <button
                className="btn-secondary w-full sm:w-auto"
                onClick={() => setEarlyPayments([])}
                disabled={earlyPayments.length === 0}
              >
                Сбросить
              </button>
              <button className="btn w-full sm:w-auto" onClick={addEarlyPayment}>
                Добавить
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {earlyPayments.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">Досрочных платежей пока нет.</div>
            ) : null}

            {earlyPayments.map((ep) => (
              <div key={ep.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="label">Когда</div>
                      <div className="mt-1">
                        <CustomSelect
                          value={ep.whenType ?? 'MONTH_INDEX'}
                          onChange={(val) => updateEarlyPayment(ep.id, { whenType: val as any })}
                          options={[
                            { value: 'MONTH_INDEX', label: 'Месяц №' },
                            { value: 'MONTH', label: 'Месяц (дата)' }
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="label">{(ep.whenType ?? 'MONTH_INDEX') === 'MONTH' ? 'Дата' : 'Номер месяца'}</div>
                      <div className="mt-1">
                        {(ep.whenType ?? 'MONTH_INDEX') === 'MONTH' ? (
                          <input
                            className="input month-input"
                            type="month"
                            value={ep.monthISO ?? startDate.slice(0, 7)}
                            onChange={(e) => updateEarlyPayment(ep.id, { monthISO: e.target.value })}
                          />
                        ) : (
                          <input
                            className="input"
                            inputMode="numeric"
                            value={ep.monthIndex}
                            onChange={(e) => {
                              const parsed = parseIntInput(e.target.value);
                              updateEarlyPayment(ep.id, { monthIndex: Math.max(1, parsed ?? 1) });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="label">Сумма</div>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={ep.amount}
                        onChange={(e) => {
                          const parsed = parseMoneyInput(e.target.value);
                          updateEarlyPayment(ep.id, { amount: parsed ?? 0 });
                        }}
                      />
                    </div>
                    <div>
                      <div className="label">Эффект</div>
                      <CustomSelect
                        value={ep.mode}
                        onChange={(val) => updateEarlyPayment(ep.id, { mode: val as any })}
                        options={[
                          { value: 'REDUCE_TERM', label: 'Уменьшить срок' },
                          { value: 'REDUCE_PAYMENT', label: 'Уменьшить платёж' }
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="label">Повтор</div>
                    <CustomSelect
                      value={ep.repeat}
                      onChange={(val) => updateEarlyPayment(ep.id, { repeat: val as any })}
                      options={[
                        { value: 'ONCE', label: 'Разовый' },
                        { value: 'MONTHLY', label: 'Каждый месяц' },
                        { value: 'QUARTERLY', label: 'Раз в квартал' },
                        { value: 'UNTIL_END', label: 'Регулярно до погашения' }
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-stretch sm:justify-end">
                  <button className="btn-secondary w-full sm:w-auto" onClick={() => removeEarlyPayment(ep.id)}>
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
              {/* Карточка экономии - показывается только если есть досрочные платежи */}
              {!!(result.summary.savedInterest && result.summary.savedInterest > 0) && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-6 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">💰</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                        Ваша экономия от досрочных платежей
                      </div>
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500 mb-2">
                        {formatMoney(result.summary.savedInterest)}
                      </div>
                      <div className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                        Без досрочных платежей переплата составила бы{' '}
                        <span className="font-semibold">
                          {formatMoney(result.summary.interestWithoutEarly || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Переплата */}
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 min-h-[92px]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Переплата по процентам</div>
                  <div className="text-lg sm:text-xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
                    {formatMoney(result.summary.totalInterest)}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                    {(() => {
                      const interest = result.summary.totalInterest;
                      const total = result.summary.totalPaid;
                      const share = total > 0 ? (interest / total) * 100 : 0;
                      if (!Number.isFinite(share) || share <= 0) return 'Доля процентов: —';
                      return `Доля процентов: ${share.toFixed(1)}%`;
                    })()}
                  </div>
                </div>

                {/* Всего */}
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 min-h-[92px]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Всего к оплате</div>
                  <div className="text-lg sm:text-xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
                    {formatMoney(result.summary.totalPaid)}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                    {(() => {
                      const interest = result.summary.totalInterest;
                      return interest > 0 ? `В т.ч. проценты: ${formatMoney(interest)}` : 'В т.ч. проценты: —';
                    })()}
                  </div>
                </div>

                {/* Срок */}
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 min-h-[92px]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Фактический срок</div>
                  <div className="text-lg sm:text-xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
                    {(() => {
                      const actual = result.summary.actualMonths;
                      const years = Math.floor(actual / 12);
                      const m = actual % 12;
                      const yearsPart = years > 0 ? `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}` : '';
                      const monthsPart = m > 0 ? `${m} мес.` : '';
                      return [yearsPart, monthsPart].filter(Boolean).join(' ') || `${actual} мес.`;
                    })()}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                    {(() => {
                      const actual = result.summary.actualMonths;
                      const planned = Number.isFinite(termMonths) ? termMonths : undefined;
                      const saved = planned && planned > 0 ? planned - actual : 0;
                      const savedLabel = saved > 0 ? `Сокращение: ${saved} мес.` : 'Сокращение: —';
                      return `${actual} мес. • ${savedLabel}`;
                    })()}
                  </div>
                </div>

                {/* Последний платёж */}
                <div className="rounded-xl bg-slate-50 p-4 sm:p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 min-h-[92px]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Последний платёж</div>
                  <div className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {(() => {
                      if (!result.schedule.length) return '—';
                      const lastRow = result.schedule[result.schedule.length - 1];
                      if (!lastRow.dateLabel) return '—';
                      try {
                        const match = lastRow.dateLabel.match(/^(\d{2})\.(\d{4})$/);
                        if (!match) return '—';
                        const [, month, year] = match;
                        const date = new Date(`${year}-${month}-01T00:00:00`);
                        if (isNaN(date.getTime())) return '—';
                        return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
                      } catch {
                        return '—';
                      }
                    })()}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                    {(() => {
                      if (!result.schedule.length) return 'Сумма: —';
                      const lastRow = result.schedule[result.schedule.length - 1];
                      const lastAmount = Number.isFinite(lastRow.paymentTotal)
                        ? formatMoney(lastRow.paymentTotal)
                        : undefined;
                      return lastAmount ? `Сумма: ${lastAmount}` : 'Сумма: —';
                    })()}
                  </div>
                </div>
              </div>

              <ExportPanel
                calcRequest={{
                  principal: Number.isFinite(principal) ? principal : 0,
                  annualRate: parseRate(annualRateInput) ?? 0,
                  termMonths: Number.isFinite(termMonths) ? termMonths : 0,
                  paymentType,
                  earlyPayments: normalizeEarlyPaymentsForApi(earlyPayments).map((ep) => ({
                    ...ep,
                    amount: Number.isFinite(ep.amount) ? ep.amount : 0,
                    monthIndex: Number.isFinite(ep.monthIndex) ? ep.monthIndex : 1
                  })),
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

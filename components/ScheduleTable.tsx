'use client';

import type { ScheduleRow } from '@/lib/types';

function formatMoney(v: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(v);
}

export default function ScheduleTable({ rows }: { rows: ScheduleRow[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200/80 bg-white/50 dark:border-slate-800/80 dark:bg-night-surface/40">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur dark:bg-slate-900/80">
          <tr className="text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
            <th className="px-3 py-2">Месяц</th>
            <th className="px-3 py-2">Дата</th>
            <th className="px-3 py-2 text-right">Основной долг</th>
            <th className="px-3 py-2 text-right">Проценты</th>
            <th className="px-3 py-2 text-right">Платёж</th>
            <th className="px-3 py-2 text-right">Досрочно</th>
            <th className="px-3 py-2 text-right">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={r.month}
              className={
                'border-t border-slate-100/80 transition-colors dark:border-slate-800/70 ' +
                (idx % 2 === 0
                  ? 'bg-white/40 dark:bg-slate-950/10'
                  : 'bg-slate-50/40 dark:bg-slate-900/20') +
                ' hover:bg-bank-50/60 dark:hover:bg-slate-800/40'
              }
            >
              <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                {r.month}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-slate-500 dark:text-slate-400">{r.dateLabel ?? '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap text-right">{formatMoney(r.principal)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-right">{formatMoney(r.interest)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">{formatMoney(r.paymentTotal)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-right">
                {r.earlyPayment > 0 ? formatMoney(r.earlyPayment) : '—'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right">{formatMoney(r.balanceAfter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

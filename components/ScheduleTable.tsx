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
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold text-slate-600">
            <th className="px-3 py-2">Месяц</th>
            <th className="px-3 py-2">Дата</th>
            <th className="px-3 py-2">Основной долг</th>
            <th className="px-3 py-2">Проценты</th>
            <th className="px-3 py-2">Платёж</th>
            <th className="px-3 py-2">Досрочно</th>
            <th className="px-3 py-2">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} className="border-t border-slate-100">
              <td className="px-3 py-2 whitespace-nowrap">{r.month}</td>
              <td className="px-3 py-2 whitespace-nowrap text-slate-500">{r.dateLabel ?? '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap">{formatMoney(r.principal)}</td>
              <td className="px-3 py-2 whitespace-nowrap">{formatMoney(r.interest)}</td>
              <td className="px-3 py-2 whitespace-nowrap font-medium">{formatMoney(r.paymentTotal)}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {r.earlyPayment > 0 ? formatMoney(r.earlyPayment) : '—'}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{formatMoney(r.balanceAfter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import type { ScheduleRow } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function ScheduleCharts({ rows }: { rows: ScheduleRow[] }) {
  const labels = rows.map((r) => String(r.month));

  const balanceData = {
    labels,
    datasets: [
      {
        label: 'Остаток долга',
        data: rows.map((r) => r.balanceAfter),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.25,
        pointRadius: 0
      }
    ]
  };

  const paymentData = {
    labels,
    datasets: [
      {
        label: 'Платёж (всего)',
        data: rows.map((r) => r.paymentTotal + r.earlyPayment),
        backgroundColor: 'rgba(15, 23, 42, 0.12)',
        borderColor: 'rgba(15, 23, 42, 0.2)',
        borderWidth: 1
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false } }
    }
  } as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div className="text-sm font-semibold">Остаток долга</div>
        <div className="mt-3 h-64">
          <Line
            data={balanceData}
            options={{
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                y: { ticks: { callback: (v: any) => `${v}` } }
              }
            }}
          />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div className="text-sm font-semibold">Платежи</div>
        <div className="mt-3 h-64">
          <Bar
            data={paymentData}
            options={{
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                y: { ticks: { callback: (v: any) => `${v}` } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

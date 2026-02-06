'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import type { Chart as ChartInstance } from 'chart.js';
import type { ScheduleRow } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

function isDarkNow() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export default function ScheduleCharts({ rows }: { rows: ScheduleRow[] }) {
  const [dark, setDark] = useState(false);
  const [zoomReady, setZoomReady] = useState(false);

  const balanceRef = useRef<ChartInstance<'line'> | null>(null);
  const paymentsRef = useRef<ChartInstance<'bar'> | null>(null);

  useEffect(() => {
    setDark(isDarkNow());

    // Dynamically register zoom plugin on client only (avoids "window is not defined" during prerender).
    import('chartjs-plugin-zoom')
      .then((m: any) => {
        ChartJS.register(m.default ?? m);
        setZoomReady(true);
      })
      .catch(() => {
        // zoom is optional
        setZoomReady(false);
      });

    const root = document.documentElement;
    const obs = new MutationObserver(() => setDark(isDarkNow()));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const labels = useMemo(() => rows.map((r) => r.dateLabel ?? String(r.month)), [rows]);

  const palette = useMemo(() => {
    const text = dark ? 'rgba(226,232,240,0.92)' : 'rgba(15,23,42,0.85)';
    const grid = dark ? 'rgba(148,163,184,0.15)' : 'rgba(15,23,42,0.08)';
    const border = dark ? 'rgba(148,163,184,0.25)' : 'rgba(15,23,42,0.18)';
    return {
      text,
      grid,
      border,
      blue: '#2563eb',
      green: '#16a34a',
      amber: '#f59e0b',
      red: '#ef4444'
    };
  }, [dark]);

  const lineData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Остаток долга',
          data: rows.map((r) => r.balanceAfter),
          borderColor: palette.blue,
          backgroundColor: dark ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.14)',
          fill: true,
          tension: 0.25,
          pointRadius: 0
        }
      ]
    }),
    [labels, rows, palette.blue, dark]
  );

  const barData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Проценты',
          data: rows.map((r) => r.interest),
          backgroundColor: dark ? 'rgba(245, 158, 11, 0.55)' : 'rgba(245, 158, 11, 0.45)',
          borderColor: 'rgba(245, 158, 11, 0.9)',
          borderWidth: 1,
          stack: 'p'
        },
        {
          label: 'Основной долг',
          data: rows.map((r) => r.principal),
          backgroundColor: dark ? 'rgba(34, 197, 94, 0.55)' : 'rgba(34, 197, 94, 0.45)',
          borderColor: 'rgba(34, 197, 94, 0.9)',
          borderWidth: 1,
          stack: 'p'
        },
        {
          label: 'Досрочно',
          data: rows.map((r) => r.earlyPayment),
          backgroundColor: dark ? 'rgba(239, 68, 68, 0.55)' : 'rgba(239, 68, 68, 0.35)',
          borderColor: 'rgba(239, 68, 68, 0.9)',
          borderWidth: 1,
          stack: 'p'
        }
      ]
    }),
    [labels, rows, dark]
  );

  const commonOptions: ChartOptions<any> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: palette.text }
        },
        tooltip: { enabled: true },
        ...(zoomReady
          ? {
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'x',
                  modifierKey: 'ctrl'
                },
                zoom: {
                  wheel: { enabled: true },
                  pinch: { enabled: true },
                  mode: 'x'
                }
              }
            }
          : {})
      },
      scales: {
        x: {
          ticks: { color: palette.text, maxRotation: 0, autoSkip: true },
          grid: { color: palette.grid }
        },
        y: {
          ticks: { color: palette.text },
          grid: { color: palette.grid }
        }
      }
    }),
    [palette, zoomReady]
  );

  function resetZoom() {
    balanceRef.current?.resetZoom?.();
    paymentsRef.current?.resetZoom?.();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Zoom: колёсико мыши / pinch. Pan: удерживайте Ctrl и тяните.
        </div>
        <button className="btn-secondary" onClick={resetZoom} type="button">
          Сбросить zoom
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <div className="text-sm font-semibold">Остаток долга</div>
          <div className="mt-3 h-72">
            <Line ref={balanceRef as any} data={lineData} options={commonOptions as any} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
          <div className="text-sm font-semibold">Структура платежей (stacked)</div>
          <div className="mt-3 h-72">
            <Bar
              ref={paymentsRef as any}
              data={barData}
              options={{
                ...(commonOptions as any),
                scales: {
                  ...(commonOptions.scales as any),
                  x: {
                    ...(commonOptions.scales as any).x,
                    stacked: true
                  },
                  y: {
                    ...(commonOptions.scales as any).y,
                    stacked: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

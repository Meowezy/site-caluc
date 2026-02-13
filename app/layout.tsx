import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Калькулятор кредита и ипотеки',
  description:
    'Современный калькулятор кредита и ипотеки: аннуитетные и дифференцированные платежи, досрочные погашения, график и экспорт в PDF.',
  keywords: [
    'калькулятор кредита',
    'калькулятор ипотеки',
    'аннуитет',
    'дифференцированный платеж',
    'досрочное погашение'
  ],
  openGraph: {
    title: 'Калькулятор кредита и ипотеки',
    description:
      'Рассчитайте график платежей с учётом досрочных погашений и скачайте отчёт.',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    const isDark = theme === 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch {}
})();`
          }}
        />
      </head>
      <body>
        <div className="min-h-screen">
          <SiteHeader />

          <main className="container-page py-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="container-page py-6 text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} • КредитПлан
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

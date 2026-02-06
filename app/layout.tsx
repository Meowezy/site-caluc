import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import LogoMark from '@/components/LogoMark';

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
          <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="container-page py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LogoMark className="h-10 w-10 shrink-0" />
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">КредитПлан</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Калькулятор кредита и ипотеки • PDF • Email
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

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

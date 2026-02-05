import type { Metadata } from 'next';
import './globals.css';

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
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="container-page py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Калькулятор кредита и ипотеки</div>
                  <div className="text-sm text-slate-500">
                    Аннуитет / дифференцированный • Досрочные • PDF • Email
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container-page py-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="container-page py-6 text-sm text-slate-500">
              © {new Date().getFullYear()} • Калькулятор кредита и ипотеки
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

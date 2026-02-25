import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export const metadata: Metadata = {
  title: 'Калькулятор кредита — КредитПлан',
  description:
    'Современный калькулятор кредита: аннуитетные и дифференцированные платежи, досрочные погашения, график и экспорт в PDF.',
  keywords: [
    'калькулятор кредита',
    'аннуитет',
    'дифференцированный платеж',
    'досрочное погашение'
  ],
  icons: {
    icon: '/favicon.ico'
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Калькулятор кредита — КредитПлан',
    description:
      'Рассчитайте график платежей с учётом досрочных погашений и скачайте отчёт в PDF.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'КредитПлан',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'КредитПлан — Калькулятор кредита'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Калькулятор кредита — КредитПлан',
    description: 'Рассчитайте график платежей с учётом досрочных погашений.',
    images: ['/og-image.png']
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
        <div className="min-h-screen flex flex-col">
          <SiteHeader />

          <main className="container-page py-8 flex-1">{children}</main>

          <ScrollToTopButton />

          <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 mt-auto">
            <div className="container-page py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div>© {new Date().getFullYear()} • КредитПлан</div>
                <a
                  href="/privacy"
                  className="hover:text-bank-600 dark:hover:text-bank-500 transition-colors underline-offset-4 hover:underline"
                >
                  Политика конфиденциальности
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

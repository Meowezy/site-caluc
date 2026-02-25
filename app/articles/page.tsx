export default function ArticlesPage() {
  const articles = [
    {
      title: 'Как быстро погасить кредит: 7 эффективных стратегий',
      slug: 'kak-bystro-pogasit-kredit',
      description: 'Узнайте проверенные методы досрочного погашения кредита и сэкономьте на процентах.',
      date: '2026-02-20',
      readTime: '7 мин'
    },
    {
      title: 'Виды кредитов и их отличия: полный гид заёмщика',
      slug: 'vidy-kreditov',
      description: 'Разбираемся в типах кредитов, их особенностях и выбираем оптимальный вариант.',
      date: '2026-02-18',
      readTime: '6 мин'
    },
    {
      title: 'Материнский капитал: как оформить и использовать в 2026 году',
      slug: 'materinskiy-kapital',
      description: 'Полная инструкция по получению и использованию материнского капитала.',
      date: '2026-02-15',
      readTime: '5 мин'
    },
    {
      title: 'Семейная ипотека: ставка 6% для семей с детьми',
      slug: 'semeynaya-ipoteka',
      description: 'Как получить льготную семейную ипотеку: условия, требования и подводные камни.',
      date: '2026-02-12',
      readTime: '5 мин'
    },
    {
      title: 'ИТ-ипотека: льготная ставка 5% для IT-специалистов',
      slug: 'it-ipoteka',
      description: 'Подробное руководство по оформлению льготной ипотеки для работников IT-сферы.',
      date: '2026-02-10',
      readTime: '5 мин'
    }
  ];

  return (
    <div className="space-y-8">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-bank-600 dark:hover:text-bank-500 transition-colors mb-4"
      >
        ← На главную
      </a>

      <section className="card p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold">Статьи о кредитах и ипотеке</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Полезные материалы, которые помогут вам принять взвешенное решение при выборе кредита
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="card p-6 transition-all hover:shadow-lg hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span>📅 {article.date}</span>
              <span>•</span>
              <span>🕐 {article.readTime}</span>
            </div>

            <h2 className="text-lg font-semibold mb-2 group-hover:text-bank-600 dark:group-hover:text-bank-500 transition-colors">
              {article.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{article.description}</p>

            <span className="text-sm font-medium text-bank-600 dark:text-bank-500">Читать далее →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

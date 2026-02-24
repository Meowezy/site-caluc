export default function AboutPage() {
  return (
    <div className="space-y-6">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-bank-600 dark:hover:text-bank-500 transition-colors mb-4"
      >
        ← На главную
      </a>
      
      <section className="card p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4">О сервисе КредитПлан</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            КредитПлан — это современный и бесплатный онлайн-калькулятор для расчёта кредитов.
            Наш сервис помогает принимать взвешенные финансовые решения и планировать свой бюджет.
          </p>
        </div>
      </section>

      <section className="card p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">Для чего нужен КредитПлан?</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bank-600/10 dark:bg-bank-600/20 flex items-center justify-center text-bank-600 font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Планирование кредита</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Рассчитайте размер ежемесячного платежа до обращения в банк. Узнайте, сколько вы
                переплатите по процентам и какую сумму выплатите в итоге.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bank-600/10 dark:bg-bank-600/20 flex items-center justify-center text-bank-600 font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Досрочное погашение</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Планируйте досрочные платежи и смотрите, как они влияют на срок кредита и переплату.
                Добавляйте несколько досрочных платежей с выбором способа: сокращение срока или уменьшение платежа.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bank-600/10 dark:bg-bank-600/20 flex items-center justify-center text-bank-600 font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Сравнение типов платежей</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Выберите между аннуитетными (равными) и дифференцированными (уменьшающимися) платежами.
                Сравните переплату и комфорт выплат для вашей ситуации.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bank-600/10 dark:bg-bank-600/20 flex items-center justify-center text-bank-600 font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Визуализация и отчёты</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Получите наглядный график платежей, таблицу с детализацией по месяцам и профессиональный
                PDF-отчёт. Отправьте отчёт себе на почту или скачайте для печати.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">Основные возможности</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Точный расчёт</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Математически корректные расчёты по банковским формулам для аннуитетных и дифференцированных платежей
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold mb-1">График платежей</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Детальная таблица с датами, суммами основного долга, процентов и остатка по месяцам
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold mb-1">Досрочные платежи</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Гибкая система досрочных погашений с выбором стратегии: сокращение срока или уменьшение платежа
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold mb-1">Экспорт отчётов</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Скачивание PDF с логотипом и полной детализацией или отправка отчёта на email
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold mb-1">Интерактивные графики</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Наглядная визуализация структуры платежей и динамики погашения основного долга
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-2xl mb-2">🌙</div>
            <h3 className="font-semibold mb-1">Тёмная тема</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Комфортная работа в любое время суток с автоматическим переключением темы
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">Кому подойдёт КредитПлан?</h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
              ✓
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Планирующим взять кредит</span> — узнайте реальную нагрузку на бюджет до подписания договора
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
              ✓
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Уже имеющим кредит</span> — планируйте досрочное погашение и экономьте на процентах
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
              ✓
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Сравнивающим предложения банков</span> — проверьте расчёты и сравните условия разных кредиторов
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
              ✓
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Финансовым консультантам</span> — профессиональный инструмент для работы с клиентами
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6 md:p-8 bg-gradient-to-br from-bank-50 to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
        <h2 className="text-xl font-semibold mb-4">Начните планировать прямо сейчас</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          КредитПлан — это бесплатный, удобный и точный инструмент для расчёта кредитов.
          Никакой регистрации, никаких скрытых платежей. Просто введите параметры и получите результат.
        </p>
        <a
          href="/"
          className="btn inline-flex"
        >
          Перейти к калькулятору
        </a>
      </section>
    </div>
  );
}

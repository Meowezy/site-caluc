export default function ArticlePage() {
  return (
    <div className="space-y-6">
      <div className="card p-6 md:p-8">
        <a href="/articles" className="text-sm text-bank-600 dark:text-bank-500 hover:underline mb-4 inline-block">
          ← Назад к статьям
        </a>
        
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Семейная ипотека: ставка 6% для семей с детьми
        </h1>
        
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-4">
          <span>📅 12 февраля 2026</span>
          <span>•</span>
          <span>🕐 5 мин чтения</span>
        </div>
      </div>

      <div className="card p-6 md:p-8 prose dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Семейная ипотека — это государственная программа льготного кредитования для семей с детьми. 
          Ставка составляет всего 6% годовых на весь срок кредита.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Кто может получить семейную ипотеку?</h2>
        <p>Программа доступна семьям, в которых:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Есть хотя бы один ребёнок, рождённый в период с 1 января 2018 года по 31 декабря 2023 года</li>
          <li>Или двое и более детей (независимо от года рождения)</li>
          <li>Заёмщик и все дети — граждане РФ</li>
        </ul>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <strong>Важно:</strong> Программа продлена до 31 декабря 2030 года!
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Условия программы</h2>
        
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="card p-4">
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">6%</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Процентная ставка на весь срок</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">15%</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Минимальный первоначальный взнос</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">До 30 лет</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Максимальный срок кредита</p>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">До 12 млн ₽</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Максимальная сумма кредита*</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          * В Москве, Санкт-Петербурге, Московской и Ленинградской областях. В других регионах — до 6 млн ₽.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Что можно купить?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Готовое жильё на первичном рынке (от застройщика)</li>
          <li>Квартиру в строящемся доме</li>
          <li>Частный дом с земельным участком</li>
          <li>Жильё по договору долевого участия (ДДУ)</li>
        </ul>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <strong>Внимание:</strong> Вторичное жильё по семейной ипотеке купить нельзя!
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Преимущества семейной ипотеки</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Низкая ставка на весь срок</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">6% годовых фиксируется до полного погашения кредита</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Можно использовать маткапитал</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Для первого взноса или досрочного погашения</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Господдержка</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Государство субсидирует часть процентов банку</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Возможность рефинансирования</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Можно рефинансировать существующую ипотеку под 6%</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Требования к заёмщикам</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Гражданство РФ</li>
          <li>Возраст от 21 года до 75 лет на момент погашения</li>
          <li>Официальный доход, достаточный для платежей</li>
          <li>Стаж работы: не менее 3 месяцев на текущем месте</li>
          <li>Положительная кредитная история</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Как оформить?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">Выберите жильё</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Новостройка от аккредитованного застройщика</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">Подайте заявку в банк</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Можно онлайн или в отделении</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">Соберите документы</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Паспорт, свидетельства о рождении детей, справка о доходах</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h4 className="font-semibold">Дождитесь одобрения</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Обычно занимает 2-5 рабочих дней</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div>
              <h4 className="font-semibold">Подпишите договор</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">И получите деньги для покупки жилья</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Подводные камни</h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg space-y-2">
          <p>⚠️ Программа действует только для новостроек</p>
          <p>⚠️ Не все застройщики аккредитованы банками</p>
          <p>⚠️ Требуется страхование жизни и здоровья (добровольное, но влияет на ставку)</p>
          <p>⚠️ При продаже квартиры до погашения кредита могут возникнуть сложности</p>
        </div>

        <div className="bg-bank-50 dark:bg-bank-900/20 p-6 rounded-xl mt-8">
          <h3 className="text-lg font-semibold mb-3">💡 Рассчитайте свой платёж</h3>
          <p>
            Используйте наш калькулятор, чтобы узнать точный ежемесячный платёж по семейной ипотеке. 
            Учтите материнский капитал и досрочные погашения!
          </p>
          <a href="/" className="btn mt-4 inline-flex">
            Рассчитать семейную ипотеку
          </a>
        </div>
      </div>
    </div>
  );
}

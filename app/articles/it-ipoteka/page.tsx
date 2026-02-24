export default function ArticlePage() {
  return (
    <div className="space-y-6">
      <div className="card p-6 md:p-8">
        <a href="/articles" className="text-sm text-bank-600 dark:text-bank-500 hover:underline mb-4 inline-block">
          ← Назад к статьям
        </a>
        
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          ИТ-ипотека: льготная ставка 5% для IT-специалистов
        </h1>
        
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-4">
          <span>📅 10 февраля 2026</span>
          <span>•</span>
          <span>🕐 5 мин чтения</span>
        </div>
      </div>

      <div className="card p-6 md:p-8 prose dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          ИТ-ипотека — это государственная программа льготного кредитования для работников IT-сферы. 
          Ставка составляет всего 5% годовых, что делает её одной из самых выгодных на рынке.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Кто может получить ИТ-ипотеку?</h2>
        <p>Программа доступна специалистам, которые:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Работают в аккредитованной IT-компании из реестра Минцифры</li>
          <li>Имеют гражданство РФ</li>
          <li>Получают зарплату не менее 150 000 ₽ в месяц (до вычета НДФЛ)</li>
          <li>Работают по трудовому договору (не ИП, не самозанятые)</li>
        </ul>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <strong>Важно:</strong> Работодатель должен быть в реестре аккредитованных IT-компаний. 
          Проверить можно на сайте Минцифры.
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Условия программы</h2>
        
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="card p-4">
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">5%</div>
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
            <div className="text-2xl font-bold text-bank-600 dark:text-bank-500">До 18 млн ₽</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Максимальная сумма кредита*</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          * В Москве и Московской области. В Санкт-Петербурге и Ленинградской области — до 9 млн ₽, 
          в других регионах — до 6 млн ₽.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Что можно купить?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Квартиру на первичном рынке (от застройщика)</li>
          <li>Квартиру на вторичном рынке</li>
          <li>Частный дом с участком</li>
          <li>Комнату</li>
          <li>Апартаменты (в некоторых банках)</li>
        </ul>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <strong>Преимущество:</strong> В отличие от семейной ипотеки, можно купить и вторичное жильё!
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Требования к заёмщику</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <strong>Гражданство и возраст</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Гражданин РФ от 21 до 75 лет на момент погашения</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <strong>Работа в IT</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Трудовой договор с аккредитованной компанией из реестра Минцифры</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <strong>Доход</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Не менее 150 000 ₽/мес (подтверждается справкой 2-НДФЛ или выписками по зарплатной карте)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <strong>Стаж</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Общий трудовой стаж от 6 месяцев, на текущем месте — от 3 месяцев</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <strong>Кредитная история</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Положительная, без просрочек</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Документы для оформления</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h4 className="font-semibold mb-2">От заёмщика</h4>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Паспорт РФ</li>
              <li>• СНИЛС</li>
              <li>• Трудовая книжка или договор</li>
              <li>• Справка 2-НДФЛ или выписка по счёту</li>
            </ul>
          </div>
          <div className="card p-4">
            <h4 className="font-semibold mb-2">От работодателя</h4>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Справка о зарплате за 6 месяцев</li>
              <li>• Подтверждение аккредитации</li>
              <li>• Выписка из ЕГРЮЛ</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Преимущества ИТ-ипотеки</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Самая низкая ставка на рынке</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">5% — это ниже инфляции!</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Первичный и вторичный рынок</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Больше вариантов выбора жилья</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Большой лимит</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">До 18 млн ₽ в столице</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            <div>
              <strong>Можно совмещать с маткапиталом</strong>
              <p className="text-sm text-slate-600 dark:text-slate-400">Для первого взноса или досрочного погашения</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Как оформить ИТ-ипотеку?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">Проверьте работодателя</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Убедитесь, что компания в реестре Минцифры</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">Выберите банк</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Не все банки участвуют в программе (Сбер, ВТБ, Альфа и др.)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">Подайте онлайн-заявку</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Большинство банков принимают заявки через сайт</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h4 className="font-semibold">Предоставьте документы</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">От вас и от работодателя</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
            <div>
              <h4 className="font-semibold">Получите одобрение</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Обычно 2-5 рабочих дней</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">6</div>
            <div>
              <h4 className="font-semibold">Выберите объект недвижимости</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Первичка или вторичка</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-bank-600 text-white rounded-full flex items-center justify-center font-bold">7</div>
            <div>
              <h4 className="font-semibold">Подпишите договор</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">И получите деньги на покупку!</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Подводные камни</h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-2">
          <p>⚠️ <strong>Обязательное условие:</strong> работать в IT не менее 3 лет после получения ипотеки. 
          При увольнении ставка может вырасти до рыночной (~15-18%)!</p>
          <p>⚠️ Не все IT-компании аккредитованы</p>
          <p>⚠️ Высокие требования к доходу (от 150 000 ₽/мес)</p>
          <p>⚠️ Программа может завершиться досрочно (пока действует до конца 2030 года)</p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Часто задаваемые вопросы</h2>
        
        <div className="space-y-4">
          <details className="card p-4">
            <summary className="font-semibold cursor-pointer">Можно ли уволиться после получения ипотеки?</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Нужно работать в IT минимум 3 года. При досрочном увольнении банк может повысить ставку до рыночной.
            </p>
          </details>
          
          <details className="card p-4">
            <summary className="font-semibold cursor-pointer">Работаю фрилансером в IT. Могу получить ИТ-ипотеку?</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Нет, нужен трудовой договор с аккредитованной компанией. ИП и самозанятые не подходят.
            </p>
          </details>
          
          <details className="card p-4">
            <summary className="font-semibold cursor-pointer">Можно совмещать с другими льготными программами?</summary>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              С семейной ипотекой — нельзя (нужно выбрать что-то одно). С маткапиталом — можно.
            </p>
          </details>
        </div>

        <div className="bg-bank-50 dark:bg-bank-900/20 p-6 rounded-xl mt-8">
          <h3 className="text-lg font-semibold mb-3">💡 Посчитайте выгоду</h3>
          <p>
            При ставке 5% вместо 15% экономия на процентах может достигать миллионов рублей! 
            Используйте наш калькулятор, чтобы сравнить ИТ-ипотеку с обычной.
          </p>
          <a href="/" className="btn mt-4 inline-flex">
            Рассчитать ИТ-ипотеку
          </a>
        </div>
      </div>
    </div>
  );
}

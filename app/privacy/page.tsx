import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности • КредитПлан',
  description: 'Политика конфиденциальности сервиса КредитПлан'
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-bank-600 dark:hover:text-bank-500 transition-colors mb-4"
      >
        ← На главную
      </a>
      
      <section className="card p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Политика конфиденциальности</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Общие положения</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты
              информации о пользователях сервиса КредитПлан (далее — «Сервис»).
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Используя Сервис, вы соглашаетесь с условиями данной Политики конфиденциальности.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Собираемая информация</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Сервис может собирать следующую информацию:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
              <li>Данные, введённые пользователем в калькулятор (сумма кредита, срок, ставка)</li>
              <li>Адрес электронной почты (при использовании функции отправки отчёта)</li>
              <li>Техническая информация (IP-адрес, тип браузера, время посещения)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Цели использования информации</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Собранная информация используется для:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
              <li>Предоставления функционала калькулятора</li>
              <li>Отправки PDF-отчётов на email по запросу пользователя</li>
              <li>Улучшения работы Сервиса и анализа его использования</li>
              <li>Обеспечения безопасности и предотвращения злоупотреблений</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Хранение и защита данных</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Мы принимаем необходимые организационные и технические меры для защиты информации
              от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Данные калькулятора обрабатываются локально в браузере и не передаются на сервер,
              за исключением случаев генерации PDF-отчётов и отправки email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Передача данных третьим лицам</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Мы не продаём и не передаём персональные данные третьим лицам, за исключением
              случаев, предусмотренных законодательством, или при использовании сторонних
              сервисов для отправки email (SendGrid, SMTP-провайдеры).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Cookies и технологии отслеживания</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Сервис использует localStorage для сохранения настроек темы (светлая/тёмная).
              Данная информация хранится локально в вашем браузере и не передаётся на сервер.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Права пользователей</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Вы имеете право:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
              <li>Получать информацию о собранных данных</li>
              <li>Требовать удаления ваших персональных данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Изменения в Политике конфиденциальности</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.
              Актуальная версия всегда доступна на данной странице.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Контакты</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              По вопросам, связанным с обработкой персональных данных, вы можете обратиться
              через форму обратной связи на сайте или по адресу: support@kreditplan.ru
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

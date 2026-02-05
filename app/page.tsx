import CalculatorApp from '@/components/CalculatorApp';

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="card p-5 md:p-8">
        <h1 className="text-xl font-semibold">Расчёт кредита / ипотеки</h1>
        <p className="mt-2 text-sm text-slate-600">
          Заполните параметры кредита, добавьте досрочные погашения и получите подробный
          график платежей, таблицу и график.
        </p>
      </section>

      <CalculatorApp />
    </div>
  );
}

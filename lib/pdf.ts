import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import type { CalcRequest, CalcResponse } from '@/lib/types';

function formatMoney(v: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(v);
}

export async function buildPdfReport(params: {
  request: CalcRequest;
  result: CalcResponse;
}): Promise<Uint8Array> {
  const { request, result } = params;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const margin = 40;
  let y = height - margin;

  const drawText = (text: string, options?: { bold?: boolean; size?: number }) => {
    const size = options?.size ?? 12;
    const f = options?.bold ? fontBold : font;
    page.drawText(text, { x: margin, y, size, font: f, color: rgb(0.06, 0.09, 0.14) });
    y -= size + 6;
  };

  drawText('Калькулятор кредита и ипотеки — отчёт', { bold: true, size: 16 });
  y -= 6;

  drawText(`Сумма: ${formatMoney(request.principal)}`);
  drawText(`Срок (план): ${request.termMonths} мес.`);
  drawText(`Ставка: ${request.annualRate}% годовых`);
  drawText(`Тип платежей: ${request.paymentType === 'ANNUITY' ? 'Аннуитет' : 'Дифференцированный'}`);

  y -= 10;
  drawText('Итоги', { bold: true, size: 14 });
  drawText(`Переплата по процентам: ${formatMoney(result.summary.totalInterest)}`);
  drawText(`Досрочные платежи: ${formatMoney(result.summary.totalEarlyPayments)}`);
  drawText(`Всего к оплате: ${formatMoney(result.summary.totalPaid)}`);
  drawText(`Фактический срок: ${result.summary.actualMonths} мес.`);

  y -= 12;
  drawText('График (первые 25 строк)', { bold: true, size: 14 });

  const rows = result.schedule.slice(0, 25);
  const header = ['Мес', 'Платёж', '%', 'Долг', 'Досрочно', 'Остаток'];
  const colX = [margin, margin + 45, margin + 150, margin + 235, margin + 330, margin + 435];

  const drawRow = (values: string[], isHeader = false) => {
    const size = 9;
    const f = isHeader ? fontBold : font;
    values.forEach((v, i) => {
      page.drawText(v, { x: colX[i], y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
    });
    y -= 14;
  };

  drawRow(header, true);
  page.drawLine({
    start: { x: margin, y: y + 6 },
    end: { x: width - margin, y: y + 6 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });

  for (const r of rows) {
    if (y < margin + 30) break;
    drawRow([
      String(r.month),
      formatMoney(r.paymentTotal),
      formatMoney(r.interest),
      formatMoney(r.principal),
      r.earlyPayment > 0 ? formatMoney(r.earlyPayment) : '—',
      formatMoney(r.balanceAfter)
    ]);
  }

  return pdfDoc.save();
}

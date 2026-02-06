import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib';

import type { CalcRequest, CalcResponse, ScheduleRow } from '@/lib/types';

function formatMoney(v: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(v);
}

type PdfCtx = {
  pdfDoc: PDFDocument;
  font: any;
  fontBold: any;
  margin: number;
  pageWidth: number;
  pageHeight: number;
};

function addPage(ctx: PdfCtx) {
  const page = ctx.pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  return page;
}

function drawTitleBlock(params: {
  ctx: PdfCtx;
  page: PDFPage;
  request: CalcRequest;
  result: CalcResponse;
  yStart: number;
}) {
  const { ctx, page, request, result } = params;
  const { margin, font, fontBold } = ctx;

  let y = params.yStart;

  const drawText = (text: string, options?: { bold?: boolean; size?: number; color?: any }) => {
    const size = options?.size ?? 12;
    const f = options?.bold ? fontBold : font;
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: f,
      color: options?.color ?? rgb(0.06, 0.09, 0.14)
    });
    y -= size + 6;
  };

  drawText('Калькулятор кредита и ипотеки — отчёт', { bold: true, size: 16 });
  y -= 6;

  drawText(`Сумма: ${formatMoney(request.principal)}`);
  drawText(`Срок (план): ${request.termMonths} мес.`);
  drawText(`Ставка: ${request.annualRate}% годовых`);
  drawText(
    `Тип платежей: ${request.paymentType === 'ANNUITY' ? 'Аннуитет' : 'Дифференцированный'}`
  );
  if (request.startDate) drawText(`Дата начала: ${request.startDate}`);

  y -= 10;
  drawText('Итоги', { bold: true, size: 14 });
  drawText(`Переплата по процентам: ${formatMoney(result.summary.totalInterest)}`);
  drawText(`Досрочные платежи: ${formatMoney(result.summary.totalEarlyPayments)}`);
  drawText(`Всего к оплате: ${formatMoney(result.summary.totalPaid)}`);
  drawText(`Фактический срок: ${result.summary.actualMonths} мес.`);

  return y;
}

function drawTableHeader(params: {
  ctx: PdfCtx;
  page: PDFPage;
  y: number;
  columns: { label: string; x: number }[];
}) {
  const { ctx, page, columns } = params;
  const { margin, pageWidth, fontBold } = ctx;
  let { y } = params;

  const size = 9;
  for (const c of columns) {
    page.drawText(c.label, {
      x: c.x,
      y,
      size,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1)
    });
  }
  y -= 12;

  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: pageWidth - margin, y: y + 5 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });

  return y;
}

function drawTableRow(params: {
  ctx: PdfCtx;
  page: PDFPage;
  y: number;
  columns: { x: number }[];
  values: string[];
  isAlt?: boolean;
}) {
  const { ctx, page, columns, values } = params;
  const { margin, pageWidth, font } = ctx;
  let { y } = params;

  // subtle zebra background
  if (params.isAlt) {
    page.drawRectangle({
      x: margin,
      y: y - 2,
      width: pageWidth - margin * 2,
      height: 12,
      color: rgb(0.98, 0.98, 0.99)
    });
  }

  const size = 9;
  values.forEach((v, i) => {
    page.drawText(v, { x: columns[i].x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
  });
  y -= 12;
  return y;
}

function rowToValues(r: ScheduleRow) {
  return [
    String(r.month),
    r.dateLabel ?? '—',
    formatMoney(r.paymentTotal),
    formatMoney(r.interest),
    formatMoney(r.principal),
    r.earlyPayment > 0 ? formatMoney(r.earlyPayment) : '—',
    formatMoney(r.balanceAfter)
  ];
}

export async function buildPdfReport(params: {
  request: CalcRequest;
  result: CalcResponse;
}): Promise<Uint8Array> {
  const { request, result } = params;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const ctx: PdfCtx = {
    pdfDoc,
    font,
    fontBold,
    margin: 40,
    pageWidth: 595.28,
    pageHeight: 841.89
  };

  const columns = [
    { label: 'Мес', x: ctx.margin },
    { label: 'Дата', x: ctx.margin + 35 },
    { label: 'Платёж', x: ctx.margin + 105 },
    { label: '%', x: ctx.margin + 210 },
    { label: 'Долг', x: ctx.margin + 285 },
    { label: 'Досрочно', x: ctx.margin + 360 },
    { label: 'Остаток', x: ctx.margin + 455 }
  ];

  let page = addPage(ctx);
  let y = ctx.pageHeight - ctx.margin;

  y = drawTitleBlock({ ctx, page, request, result, yStart: y });
  y -= 10;

  // Table title
  page.drawText('График платежей', {
    x: ctx.margin,
    y,
    size: 14,
    font: ctx.fontBold,
    color: rgb(0.06, 0.09, 0.14)
  });
  y -= 18;

  y = drawTableHeader({ ctx, page, y, columns });

  const bottomLimit = ctx.margin + 30;

  for (let i = 0; i < result.schedule.length; i++) {
    const r = result.schedule[i];

    // page break
    if (y < bottomLimit) {
      page = addPage(ctx);
      y = ctx.pageHeight - ctx.margin;
      y = drawTableHeader({ ctx, page, y, columns });
    }

    y = drawTableRow({
      ctx,
      page,
      y,
      columns,
      values: rowToValues(r),
      isAlt: i % 2 === 1
    });
  }

  return pdfDoc.save();
}

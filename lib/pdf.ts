import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib';

import type { CalcRequest, CalcResponse, ScheduleRow } from '@/lib/types';

function formatMoneyPdf(v: number) {
  // Avoid non-WinAnsi symbols (like "₽") to keep StandardFonts compatible.
  const num = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(v);
  return `${num} RUB`;
}

// WinAnsi safe text: transliterate Russian -> Latin (best-effort)
const RU_MAP: Record<string, string> = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'E', Ж: 'Zh', З: 'Z', И: 'I', Й: 'Y',
  К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F',
  Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Sch', Ъ: '', Ы: 'Y', Ь: '', Э: 'E', Ю: 'Yu', Я: 'Ya',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

function safeText(s: string) {
  // Replace unsupported characters with transliteration.
  // Also normalize quotes.
  return s
    .replace(/[«»]/g, '"')
    .split('')
    .map((ch) => RU_MAP[ch] ?? ch)
    .join('');
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
  return ctx.pdfDoc.addPage([595.28, 841.89]); // A4 portrait
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
    page.drawText(safeText(text), {
      x: margin,
      y,
      size,
      font: f,
      color: options?.color ?? rgb(0.06, 0.09, 0.14)
    });
    y -= size + 6;
  };

  drawText('KreditPlan — otchet', { bold: true, size: 16 });
  y -= 6;

  drawText(`Summa: ${formatMoneyPdf(request.principal)}`);
  drawText(`Srok (plan): ${request.termMonths} mes.`);
  drawText(`Stavka: ${request.annualRate}% godovyh`);
  drawText(`Tip platezhey: ${request.paymentType === 'ANNUITY' ? 'Annuitet' : 'Differenc.'}`);
  if (request.startDate) drawText(`Data nachala: ${request.startDate}`);

  y -= 10;
  drawText('Itogi', { bold: true, size: 14 });
  drawText(`Procenty: ${formatMoneyPdf(result.summary.totalInterest)}`);
  drawText(`Dosrochnye: ${formatMoneyPdf(result.summary.totalEarlyPayments)}`);
  drawText(`Vsego: ${formatMoneyPdf(result.summary.totalPaid)}`);
  drawText(`Fakticheskiy srok: ${result.summary.actualMonths} mes.`);

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
    page.drawText(safeText(c.label), {
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
    page.drawText(safeText(v), { x: columns[i].x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
  });
  y -= 12;
  return y;
}

function rowToValues(r: ScheduleRow) {
  return [
    String(r.month),
    r.dateLabel ?? '-',
    formatMoneyPdf(r.paymentTotal),
    formatMoneyPdf(r.interest),
    formatMoneyPdf(r.principal),
    r.earlyPayment > 0 ? formatMoneyPdf(r.earlyPayment) : '-',
    formatMoneyPdf(r.balanceAfter)
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
    { label: 'Mes', x: ctx.margin },
    { label: 'Data', x: ctx.margin + 35 },
    { label: 'Plateg', x: ctx.margin + 105 },
    { label: '%', x: ctx.margin + 210 },
    { label: 'Dolg', x: ctx.margin + 285 },
    { label: 'Dosrochno', x: ctx.margin + 360 },
    { label: 'Ostatok', x: ctx.margin + 455 }
  ];

  let page = addPage(ctx);
  let y = ctx.pageHeight - ctx.margin;

  y = drawTitleBlock({ ctx, page, request, result, yStart: y });
  y -= 10;

  page.drawText(safeText('Grafik platezhey'), {
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

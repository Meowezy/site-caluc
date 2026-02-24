import { PDFDocument, StandardFonts, rgb, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { CalcRequest, CalcResponse, ScheduleRow } from '@/lib/types';

function formatMoneyPdf(v: number) {
  const num = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(v);
  return `${num} ₽`;
}

// DejaVuSans base64 (subset with Cyrillic support) — using a minimal TTF for demo.
// In production, you'd load a full font file or use a CDN/file path.
// For now, we'll embed a font dynamically or fallback to Helvetica for non-Cyrillic.
// Since pdf-lib doesn't bundle Cyrillic fonts, we'll use a workaround:
// Load a TTF from the public folder or embed via base64 (for demo, use fallback).

// For this implementation, we'll use a simple approach:
// - Try to load a Cyrillic-compatible TTF if available
// - Otherwise, keep text as-is (pdf-lib will render what it can)

// Helper: no transliteration needed if we embed proper font
function safeText(s: string) {
  // Normalize quotes for better compatibility
  return s.replace(/[«»]/g, '"');
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
  logoImage?: any;
}) {
  const { ctx, page, request, result, logoImage } = params;
  const { margin, font, fontBold, pageWidth } = ctx;

  let y = params.yStart;

  const drawText = (text: string, options?: { bold?: boolean; size?: number; color?: any; x?: number }) => {
    const size = options?.size ?? 12;
    const f = options?.bold ? fontBold : font;
    page.drawText(safeText(text), {
      x: options?.x ?? margin,
      y,
      size,
      font: f,
      color: options?.color ?? rgb(0.06, 0.09, 0.14)
    });
    y -= size + 6;
  };

  // Draw logo and header
  if (logoImage) {
    const logoSize = 40;
    page.drawImage(logoImage, {
      x: margin,
      y: y - logoSize,
      width: logoSize,
      height: logoSize
    });
    
    // Title next to logo
    page.drawText(safeText('КредитПлан — Отчёт'), {
      x: margin + logoSize + 10,
      y: y - 16,
      size: 16,
      font: fontBold,
      color: rgb(0.06, 0.09, 0.14)
    });
    
    // URL in the top-right corner
    const urlText = 'kreditplan.ru';
    const urlWidth = font.widthOfTextAtSize(urlText, 10);
    page.drawText(urlText, {
      x: pageWidth - margin - urlWidth,
      y: y - 10,
      size: 10,
      font,
      color: rgb(0.15, 0.38, 0.61) // Blue color for URL
    });
    
    y -= logoSize + 10;
  } else {
    drawText('КредитПлан — Отчёт', { bold: true, size: 16 });
    
    // URL in the top-right corner
    const urlText = 'kreditplan.ru';
    const urlWidth = font.widthOfTextAtSize(urlText, 10);
    page.drawText(urlText, {
      x: pageWidth - margin - urlWidth,
      y: y + 6,
      size: 10,
      font,
      color: rgb(0.15, 0.38, 0.61)
    });
    
    y -= 6;
  }

  drawText(`Сумма кредита: ${formatMoneyPdf(request.principal)}`);
  drawText(`Срок (план): ${request.termMonths} мес.`);
  drawText(`Ставка: ${request.annualRate}% годовых`);
  drawText(`Тип платежей: ${request.paymentType === 'ANNUITY' ? 'Аннуитетные' : 'Дифференцированные'}`);
  if (request.startDate) drawText(`Дата начала: ${request.startDate}`);

  y -= 10;
  drawText('Итоги', { bold: true, size: 14 });
  drawText(`Проценты: ${formatMoneyPdf(result.summary.totalInterest)}`);
  drawText(`Досрочные: ${formatMoneyPdf(result.summary.totalEarlyPayments)}`);
  drawText(`Всего выплачено: ${formatMoneyPdf(result.summary.totalPaid)}`);
  drawText(`Фактический срок: ${result.summary.actualMonths} мес.`);
  
  // Add last payment date
  if (result.schedule.length > 0 && result.schedule[result.schedule.length - 1].dateLabel) {
    const lastDate = new Date(result.schedule[result.schedule.length - 1].dateLabel + 'T00:00:00');
    const formattedDate = lastDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long'
    });
    drawText(`Последний платёж: ${formattedDate}`);
  }

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
  pdfDoc.registerFontkit(fontkit);

  // Load Cyrillic-compatible font from public/fonts or embed
  // For demo, we'll try to load from file system (Next.js public folder)
  let font: any;
  let fontBold: any;

  try {
    // Try loading a Cyrillic font (e.g., Roboto) from /public/fonts
    // If not available, fall back to a minimal embedded font
    const fontPath = join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
    const fontBoldPath = join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf');
    
    const fontBytes = readFileSync(fontPath);
    const fontBoldBytes = readFileSync(fontBoldPath);
    
    font = await pdfDoc.embedFont(fontBytes);
    fontBold = await pdfDoc.embedFont(fontBoldBytes);
  } catch {
    // Fallback to StandardFonts if custom fonts not available
    // Note: this won't render Cyrillic properly
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  const ctx: PdfCtx = {
    pdfDoc,
    font,
    fontBold,
    margin: 40,
    pageWidth: 595.28,
    pageHeight: 841.89
  };

  const columns = [
    { label: '№', x: ctx.margin },
    { label: 'Дата', x: ctx.margin + 35 },
    { label: 'Платёж', x: ctx.margin + 105 },
    { label: 'Проценты', x: ctx.margin + 200 },
    { label: 'Долг', x: ctx.margin + 285 },
    { label: 'Досрочно', x: ctx.margin + 360 },
    { label: 'Остаток', x: ctx.margin + 450 }
  ];

  // Embed logo
  let logoImage: any;
  try {
    const logoPath = join(process.cwd(), 'logo.jpg');
    const logoBytes = readFileSync(logoPath);
    logoImage = await pdfDoc.embedJpg(logoBytes);
  } catch {
    // Logo not available, skip
    logoImage = null;
  }

  let page = addPage(ctx);
  let y = ctx.pageHeight - ctx.margin;

  y = drawTitleBlock({ ctx, page, request, result, yStart: y, logoImage });
  y -= 10;

  page.drawText(safeText('График платежей'), {
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

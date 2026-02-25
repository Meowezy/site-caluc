import ExcelJS from 'exceljs';
import type { CalcRequest, CalcResponse } from '@/lib/types';

export async function buildExcelReport(params: {
  request: CalcRequest;
  result: CalcResponse;
}): Promise<Buffer> {
  const { request, result } = params;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'КредитПлан';
  workbook.created = new Date();

  // Sheet 1: Summary
  const summarySheet = workbook.addWorksheet('Итоги');
  
  summarySheet.columns = [
    { key: 'param', width: 30 },
    { key: 'value', width: 25 }
  ];

  summarySheet.addRow({ param: 'ПАРАМЕТРЫ КРЕДИТА', value: '' });
  summarySheet.addRow({ param: 'Сумма кредита', value: `${formatMoney(request.principal)} ₽` });
  summarySheet.addRow({ param: 'Срок (месяцев)', value: request.termMonths });
  summarySheet.addRow({ param: 'Ставка годовых', value: `${request.annualRate}%` });
  summarySheet.addRow({
    param: 'Тип платежей',
    value: request.paymentType === 'ANNUITY' ? 'Аннуитетные' : 'Дифференцированные'
  });
  if (request.startDate) {
    summarySheet.addRow({ param: 'Дата начала', value: request.startDate });
  }

  summarySheet.addRow({ param: '', value: '' });
  summarySheet.addRow({ param: 'ИТОГИ', value: '' });
  summarySheet.addRow({ param: 'Проценты', value: `${formatMoney(result.summary.totalInterest)} ₽` });
  summarySheet.addRow({
    param: 'Досрочные платежи',
    value: `${formatMoney(result.summary.totalEarlyPayments)} ₽`
  });
  summarySheet.addRow({ param: 'Всего выплачено', value: `${formatMoney(result.summary.totalPaid)} ₽` });
  summarySheet.addRow({ param: 'Фактический срок (мес.)', value: result.summary.actualMonths });

  if (result.summary.savedInterest && result.summary.savedInterest > 0) {
    summarySheet.addRow({
      param: 'Экономия на процентах',
      value: `${formatMoney(result.summary.savedInterest)} ₽`
    });
  }

  // Style header rows
  summarySheet.getRow(1).font = { bold: true, size: 12 };
  summarySheet.getRow(7).font = { bold: true, size: 12 };

  // Sheet 2: Schedule
  const scheduleSheet = workbook.addWorksheet('График платежей');
  
  scheduleSheet.columns = [
    { header: '№', key: 'num', width: 6 },
    { header: 'Дата', key: 'date', width: 12 },
    { header: 'Платёж', key: 'payment', width: 15 },
    { header: 'Проценты', key: 'interest', width: 15 },
    { header: 'Основной долг', key: 'principal', width: 15 },
    { header: 'Досрочно', key: 'early', width: 15 },
    { header: 'Остаток', key: 'balance', width: 15 }
  ];

  // Style header
  scheduleSheet.getRow(1).font = { bold: true };
  scheduleSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' }
  };
  scheduleSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  scheduleSheet.getRow(1).alignment = { horizontal: 'center' };

  // Add data rows
  result.schedule.forEach((row, idx) => {
    scheduleSheet.addRow({
      num: row.month,
      date: row.dateLabel || '',
      payment: `${formatMoney(row.paymentTotal)} ₽`,
      interest: `${formatMoney(row.interest)} ₽`,
      principal: `${formatMoney(row.principal)} ₽`,
      early: row.earlyPayment > 0 ? `${formatMoney(row.earlyPayment)} ₽` : '—',
      balance: `${formatMoney(row.balanceAfter)} ₽`
    });

    // Zebra striping
    if (idx % 2 === 0) {
      scheduleSheet.getRow(idx + 2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' }
      };
    }
  });

  // Sheet 3: Early Payments (if any)
  if (request.earlyPayments && request.earlyPayments.length > 0) {
    const earlySheet = workbook.addWorksheet('Досрочные платежи');
    
    earlySheet.columns = [
      { header: 'Месяц №', key: 'month', width: 12 },
      { header: 'Сумма', key: 'amount', width: 20 },
      { header: 'Тип', key: 'type', width: 20 }
    ];

    earlySheet.getRow(1).font = { bold: true };
    earlySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }
    };
    earlySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    earlySheet.getRow(1).alignment = { horizontal: 'center' };

    request.earlyPayments.forEach((ep, idx) => {
      earlySheet.addRow({
        month: ep.monthIndex,
        amount: `${formatMoney(ep.amount)} ₽`,
        type: ep.reduceType === 'TERM' ? 'Сокращение срока' : 'Сокращение платежа'
      });

      if (idx % 2 === 0) {
        earlySheet.getRow(idx + 2).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' }
        };
      }
    });
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function formatMoney(v: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(v);
}

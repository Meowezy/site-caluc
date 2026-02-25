import { addMonths, format } from 'date-fns';

import type {
  CalcRequest,
  CalcResponse,
  EarlyPayment,
  PaymentType,
  ScheduleRow
} from '@/lib/types';

/**
 * Денежные расчёты делаем в копейках, чтобы избежать накопления ошибок float.
 */
function toCents(rub: number) {
  return Math.round(rub * 100);
}
function fromCents(cents: number) {
  return cents / 100;
}

function monthlyRate(annualRatePercent: number) {
  return annualRatePercent / 100 / 12;
}

function annuityPaymentCents(principalCents: number, rateMonthly: number, months: number) {
  if (months <= 0) return 0;
  if (rateMonthly === 0) return Math.round(principalCents / months);

  const p = principalCents;
  const r = rateMonthly;
  const pow = Math.pow(1 + r, months);
  const k = (r * pow) / (pow - 1);
  return Math.round(p * k);
}

type EarlyItem = { amountCents: number; mode: EarlyPayment['mode'] };

function buildEarlyPaymentResolver(eps: EarlyPayment[]) {
  // UNTIL_END: monthly from monthIndex until paid off
  const untilEnd = eps
    .filter((x) => x.repeat === 'UNTIL_END')
    .map((x) => ({ start: x.monthIndex, amountCents: toCents(x.amount), mode: x.mode }));

  const map = new Map<number, EarlyItem[]>();

  const add = (month: number, item: EarlyItem) => {
    const arr = map.get(month) ?? [];
    arr.push(item);
    map.set(month, arr);
  };

  for (const ep of eps) {
    const item = { amountCents: toCents(ep.amount), mode: ep.mode };
    const start = ep.monthIndex;

    if (ep.repeat === 'ONCE') {
      add(start, item);
      continue;
    }

    if (ep.repeat === 'MONTHLY') {
      // we don't know actual end month; will be limited by loop guard
      for (let m = start; m <= start + 1200; m++) add(m, item);
      continue;
    }

    if (ep.repeat === 'QUARTERLY') {
      for (let m = start; m <= start + 1200; m += 3) add(m, item);
      continue;
    }

    if (ep.repeat === 'UNTIL_END') {
      // handled separately (but also add a few months into map for convenience)
      for (let m = start; m <= start + 1200; m++) add(m, item);
      continue;
    }
  }

  function get(month: number): EarlyItem[] {
    const base = map.get(month) ?? [];
    const extra = untilEnd
      .filter((x) => month >= x.start)
      .map((x) => ({ amountCents: x.amountCents, mode: x.mode }));
    return base.length === 0 ? extra : [...base, ...extra];
  }

  return { get };
}

function buildDateLabel(startDateISO: string | undefined, monthIndex1: number) {
  if (!startDateISO) return undefined;
  const start = new Date(startDateISO + 'T00:00:00');
  const d = addMonths(start, monthIndex1 - 1);
  return format(d, 'MM.yyyy');
}

function clampCents(v: number) {
  return v < 0 ? 0 : v;
}

/**
 * Основной расчёт.
 *
 * Поддержка досрочных:
 * - repeat: ONCE/MONTHLY/QUARTERLY/UNTIL_END
 * - mode:
 *   - REDUCE_TERM: платёж (для аннуитета) сохраняем, сокращаем срок
 *   - REDUCE_PAYMENT: срок сохраняем, пересчитываем платёж (для аннуитета)
 *
 * Для дифференцированного:
 * - REDUCE_PAYMENT: пересчитываем долю основного долга на оставшийся срок
 * - REDUCE_TERM: сохраняем долю основного долга и тем самым сокращаем срок
 */
export function calculateSchedule(req: CalcRequest): CalcResponse {
  const rateM = monthlyRate(req.annualRate);
  const early = buildEarlyPaymentResolver(req.earlyPayments);

  let balance = toCents(req.principal);

  // Remaining planned months can change for REDUCE_TERM (or if paid off earlier)
  let remainingMonthsPlanned = Math.max(1, req.termMonths);

  // For annuity: current fixed payment (unless reduce_payment recalculates it)
  let annuityPayment =
    req.paymentType === 'ANNUITY'
      ? annuityPaymentCents(balance, rateM, remainingMonthsPlanned)
      : 0;

  // For differentiated: principal part per month
  let diffPrincipalPart =
    req.paymentType === 'DIFFERENTIATED'
      ? Math.floor(balance / remainingMonthsPlanned)
      : 0;

  const schedule: ScheduleRow[] = [];

  let totalPaid = 0;
  let totalInterest = 0;
  let totalEarly = 0;

  const MAX_MONTHS_GUARD = 2000;

  for (let month = 1; month <= MAX_MONTHS_GUARD; month++) {
    if (balance <= 0) break;

    const balanceBefore = balance;

    // interest: balance * rateM
    const interest = Math.round(balanceBefore * rateM);

    let principalPayment = 0;
    let paymentTotal = 0;

    if (req.paymentType === 'ANNUITY') {
      // if rate=0 and annuityPayment may be 0 due to rounding, ensure at least pay something
      paymentTotal = annuityPayment;
      if (paymentTotal <= 0) paymentTotal = Math.min(balanceBefore, Math.round(balanceBefore / remainingMonthsPlanned));

      principalPayment = clampCents(paymentTotal - interest);

      // last month adjustments
      if (principalPayment > balanceBefore) {
        principalPayment = balanceBefore;
        paymentTotal = interest + principalPayment;
      }
    } else {
      // DIFFERENTIATED
      // ensure principal part at least 1 cent and not more than balance
      principalPayment = Math.min(balanceBefore, Math.max(1, diffPrincipalPart));
      paymentTotal = interest + principalPayment;
    }

    // Apply base payment
    balance = clampCents(balance - principalPayment);

    // Early payments for this month
    const earlyItems = early.get(month);
    let earlyPaidThisMonth = 0;

    // Apply early payments (after scheduled payment).
    // If multiple early payments exist, apply sequentially.
    let reducePaymentTriggered = false;
    let reduceTermTriggered = false;

    for (const ep of earlyItems) {
      if (balance <= 0) break;
      const pay = Math.min(balance, Math.max(0, ep.amountCents));
      if (pay <= 0) continue;
      balance = clampCents(balance - pay);
      earlyPaidThisMonth += pay;

      if (ep.mode === 'REDUCE_PAYMENT') reducePaymentTriggered = true;
      if (ep.mode === 'REDUCE_TERM') reduceTermTriggered = true;
    }

    const row: ScheduleRow = {
      month,
      dateLabel: buildDateLabel(req.startDate, month),
      paymentTotal: fromCents(paymentTotal),
      principal: fromCents(principalPayment),
      interest: fromCents(interest),
      earlyPayment: fromCents(earlyPaidThisMonth),
      balanceBefore: fromCents(balanceBefore),
      balanceAfter: fromCents(balance)
    };
    schedule.push(row);

    totalPaid += paymentTotal + earlyPaidThisMonth;
    totalInterest += interest;
    totalEarly += earlyPaidThisMonth;

    // update remaining planned months after completing this month
    remainingMonthsPlanned = Math.max(0, remainingMonthsPlanned - 1);

    if (balance <= 0) break;

    // Re-plan if early payment has an effect
    if (req.paymentType === 'ANNUITY') {
      if (reducePaymentTriggered) {
        // keep remaining term (as of now) and recalc payment
        const monthsLeft = Math.max(1, remainingMonthsPlanned);
        annuityPayment = annuityPaymentCents(balance, rateM, monthsLeft);
      } else if (reduceTermTriggered) {
        // keep payment; term reduces naturally because balance is lower
        // no action; but if payment is now more than needed, it will be adjusted in final month
      }
    } else {
      // DIFFERENTIATED
      if (reducePaymentTriggered) {
        const monthsLeft = Math.max(1, remainingMonthsPlanned);
        diffPrincipalPart = Math.floor(balance / monthsLeft);
      } else if (reduceTermTriggered) {
        // keep diffPrincipalPart
      }
    }

    // If we ran out of planned months (due to reduce_term shortening, it could become 0),
    // continue paying until balance is 0. When remainingMonthsPlanned hits 0, we keep it 1 for calculations.
    if (remainingMonthsPlanned <= 0) {
      remainingMonthsPlanned = 1;
      if (req.paymentType === 'ANNUITY' && reducePaymentTriggered) {
        annuityPayment = annuityPaymentCents(balance, rateM, remainingMonthsPlanned);
      }
      if (req.paymentType === 'DIFFERENTIATED' && reducePaymentTriggered) {
        diffPrincipalPart = Math.floor(balance / remainingMonthsPlanned);
      }
    }
  }

  if (schedule.length >= MAX_MONTHS_GUARD && balance > 0) {
    // Guard triggered; do not silently lie.
    throw new Error('Слишком большой срок расчёта (guard). Проверьте входные данные.');
  }

  // Calculate what interest would be WITHOUT early payments (for savings comparison)
  let interestWithoutEarly = 0;
  if (totalEarly > 0) {
    // Re-calculate with no early payments
    const reqNoEarly: CalcRequest = { ...req, earlyPayments: [] };
    try {
      const resultNoEarly = computeLoanSchedule(reqNoEarly);
      interestWithoutEarly = toCents(resultNoEarly.summary.totalInterest);
    } catch {
      // If calculation fails, just skip
      interestWithoutEarly = 0;
    }
  }

  const savedInterest = interestWithoutEarly > 0 ? interestWithoutEarly - totalInterest : 0;

  const summary = {
    totalPaid: fromCents(totalPaid),
    totalInterest: fromCents(totalInterest),
    totalEarlyPayments: fromCents(totalEarly),
    actualMonths: schedule.length,
    savedInterest: fromCents(savedInterest),
    interestWithoutEarly: fromCents(interestWithoutEarly)
  };

  return { summary, schedule };
}

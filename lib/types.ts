export type PaymentType = 'ANNUITY' | 'DIFFERENTIATED';

export type EarlyPaymentMode = 'REDUCE_TERM' | 'REDUCE_PAYMENT';

export type EarlyPaymentRepeat = 'ONCE' | 'MONTHLY' | 'QUARTERLY' | 'UNTIL_END';

export type EarlyPaymentWhenType = 'MONTH_INDEX' | 'MONTH';

export type EarlyPayment = {
  id: string;
  amount: number;

  /**
   * How user specifies the time of early payment.
   * - MONTH_INDEX: monthIndex is used.
   * - MONTH: monthISO (YYYY-MM) is used and converted to monthIndex on submit.
   */
  whenType?: EarlyPaymentWhenType;

  /** 1 = first payment month (required for API; for UI can be computed from monthISO) */
  monthIndex: number;

  /** Month in format YYYY-MM (used when whenType === 'MONTH') */
  monthISO?: string;

  mode: EarlyPaymentMode;
  repeat: EarlyPaymentRepeat;
};

export type CalcRequest = {
  principal: number;
  annualRate: number;
  termMonths: number;
  paymentType: PaymentType;
  /** ISO date YYYY-MM-DD. Used for labeling only. */
  startDate?: string;
  earlyPayments: EarlyPayment[];
};

export type ScheduleRow = {
  month: number;
  dateLabel?: string;

  paymentTotal: number;
  principal: number;
  interest: number;

  earlyPayment: number;

  balanceBefore: number;
  balanceAfter: number;
};

export type CalcSummary = {
  totalPaid: number;
  totalInterest: number;
  totalEarlyPayments: number;
  actualMonths: number;
  savedInterest?: number; // Экономия на процентах благодаря досрочным платежам
  interestWithoutEarly?: number; // Проценты без досрочных платежей (для сравнения)
};

export type CalcResponse = {
  summary: CalcSummary;
  schedule: ScheduleRow[];
};

export type PaymentType = 'ANNUITY' | 'DIFFERENTIATED';

export type EarlyPaymentMode = 'REDUCE_TERM' | 'REDUCE_PAYMENT';

export type EarlyPaymentRepeat = 'ONCE' | 'MONTHLY' | 'QUARTERLY' | 'UNTIL_END';

export type EarlyPayment = {
  id: string;
  amount: number;
  /** 1 = first payment month */
  monthIndex: number;
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
};

export type CalcResponse = {
  summary: CalcSummary;
  schedule: ScheduleRow[];
};

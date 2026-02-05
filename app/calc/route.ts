import { NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateSchedule } from '@/lib/calc';

const earlyPaymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  monthIndex: z.number().int().min(1),
  mode: z.enum(['REDUCE_TERM', 'REDUCE_PAYMENT']),
  repeat: z.enum(['ONCE', 'MONTHLY', 'QUARTERLY', 'UNTIL_END']).default('ONCE')
});

const reqSchema = z.object({
  principal: z.number().positive(),
  annualRate: z.number().min(0),
  termMonths: z.number().int().positive(),
  paymentType: z.enum(['ANNUITY', 'DIFFERENTIATED']),
  startDate: z.string().optional(),
  earlyPayments: z.array(earlyPaymentSchema)
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const req = reqSchema.parse(json);

    const data = calculateSchedule(req);
    return NextResponse.json(data);
  } catch (e: any) {
    const msg = e?.message ?? 'Bad Request';
    return new NextResponse(msg, { status: 400 });
  }
}

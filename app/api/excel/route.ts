import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateSchedule } from '@/lib/calc';
import { buildExcelReport } from '@/lib/excel';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reqSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: validated.error.errors },
        { status: 400 }
      );
    }

    const result = calculateSchedule(validated.data);
    const excelBytes = await buildExcelReport({
      request: validated.data,
      result
    });

    return new Response(Buffer.from(excelBytes), {
      status: 200,
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="kreditplan-otchet.xlsx"'
      }
    });
  } catch (err: any) {
    console.error('Excel generation error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

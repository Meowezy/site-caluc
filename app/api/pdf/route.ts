import { NextResponse } from 'next/server';
import { z } from 'zod';

import { calculateSchedule } from '@/lib/calc';
import { buildPdfReport } from '@/lib/pdf';

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
    const calcReq = reqSchema.parse(json);

    const result = calculateSchedule(calcReq);
    const pdfBytes = await buildPdfReport({ request: calcReq, result });

    // NextResponse body expects BodyInit. The most portable way here is Blob.
    // This avoids TS incompatibilities around ArrayBuffer | SharedArrayBuffer.
    const body = new Blob([pdfBytes], { type: 'application/pdf' });

    return new NextResponse(body, {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="credit-report.pdf"'
      }
    });
  } catch (e: any) {
    return new NextResponse(e?.message ?? 'Bad Request', { status: 400 });
  }
}

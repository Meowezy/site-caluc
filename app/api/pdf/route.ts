import { Buffer } from 'node:buffer';
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

    // Vercel/TS may type pdf-lib bytes as Uint8Array<ArrayBufferLike>, which doesn't match BodyInit.
    // Buffer is compatible with BodyInit in the Node.js runtime.
    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="kreditplan-otchet.pdf"'
      }
    });
  } catch (e: any) {
    return new Response(e?.message ?? 'Bad Request', { status: 400 });
  }
}

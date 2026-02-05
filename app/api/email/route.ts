import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

import { calculateSchedule } from '@/lib/calc';
import { buildPdfReport } from '@/lib/pdf';

const earlyPaymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  monthIndex: z.number().int().min(1),
  mode: z.enum(['REDUCE_TERM', 'REDUCE_PAYMENT']),
  repeat: z.enum(['ONCE', 'MONTHLY', 'QUARTERLY', 'UNTIL_END']).default('ONCE')
});

const calcReqSchema = z.object({
  principal: z.number().positive(),
  annualRate: z.number().min(0),
  termMonths: z.number().int().positive(),
  paymentType: z.enum(['ANNUITY', 'DIFFERENTIATED']),
  startDate: z.string().optional(),
  earlyPayments: z.array(earlyPaymentSchema)
});

const reqSchema = z.object({
  to: z.string().email(),
  calcRequest: calcReqSchema
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { to, calcRequest } = reqSchema.parse(json);

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (!host || !port || !user || !pass || !from) {
      return new NextResponse(
        'Email не настроен. Нужны переменные окружения SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.',
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    const result = calculateSchedule(calcRequest);
    const pdfBytes = await buildPdfReport({ request: calcRequest, result });

    await transporter.sendMail({
      from,
      to,
      subject: 'Отчёт: калькулятор кредита и ипотеки',
      text: 'Во вложении PDF-отчёт с графиком платежей.',
      attachments: [
        {
          filename: 'credit-report.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = e?.message ?? 'Bad Request';
    return new NextResponse(msg, { status: 400 });
  }
}

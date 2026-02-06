import { Buffer } from 'node:buffer';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

import { calculateSchedule } from '@/lib/calc';
import { buildPdfReport } from '@/lib/pdf';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

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
  // honeypot anti-spam field (must be empty)
  hp: z.string().optional(),
  calcRequest: calcReqSchema
});

async function sendViaSendGrid(params: {
  to: string;
  from: string;
  subject: string;
  text: string;
  pdfBytes: Uint8Array;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  if (!apiKey || !from) return { ok: false as const, reason: 'sendgrid_not_configured' as const };

  sgMail.setApiKey(apiKey);
  await sgMail.send({
    to: params.to,
    from,
    subject: params.subject,
    text: params.text,
    attachments: [
      {
        filename: 'credit-report.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
        content: Buffer.from(params.pdfBytes).toString('base64')
      }
    ]
  });

  return { ok: true as const };
}

async function sendViaSmtp(params: {
  to: string;
  subject: string;
  text: string;
  pdfBytes: Uint8Array;
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return { ok: false as const, reason: 'smtp_not_configured' as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    attachments: [
      {
        filename: 'credit-report.pdf',
        content: Buffer.from(params.pdfBytes),
        contentType: 'application/pdf'
      }
    ]
  });

  return { ok: true as const };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit({ key: `email:${ip}`, limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return new NextResponse('Слишком много запросов. Попробуйте позже.', {
        status: 429,
        headers: {
          'retry-after': String(rl.retryAfterSec)
        }
      });
    }
    const json = await request.json();
    const { to, hp, calcRequest } = reqSchema.parse(json);

    // basic log (no sensitive data)
    console.info('[email] request', { ip, hasHp: Boolean(hp), providerHint: process.env.SENDGRID_API_KEY ? 'sendgrid' : 'smtp' });

    // basic honeypot check
    if (hp && hp.trim().length > 0) {
      console.warn('[email] honeypot triggered', { ip });
      return NextResponse.json({ ok: true });
    }

    const result = calculateSchedule(calcRequest);
    const pdfBytes = await buildPdfReport({ request: calcRequest, result });

    const subject = 'Отчёт: калькулятор кредита и ипотеки';
    const text = 'Во вложении PDF-отчёт с графиком платежей.';

    // Prefer SendGrid; fallback to SMTP.
    const sendgridFrom = process.env.SENDGRID_FROM;
    if (process.env.SENDGRID_API_KEY && sendgridFrom) {
      await sendViaSendGrid({ to, from: sendgridFrom, subject, text, pdfBytes });
      return NextResponse.json({ ok: true, provider: 'sendgrid' });
    }

    const smtpRes = await sendViaSmtp({ to, subject, text, pdfBytes });
    if (!smtpRes.ok) {
      return new NextResponse(
        'Email не настроен. Укажите SENDGRID_API_KEY+SENDGRID_FROM или SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.',
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, provider: 'smtp' });
  } catch (e: any) {
    const msg = e?.message ?? 'Bad Request';
    return new NextResponse(msg, { status: 400 });
  }
}

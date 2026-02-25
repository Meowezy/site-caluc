import { NextRequest, NextResponse } from 'next/server';

import { requestSchema } from '@/lib/types';
import { computeLoanSchedule } from '@/lib/calc';
import { buildExcelReport } from '@/lib/excel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = requestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: validated.error.errors },
        { status: 400 }
      );
    }

    const result = computeLoanSchedule(validated.data);
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

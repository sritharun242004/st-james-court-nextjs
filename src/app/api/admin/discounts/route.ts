import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const today = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

    const startDate = request.nextUrl.searchParams.get('startDate') || today;
    const endDate = request.nextUrl.searchParams.get('endDate') || defaultEnd;

    const rows = await sql`
      SELECT id, date::text as date, room_discount, food_discount, bar_discount, active, created_at
      FROM discount_rule
      WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      ORDER BY date
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Discounts list error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { startDate, endDate, roomDiscount, foodDiscount, barDiscount, active } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    if (start > end) {
      return NextResponse.json({ error: 'startDate must be <= endDate' }, { status: 400 });
    }

    const dates: string[] = [];
    const d = new Date(start);
    while (d <= end) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${day}`);
      d.setUTCDate(d.getUTCDate() + 1);
    }

    let upserted = 0;
    for (const dateStr of dates) {
      await sql`
        INSERT INTO discount_rule (date, room_discount, food_discount, bar_discount, active)
        VALUES (${dateStr}::date, ${roomDiscount || 0}, ${foodDiscount || 0}, ${barDiscount || 0}, ${active !== false})
        ON CONFLICT (date)
        DO UPDATE SET
          room_discount = ${roomDiscount || 0},
          food_discount = ${foodDiscount || 0},
          bar_discount = ${barDiscount || 0},
          active = ${active !== false},
          updated_at = NOW()
      `;
      upserted++;
    }

    return NextResponse.json({ data: { message: `Upserted ${upserted} discount rules` } }, { status: 201 });
  } catch (error) {
    console.error('Discount create error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

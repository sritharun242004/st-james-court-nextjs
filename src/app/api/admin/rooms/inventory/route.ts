import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    if (!categoryId || !startDate || !endDate) {
      return NextResponse.json({ error: 'categoryId, startDate, and endDate are required' }, { status: 400 });
    }

    const rows = await sql`
      SELECT
        ri.id,
        ri.date::text as date,
        ri.base_available,
        ri.base_price,
        ri.extra_bed_price,
        COALESCE(bn.booked, 0)::int as booked
      FROM room_inventory ri
      LEFT JOIN (
        SELECT category_id, date, SUM(rooms)::int as booked
        FROM booking_night
        GROUP BY category_id, date
      ) bn ON bn.category_id = ri.category_id AND bn.date = ri.date
      WHERE ri.category_id = ${parseInt(categoryId)}
        AND ri.date >= ${startDate}::date
        AND ri.date <= ${endDate}::date
      ORDER BY ri.date
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Inventory GET error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { categoryId, startDate, endDate, baseAvailable, basePrice, extraBedPrice } = await request.json();

    if (!categoryId || !startDate || !endDate || baseAvailable == null || basePrice == null) {
      return NextResponse.json({ error: 'categoryId, startDate, endDate, baseAvailable, and basePrice are required' }, { status: 400 });
    }

    // Generate date range
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
        INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price)
        VALUES (${categoryId}, ${dateStr}::date, ${baseAvailable}, ${basePrice}, ${extraBedPrice || 0})
        ON CONFLICT (category_id, date)
        DO UPDATE SET
          base_available = ${baseAvailable},
          base_price = ${basePrice},
          extra_bed_price = ${extraBedPrice || 0},
          updated_at = NOW()
      `;
      upserted++;
    }

    return NextResponse.json({ data: { message: `Updated ${upserted} inventory rows` } });
  } catch (error) {
    console.error('Inventory PUT error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

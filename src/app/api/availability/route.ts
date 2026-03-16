import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const hasPrivilege = searchParams.get('hasPrivilege') === 'true';

    if (!category || !start || !end) {
      return NextResponse.json(
        { error: 'category, start, and end query params are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T00:00:00Z');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format. Use yyyy-MM-dd' }, { status: 400 });
    }
    if (startDate >= endDate) {
      return NextResponse.json({ error: 'start must be before end' }, { status: 400 });
    }

    const sql = getDb();

    // Verify category
    const categories = await sql`
      SELECT id, code, name, max_extra_beds_per_room FROM room_category WHERE code = ${category}
    `;
    if (categories.length === 0) {
      return NextResponse.json({ error: `Unknown category: ${category}` }, { status: 400 });
    }
    const cat = categories[0];

    // Last night is end - 1 day (check-out date is not a night)
    const lastNight = new Date(endDate);
    lastNight.setUTCDate(lastNight.getUTCDate() - 1);
    const lastNightStr = lastNight.toISOString().split('T')[0];

    // Fetch inventory
    const inventory = await sql`
      SELECT date::text as date, base_available, base_price, extra_bed_price
      FROM room_inventory
      WHERE category_id = ${cat.id}
        AND date >= ${start}::date
        AND date <= ${lastNightStr}::date
      ORDER BY date
    `;

    // Fetch booked rooms per night — only CONFIRMED or PAID bookings block availability
    const bookedRows = await sql`
      SELECT bn.date::text as date, COALESCE(SUM(bn.rooms), 0) as booked
      FROM booking_night bn
      JOIN booking b ON b.id = bn.booking_id
      WHERE bn.category_id = ${cat.id}
        AND bn.date >= ${start}::date
        AND bn.date <= ${lastNightStr}::date
        AND b.payment_status IN ('CONFIRMED', 'PAID')
      GROUP BY bn.date
    `;
    const bookedByDate = new Map<string, number>();
    for (const row of bookedRows) {
      bookedByDate.set(row.date, parseInt(row.booked));
    }

    // Fetch discount rules if privilege
    const discountByDate = new Map<string, number>();
    if (hasPrivilege) {
      const discounts = await sql`
        SELECT date::text as date, room_discount
        FROM discount_rule
        WHERE active = true
          AND date >= ${start}::date
          AND date <= ${lastNightStr}::date
      `;
      for (const row of discounts) {
        discountByDate.set(row.date, row.room_discount);
      }
    }

    const days = inventory.map(inv => {
      const booked = bookedByDate.get(inv.date) || 0;
      const available = Math.max(0, inv.base_available - booked);
      const basePrice = parseFloat(inv.base_price);

      let discountPercent: number | null = null;
      let memberPrice: number | null = null;

      if (hasPrivilege) {
        const pct = discountByDate.get(inv.date);
        if (pct && pct > 0) {
          discountPercent = pct;
          memberPrice = Math.round((basePrice * (100 - pct)) / 100 * 100) / 100;
        }
      }

      return {
        categoryCode: cat.code,
        date: inv.date,
        available,
        basePrice,
        extraBedPrice: parseFloat(inv.extra_bed_price),
        maxExtraBeds: cat.max_extra_beds_per_room,
        discountPercent,
        memberPrice,
      };
    });

    return NextResponse.json({
      category: cat.code,
      start,
      end,
      days,
    });
  } catch (error) {
    console.error('Availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

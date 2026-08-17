import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const summary = request.nextUrl.searchParams.get('summary');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    // Summary mode: one row per room type with worst-case booked/blocked/available
    // across the selected date range, for an at-a-glance capacity check.
    if (summary === '1') {
      const summaryRows = await sql`
        SELECT
          rc.id AS category_id, rc.code, rc.name,
          COALESCE(MAX(ri.base_available), 0)::int AS total,
          COALESCE(MAX(COALESCE(bn.booked, 0)), 0)::int AS booked,
          COALESCE(MAX(ri.blocked), 0)::int AS blocked,
          COALESCE(MIN(ri.base_available - ri.blocked - COALESCE(bn.booked, 0)), 0)::int AS available,
          COUNT(ri.id)::int AS days
        FROM room_category rc
        LEFT JOIN room_inventory ri
          ON ri.category_id = rc.id AND ri.date >= ${startDate}::date AND ri.date <= ${endDate}::date
        LEFT JOIN (
          SELECT bn.category_id, bn.date, SUM(bn.rooms)::int AS booked
          FROM booking_night bn
          JOIN booking b ON b.id = bn.booking_id
          WHERE (b.payment_status IN ('CONFIRMED', 'PAID') OR b.checked_in_at IS NOT NULL)
          GROUP BY bn.category_id, bn.date
        ) bn ON bn.category_id = ri.category_id AND bn.date = ri.date
        GROUP BY rc.id, rc.code, rc.name
        ORDER BY rc.id
      `;
      return NextResponse.json({ data: summaryRows });
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
    }

    const rows = await sql`
      SELECT
        ri.id,
        ri.date::text as date,
        ri.base_available,
        ri.blocked,
        ri.base_price,
        ri.extra_bed_price,
        COALESCE(bn.booked, 0)::int as booked
      FROM room_inventory ri
      LEFT JOIN (
        SELECT bn.category_id, bn.date, SUM(bn.rooms)::int as booked
        FROM booking_night bn
        JOIN booking b ON b.id = bn.booking_id
        WHERE (b.payment_status IN ('CONFIRMED', 'PAID') OR b.checked_in_at IS NOT NULL)
        GROUP BY bn.category_id, bn.date
      ) bn ON bn.category_id = ri.category_id AND bn.date = ri.date
      WHERE ri.category_id = ${parseInt(categoryId)}
        AND ri.date >= ${startDate}::date
        AND ri.date <= ${endDate}::date
      ORDER BY ri.date
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Inventory GET error:', error);
    return adminErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { categoryId, startDate, endDate, baseAvailable, basePrice, extraBedPrice, blocked, mode } = await request.json();

    if (!categoryId || !startDate || !endDate) {
      return NextResponse.json({ error: 'categoryId, startDate, and endDate are required' }, { status: 400 });
    }

    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    if (start > end) {
      return NextResponse.json({ error: 'startDate must be <= endDate' }, { status: 400 });
    }

    // --- Block / unblock mode: only adjusts the internal hold, leaving price
    //     and base availability untouched. Used for offline/bulk holds. ---
    if (mode === 'block' || mode === 'unblock') {
      const count = parseInt(blocked);
      if (isNaN(count) || count < 0) {
        return NextResponse.json({ error: 'A valid number of rooms to block is required' }, { status: 400 });
      }
      if (mode === 'block') {
        // Hold `count` rooms, never exceeding the base availability for the date.
        await sql`
          UPDATE room_inventory
          SET blocked = LEAST(base_available, ${count}), updated_at = NOW()
          WHERE category_id = ${categoryId}
            AND date >= ${startDate}::date AND date <= ${endDate}::date
        `;
        return NextResponse.json({ data: { message: `Blocked ${count} room(s) for the selected dates` } });
      } else {
        await sql`
          UPDATE room_inventory
          SET blocked = 0, updated_at = NOW()
          WHERE category_id = ${categoryId}
            AND date >= ${startDate}::date AND date <= ${endDate}::date
        `;
        return NextResponse.json({ data: { message: 'Internal holds released for the selected dates' } });
      }
    }

    // --- Standard bulk inventory update (price + availability). ---
    if (baseAvailable == null || basePrice == null) {
      return NextResponse.json({ error: 'baseAvailable and basePrice are required' }, { status: 400 });
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

    // Optional absolute blocked count to set alongside the bulk update.
    const blockedVal = blocked != null && blocked !== '' && !isNaN(parseInt(blocked)) ? parseInt(blocked) : null;

    let upserted = 0;
    for (const dateStr of dates) {
      if (blockedVal != null) {
        // Caller supplied an explicit blocked count — set it.
        await sql`
          INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price, blocked)
          VALUES (${categoryId}, ${dateStr}::date, ${baseAvailable}, ${basePrice}, ${extraBedPrice || 0}, ${blockedVal})
          ON CONFLICT (category_id, date)
          DO UPDATE SET
            base_available = ${baseAvailable},
            base_price = ${basePrice},
            extra_bed_price = ${extraBedPrice || 0},
            blocked = ${blockedVal},
            updated_at = NOW()
        `;
      } else {
        // Preserve any existing internal hold on update.
        await sql`
          INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price, blocked)
          VALUES (${categoryId}, ${dateStr}::date, ${baseAvailable}, ${basePrice}, ${extraBedPrice || 0}, 0)
          ON CONFLICT (category_id, date)
          DO UPDATE SET
            base_available = ${baseAvailable},
            base_price = ${basePrice},
            extra_bed_price = ${extraBedPrice || 0},
            updated_at = NOW()
        `;
      }
      upserted++;
    }

    return NextResponse.json({ data: { message: `Updated ${upserted} inventory rows` } });
  } catch (error) {
    console.error('Inventory PUT error:', error);
    return adminErrorResponse(error);
  }
}

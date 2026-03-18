import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const [rows, nights] = await Promise.all([
      sql`
        SELECT b.id, b.user_id, u.full_name as guest_name, u.phone, u.email as guest_email,
               rc.name as category_name, rc.code as category_code,
               b.check_in::text as check_in, b.check_out::text as check_out, b.rooms, b.adults, b.children, b.extra_beds,
               b.base_amount, b.discount_amount, b.final_amount,
               b.payment_status, b.payment_ref, b.special_requests, b.created_at::text as created_at,
               pm.card_number as privilege_card
        FROM booking b
        JOIN user_account u ON b.user_id = u.id
        JOIN room_category rc ON b.category_id = rc.id
        LEFT JOIN privilege_member pm ON b.privilege_member_id = pm.id
        WHERE b.id = ${id}
      `,
      sql`
        SELECT bn.date::text as date, bn.rooms, ri.base_price
        FROM booking_night bn
        LEFT JOIN room_inventory ri ON ri.category_id = bn.category_id AND ri.date = bn.date
        WHERE bn.booking_id = ${id}
        ORDER BY bn.date
      `,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { ...rows[0], nights } });
  } catch (error) {
    console.error('Booking detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const body = await request.json();
    const { payment_status, payment_ref, check_in, check_out, rooms, adults, children, extra_beds, special_requests, base_amount, discount_amount, final_amount } = body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED'];
    if (payment_status && !validStatuses.includes(payment_status)) {
      return NextResponse.json({ error: `payment_status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    if (check_in && check_out && check_in >= check_out) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    const specialReqValue = 'special_requests' in body ? (special_requests || null) : undefined;
    const hasSpecialReq = 'special_requests' in body;

    let rows;
    if (hasSpecialReq) {
      rows = await sql`
        UPDATE booking
        SET payment_status = COALESCE(${payment_status || null}, payment_status),
            payment_ref = COALESCE(${payment_ref || null}, payment_ref),
            check_in = COALESCE(${check_in || null}::date, check_in),
            check_out = COALESCE(${check_out || null}::date, check_out),
            rooms = COALESCE(${rooms ?? null}::int, rooms),
            adults = COALESCE(${adults ?? null}::int, adults),
            children = COALESCE(${children ?? null}::int, children),
            extra_beds = COALESCE(${extra_beds ?? null}::int, extra_beds),
            special_requests = ${specialReqValue},
            base_amount = COALESCE(${base_amount ?? null}::numeric, base_amount),
            discount_amount = COALESCE(${discount_amount ?? null}::numeric, discount_amount),
            final_amount = COALESCE(${final_amount ?? null}::numeric, final_amount),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, payment_status, payment_ref, check_in::text as check_in, check_out::text as check_out, rooms, adults, children, extra_beds, special_requests, base_amount, discount_amount, final_amount
      `;
    } else {
      rows = await sql`
        UPDATE booking
        SET payment_status = COALESCE(${payment_status || null}, payment_status),
            payment_ref = COALESCE(${payment_ref || null}, payment_ref),
            check_in = COALESCE(${check_in || null}::date, check_in),
            check_out = COALESCE(${check_out || null}::date, check_out),
            rooms = COALESCE(${rooms ?? null}::int, rooms),
            adults = COALESCE(${adults ?? null}::int, adults),
            children = COALESCE(${children ?? null}::int, children),
            extra_beds = COALESCE(${extra_beds ?? null}::int, extra_beds),
            base_amount = COALESCE(${base_amount ?? null}::numeric, base_amount),
            discount_amount = COALESCE(${discount_amount ?? null}::numeric, discount_amount),
            final_amount = COALESCE(${final_amount ?? null}::numeric, final_amount),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, payment_status, payment_ref, check_in::text as check_in, check_out::text as check_out, rooms, adults, children, extra_beds, special_requests, base_amount, discount_amount, final_amount
      `;
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // If dates changed, update booking_night records
    if (check_in || check_out) {
      const booking = rows[0];
      const newCheckIn = booking.check_in;
      const newCheckOut = booking.check_out;
      const newRooms = booking.rooms;

      // Get category_id from current booking
      const catRows = await sql`SELECT category_id FROM booking WHERE id = ${id}`;
      const categoryId = catRows[0].category_id;

      // Delete old nights and insert new ones
      await sql`DELETE FROM booking_night WHERE booking_id = ${id}`;

      // Generate date array between check_in and check_out
      await sql`
        INSERT INTO booking_night (booking_id, category_id, date, rooms)
        SELECT ${id}, ${categoryId}, d::date, ${newRooms}
        FROM generate_series(${newCheckIn}::date, ${newCheckOut}::date - INTERVAL '1 day', '1 day') d
      `;
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Booking update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

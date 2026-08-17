import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { ensureBookingSchema } from '@/lib/bookingSchema';
import { ensureInventoryWindow } from '@/lib/inventory';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED'];

// POST /api/admin/walk-in — create a booking at the desk for a walk-in guest.
export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureBookingSchema(sql);
    await ensureInventoryWindow(sql);

    const body = await request.json();
    const {
      fullName, phone, email, categoryCode, checkIn, checkOut,
      rooms = 1, adults = 1, children = 0, extraBeds = 0,
      roomNumbers, finalAmount, paymentStatus = 'PAID',
      specialRequests, checkInNow = true,
    } = body;

    if (!fullName || !phone || !categoryCode || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'fullName, phone, categoryCode, checkIn and checkOut are required' },
        { status: 400 }
      );
    }
    if (checkIn >= checkOut) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(paymentStatus)) {
      return NextResponse.json({ error: `paymentStatus must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }
    const amount = Number(finalAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json({ error: 'finalAmount must be a non-negative number' }, { status: 400 });
    }

    // Resolve category
    const cats = await sql`SELECT id FROM room_category WHERE code = ${categoryCode}`;
    if (cats.length === 0) {
      return NextResponse.json({ error: `Unknown room category: ${categoryCode}` }, { status: 400 });
    }
    const categoryId = cats[0].id;

    // Find-or-create the guest by email or phone (reuse an existing account).
    const users = await sql`
      SELECT id, email FROM user_account WHERE phone = ${phone} OR email = ${email || null}
    `;
    const existing =
      (email ? users.find((u) => u.email === email) : undefined) ||
      users.find(() => true);
    let userId: number;
    if (existing) {
      userId = existing.id;
      if (email && !existing.email && !users.some((u) => u.id !== existing.id && u.email === email)) {
        await sql`UPDATE user_account SET email = ${email} WHERE id = ${userId}`;
      }
    } else {
      const created = await sql`
        INSERT INTO user_account (full_name, phone, email, is_active)
        VALUES (${fullName}, ${phone}, ${email || null}, true)
        RETURNING id
      `;
      userId = created[0].id;
    }

    const roomsStr = typeof roomNumbers === 'string' ? (roomNumbers.trim() || null) : null;
    const checkedInAt = checkInNow ? new Date().toISOString() : null;

    // Create the booking. base_amount = final for a manually-priced walk-in.
    const inserted = await sql`
      INSERT INTO booking (
        user_id, category_id, check_in, check_out, rooms, adults, children, extra_beds,
        special_requests, base_amount, discount_amount, final_amount, payment_status,
        room_numbers, is_walk_in, checked_in_at
      ) VALUES (
        ${userId}, ${categoryId}, ${checkIn}::date, ${checkOut}::date, ${rooms}, ${adults}, ${children}, ${extraBeds},
        ${specialRequests || null}, ${amount}, 0, ${amount}, ${paymentStatus},
        ${roomsStr}, true, ${checkedInAt}::timestamptz
      )
      RETURNING id
    `;
    const bookingId = inserted[0].id;

    // Record per-night rows so inventory reflects the walk-in.
    await sql`
      INSERT INTO booking_night (booking_id, category_id, date, rooms)
      SELECT ${bookingId}, ${categoryId}, d::date, ${rooms}
      FROM generate_series(${checkIn}::date, ${checkOut}::date - INTERVAL '1 day', INTERVAL '1 day') d
      ON CONFLICT (booking_id, date) DO NOTHING
    `;

    return NextResponse.json({ data: { id: bookingId } }, { status: 201 });
  } catch (error) {
    console.error('Walk-in create error:', error);
    return adminErrorResponse(error);
  }
}

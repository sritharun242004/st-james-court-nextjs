import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { ensureBookingSchema } from '@/lib/bookingSchema';

// GET /api/admin/checkins?date=YYYY-MM-DD
// Returns today's arrivals (due to check in) and currently in-house guests,
// flagging which of the in-house guests are departing on the given date.
export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureBookingSchema(sql);

    const date = request.nextUrl.searchParams.get('date');
    if (!date) {
      return NextResponse.json({ error: 'date is required (YYYY-MM-DD)' }, { status: 400 });
    }

    const [arrivals, inHouse] = await Promise.all([
      // Arriving on this date and not yet checked in (exclude cancelled/refunded).
      sql`
        SELECT b.id, u.full_name AS guest_name, u.phone, u.email AS guest_email,
               rc.name AS category_name, rc.code AS category_code, rc.bed_type,
               b.check_in::text AS check_in, b.check_out::text AS check_out,
               b.rooms, b.adults, b.children, b.extra_beds, b.final_amount, b.payment_status,
               b.room_numbers, b.checked_in_at::text AS checked_in_at,
               b.checked_out_at::text AS checked_out_at, b.is_walk_in, b.special_requests
        FROM booking b
        JOIN user_account u ON u.id = b.user_id
        JOIN room_category rc ON rc.id = b.category_id
        WHERE b.check_in = ${date}::date
          AND b.checked_in_at IS NULL
          AND b.payment_status NOT IN ('CANCELLED', 'REFUNDED')
        ORDER BY b.created_at DESC
      `,
      // Currently in-house: checked in, not yet checked out.
      sql`
        SELECT b.id, u.full_name AS guest_name, u.phone, u.email AS guest_email,
               rc.name AS category_name, rc.code AS category_code, rc.bed_type,
               b.check_in::text AS check_in, b.check_out::text AS check_out,
               b.rooms, b.adults, b.children, b.extra_beds, b.final_amount, b.payment_status,
               b.room_numbers, b.checked_in_at::text AS checked_in_at,
               b.checked_out_at::text AS checked_out_at, b.is_walk_in, b.special_requests,
               (b.check_out = ${date}::date) AS departing_today
        FROM booking b
        JOIN user_account u ON u.id = b.user_id
        JOIN room_category rc ON rc.id = b.category_id
        WHERE b.checked_in_at IS NOT NULL
          AND b.checked_out_at IS NULL
        ORDER BY b.check_out
      `,
    ]);

    return NextResponse.json({ data: { arrivals, inHouse } });
  } catch (error) {
    console.error('Check-ins GET error:', error);
    return adminErrorResponse(error);
  }
}

// POST /api/admin/checkins
// Body: { bookingId, action: 'check_in' | 'check_out' | 'assign_rooms' | 'undo_check_in', roomNumbers? }
export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureBookingSchema(sql);

    const { bookingId, action, roomNumbers } = await request.json();
    if (!bookingId || !action) {
      return NextResponse.json({ error: 'bookingId and action are required' }, { status: 400 });
    }

    const rooms = typeof roomNumbers === 'string' ? (roomNumbers.trim() || null) : null;

    let rows;
    switch (action) {
      case 'check_in':
        rows = await sql`
          UPDATE booking
          SET checked_in_at = COALESCE(checked_in_at, NOW()),
              checked_out_at = NULL,
              room_numbers = COALESCE(${rooms}, room_numbers),
              updated_at = NOW()
          WHERE id = ${bookingId}
          RETURNING id
        `;
        break;
      case 'check_out':
        rows = await sql`
          UPDATE booking
          SET checked_out_at = NOW(), updated_at = NOW()
          WHERE id = ${bookingId} AND checked_in_at IS NOT NULL
          RETURNING id
        `;
        break;
      case 'undo_check_in':
        rows = await sql`
          UPDATE booking
          SET checked_in_at = NULL, checked_out_at = NULL, updated_at = NOW()
          WHERE id = ${bookingId}
          RETURNING id
        `;
        break;
      case 'assign_rooms':
        rows = await sql`
          UPDATE booking
          SET room_numbers = ${rooms}, updated_at = NOW()
          WHERE id = ${bookingId}
          RETURNING id
        `;
        break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or not eligible for this action' }, { status: 404 });
    }
    return NextResponse.json({ data: { id: rows[0].id } });
  } catch (error) {
    console.error('Check-ins POST error:', error);
    return adminErrorResponse(error);
  }
}

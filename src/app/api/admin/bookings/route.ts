import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const search = request.nextUrl.searchParams.get('search') || '';
    const status = request.nextUrl.searchParams.get('status') || '';
    const fromDate = request.nextUrl.searchParams.get('from') || '';
    const toDate = request.nextUrl.searchParams.get('to') || '';

    // A single null-safe query handles every filter combination. Empty inputs
    // are coerced to NULL so we never cast an empty string to ::date (which
    // Postgres rejects at plan time — the old code 500'd whenever a status or
    // date filter was applied with the date fields left blank).
    const searchPattern = search ? `%${search}%` : null;

    const rows = await sql`
      SELECT b.id, u.full_name as guest_name, u.phone, rc.name as category_name, rc.code as category_code,
             b.check_in::text as check_in, b.check_out::text as check_out, b.rooms, b.adults, b.children, b.extra_beds,
             b.base_amount, b.discount_amount, b.final_amount,
             b.payment_status, b.payment_ref, b.special_requests, b.created_at::text as created_at,
             pm.card_number as privilege_card
      FROM booking b
      JOIN user_account u ON b.user_id = u.id
      JOIN room_category rc ON b.category_id = rc.id
      LEFT JOIN privilege_member pm ON b.privilege_member_id = pm.id
      WHERE
        (${searchPattern}::text IS NULL
          OR u.full_name ILIKE ${searchPattern}
          OR u.phone ILIKE ${searchPattern}
          OR CAST(b.id AS TEXT) = ${search || null})
        AND (${status || null}::text IS NULL OR b.payment_status = ${status || null})
        AND (${fromDate || null}::date IS NULL OR b.check_in >= ${fromDate || null}::date)
        AND (${toDate || null}::date IS NULL OR b.check_out <= ${toDate || null}::date)
      ORDER BY b.created_at DESC
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Bookings list error:', error);
    return adminErrorResponse(error);
  }
}

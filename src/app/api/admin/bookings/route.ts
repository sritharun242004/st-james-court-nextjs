import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const search = request.nextUrl.searchParams.get('search') || '';
    const status = request.nextUrl.searchParams.get('status') || '';
    const fromDate = request.nextUrl.searchParams.get('from') || '';
    const toDate = request.nextUrl.searchParams.get('to') || '';

    // Build conditions
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (search) {
      const pattern = `%${search}%`;
      conditions.push(`(u.full_name ILIKE $${values.length + 1} OR u.phone ILIKE $${values.length + 2} OR CAST(b.id AS TEXT) = $${values.length + 3})`);
      values.push(pattern, pattern, search);
    }
    if (status) {
      conditions.push(`b.payment_status = $${values.length + 1}`);
      values.push(status);
    }
    if (fromDate) {
      conditions.push(`b.check_in >= $${values.length + 1}::date`);
      values.push(fromDate);
    }
    if (toDate) {
      conditions.push(`b.check_out <= $${values.length + 1}::date`);
      values.push(toDate);
    }

    // Use tagged template for Neon - build dynamic query with conditions
    let rows;
    if (!search && !status && !fromDate && !toDate) {
      rows = await sql`
        SELECT b.id, u.full_name as guest_name, u.phone, rc.name as category_name, rc.code as category_code,
               b.check_in::text as check_in, b.check_out::text as check_out, b.rooms, b.adults, b.children, b.extra_beds,
               b.base_amount, b.discount_amount, b.final_amount,
               b.payment_status, b.payment_ref, b.special_requests, b.created_at::text as created_at,
               pm.card_number as privilege_card
        FROM booking b
        JOIN user_account u ON b.user_id = u.id
        JOIN room_category rc ON b.category_id = rc.id
        LEFT JOIN privilege_member pm ON b.privilege_member_id = pm.id
        ORDER BY b.created_at DESC
      `;
    } else if (search && !status && !fromDate && !toDate) {
      const pattern = `%${search}%`;
      rows = await sql`
        SELECT b.id, u.full_name as guest_name, u.phone, rc.name as category_name, rc.code as category_code,
               b.check_in::text as check_in, b.check_out::text as check_out, b.rooms, b.adults, b.children, b.extra_beds,
               b.base_amount, b.discount_amount, b.final_amount,
               b.payment_status, b.payment_ref, b.special_requests, b.created_at::text as created_at,
               pm.card_number as privilege_card
        FROM booking b
        JOIN user_account u ON b.user_id = u.id
        JOIN room_category rc ON b.category_id = rc.id
        LEFT JOIN privilege_member pm ON b.privilege_member_id = pm.id
        WHERE u.full_name ILIKE ${pattern} OR u.phone ILIKE ${pattern} OR CAST(b.id AS TEXT) = ${search}
        ORDER BY b.created_at DESC
      `;
    } else {
      rows = await sql`
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
          (${search} = '' OR u.full_name ILIKE ${'%' + search + '%'} OR u.phone ILIKE ${'%' + search + '%'} OR CAST(b.id AS TEXT) = ${search})
          AND (${status} = '' OR b.payment_status = ${status})
          AND (${fromDate} = '' OR b.check_in >= ${fromDate}::date)
          AND (${toDate} = '' OR b.check_out <= ${toDate}::date)
        ORDER BY b.created_at DESC
      `;
    }

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Bookings list error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

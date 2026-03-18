import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getDb();

    const bookings = await sql`
      SELECT
        b.id,
        b.check_in::text as check_in,
        b.check_out::text as check_out,
        b.rooms,
        b.adults,
        b.children,
        b.extra_beds,
        b.special_requests,
        b.base_amount,
        b.discount_amount,
        b.final_amount,
        b.payment_status,
        b.payment_ref,
        b.created_at,
        rc.code as category_code,
        rc.name as category_name
      FROM booking b
      JOIN room_category rc ON rc.id = b.category_id
      WHERE b.user_id = ${auth.sub}
      ORDER BY b.created_at DESC
    `;

    return NextResponse.json({
      bookings: bookings.map(b => ({
        id: b.id,
        checkIn: b.check_in,
        checkOut: b.check_out,
        rooms: b.rooms,
        adults: b.adults,
        children: b.children,
        extraBeds: b.extra_beds || 0,
        specialRequests: b.special_requests,
        baseAmount: parseFloat(b.base_amount),
        discountAmount: parseFloat(b.discount_amount),
        finalAmount: parseFloat(b.final_amount),
        paymentStatus: b.payment_status,
        paymentRef: b.payment_ref,
        createdAt: b.created_at,
        categoryCode: b.category_code,
        categoryName: b.category_name,
      })),
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

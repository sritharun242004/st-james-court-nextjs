import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();

    const rows = await sql`
      SELECT rc.id, rc.code, rc.name, rc.capacity, rc.max_occupancy_per_room,
             ri.base_price as today_price
      FROM room_category rc
      LEFT JOIN room_inventory ri ON ri.category_id = rc.id AND ri.date = CURRENT_DATE
      ORDER BY rc.id
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Rooms API error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

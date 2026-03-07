import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const rows = await sql`
      SELECT id, code, name, capacity, max_occupancy_per_room, max_extra_beds_per_room
      FROM room_category
      ORDER BY id
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Rooms list error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

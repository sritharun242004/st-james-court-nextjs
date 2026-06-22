import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureRoomCategorySchema } from '@/lib/roomSchema';

// Full content for a single room, used by the public detail page.
// Matches on slug first, then code (so old/bookmarked URLs keep working).
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    const key = decodeURIComponent(params.slug);

    const rows = await sql`
      SELECT rc.id, rc.code, rc.name, rc.slug, rc.category_group,
             rc.capacity, rc.max_occupancy_per_room, rc.max_extra_beds_per_room,
             rc.size_label, rc.bed_type,
             rc.short_description, rc.long_description,
             rc.features, rc.amenities, rc.highlights, rc.images,
             COALESCE(ri.base_price, rc.base_price)::float as today_price
      FROM room_category rc
      LEFT JOIN room_inventory ri ON ri.category_id = rc.id AND ri.date = CURRENT_DATE
      WHERE rc.active IS DISTINCT FROM false
        AND (rc.slug = ${key} OR rc.code = ${key.toUpperCase()})
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Room detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

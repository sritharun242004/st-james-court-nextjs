import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';
import { ensureRoomCategorySchema } from '@/lib/roomSchema';
import { parseRoomBody } from '@/lib/roomContent';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid room type id' }, { status: 400 });
    }

    const body = await request.json();
    const c = parseRoomBody(body);

    if (!c.code || !c.name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 });
    }
    if (c.basePrice == null || c.basePrice < 0) {
      return NextResponse.json({ error: 'A valid base price is required' }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM room_category WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
    }

    // Code must stay unique across other categories
    const clash = await sql`SELECT id FROM room_category WHERE code = ${c.code} AND id <> ${id}`;
    if (clash.length > 0) {
      return NextResponse.json({ error: `Another room type already uses code "${c.code}"` }, { status: 409 });
    }
    // Slug must stay unique across other categories
    const slugClash = await sql`SELECT id FROM room_category WHERE slug = ${c.slug} AND id <> ${id}`;
    if (slugClash.length > 0) {
      return NextResponse.json({ error: `Another room type already uses the URL slug "${c.slug}"` }, { status: 409 });
    }

    await sql`
      UPDATE room_category
      SET code = ${c.code},
          name = ${c.name},
          capacity = ${c.capacity},
          max_occupancy_per_room = ${c.maxOccupancy},
          max_extra_beds_per_room = ${c.maxExtraBeds},
          base_price = ${c.basePrice},
          slug = ${c.slug},
          category_group = ${c.categoryGroup},
          size_label = ${c.sizeLabel},
          bed_type = ${c.bedType},
          short_description = ${c.shortDescription},
          long_description = ${c.longDescription},
          features = ${JSON.stringify(c.features)}::jsonb,
          amenities = ${JSON.stringify(c.amenities)}::jsonb,
          highlights = ${JSON.stringify(c.highlights)}::jsonb,
          images = ${JSON.stringify(c.images)}::jsonb,
          sort_order = ${c.sortOrder},
          active = ${c.active},
          updated_at = NOW()
      WHERE id = ${id}
    `;

    // Adopt any freshly uploaded images that weren't yet linked to a category.
    const imageIds = c.images
      .map((u) => {
        const m = u.match(/\/api\/images\/(\d+)/);
        return m ? parseInt(m[1]) : null;
      })
      .filter((v): v is number => v != null);
    if (imageIds.length > 0) {
      await sql`UPDATE room_image SET category_id = ${id} WHERE id = ANY(${imageIds}) AND category_id IS NULL`;
    }

    // Propagate the new price to all current & future inventory so the booking
    // page (which prices from inventory) reflects the change live.
    await sql`
      UPDATE room_inventory
      SET base_price = ${c.basePrice}, updated_at = NOW()
      WHERE category_id = ${id} AND date >= CURRENT_DATE
    `;

    return NextResponse.json({ data: { message: `Room type "${c.name}" updated` } });
  } catch (error) {
    console.error('Room update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid room type id' }, { status: 400 });
    }

    // Block deletion when bookings reference this room type, to keep history intact.
    const booked = await sql`SELECT id FROM booking WHERE category_id = ${id} LIMIT 1`;
    if (booked.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: this room type has existing bookings' },
        { status: 409 }
      );
    }

    await sql`DELETE FROM room_inventory WHERE category_id = ${id}`;
    await sql`DELETE FROM room_category WHERE id = ${id}`;

    return NextResponse.json({ data: { message: 'Room type deleted' } });
  } catch (error) {
    console.error('Room delete error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

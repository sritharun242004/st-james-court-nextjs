import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';
import { ensureRoomCategorySchema } from '@/lib/roomSchema';
import { parseRoomBody } from '@/lib/roomContent';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    // base_price comes from the category default, falling back to today's inventory price.
    const rows = await sql`
      SELECT
        rc.id, rc.code, rc.name, rc.capacity,
        rc.max_occupancy_per_room, rc.max_extra_beds_per_room,
        COALESCE(rc.base_price, ri.base_price)::float AS base_price,
        rc.slug, rc.category_group, rc.size_label, rc.bed_type,
        rc.short_description, rc.long_description,
        rc.features, rc.amenities, rc.highlights, rc.images,
        rc.sort_order, rc.active
      FROM room_category rc
      LEFT JOIN room_inventory ri
        ON ri.category_id = rc.id AND ri.date = CURRENT_DATE
      ORDER BY rc.sort_order NULLS LAST, rc.id
    `;

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Rooms list error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    const body = await request.json();
    const c = parseRoomBody(body);
    const baseAvailable = body.baseAvailable != null && body.baseAvailable !== '' ? parseInt(body.baseAvailable) : 10;
    const extraBedPrice = body.extraBedPrice != null && body.extraBedPrice !== '' ? parseFloat(body.extraBedPrice) : 1500;

    if (!c.code || !c.name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 });
    }
    if (c.basePrice == null || c.basePrice < 0) {
      return NextResponse.json({ error: 'A valid base price is required' }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM room_category WHERE code = ${c.code}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: `A room type with code "${c.code}" already exists` }, { status: 409 });
    }
    // Slug must be unique across categories.
    const slugClash = await sql`SELECT id FROM room_category WHERE slug = ${c.slug}`;
    if (slugClash.length > 0) {
      return NextResponse.json({ error: `The URL slug "${c.slug}" is already in use. Choose another.` }, { status: 409 });
    }

    const inserted = await sql`
      INSERT INTO room_category (
        code, name, capacity, max_occupancy_per_room, max_extra_beds_per_room, base_price,
        slug, category_group, size_label, bed_type, short_description, long_description,
        features, amenities, highlights, images, sort_order, active
      )
      VALUES (
        ${c.code}, ${c.name}, ${c.capacity}, ${c.maxOccupancy}, ${c.maxExtraBeds}, ${c.basePrice},
        ${c.slug}, ${c.categoryGroup}, ${c.sizeLabel}, ${c.bedType}, ${c.shortDescription}, ${c.longDescription},
        ${JSON.stringify(c.features)}::jsonb, ${JSON.stringify(c.amenities)}::jsonb,
        ${JSON.stringify(c.highlights)}::jsonb, ${JSON.stringify(c.images)}::jsonb,
        ${c.sortOrder}, ${c.active}
      )
      RETURNING id
    `;
    const categoryId = inserted[0].id;

    // Attach any images uploaded before the category existed to this category.
    if (c.images.length > 0) {
      const ids = c.images
        .map((u) => {
          const m = u.match(/\/api\/images\/(\d+)/);
          return m ? parseInt(m[1]) : null;
        })
        .filter((v): v is number => v != null);
      if (ids.length > 0) {
        await sql`UPDATE room_image SET category_id = ${categoryId} WHERE id = ANY(${ids}) AND category_id IS NULL`;
      }
    }

    // Seed one year of inventory so the new room type is immediately bookable
    // and its price shows up on the public booking page.
    await sql`
      INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price)
      SELECT ${categoryId}, d::date, ${baseAvailable}, ${c.basePrice}, ${extraBedPrice}
      FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', '1 day') d
      ON CONFLICT (category_id, date) DO NOTHING
    `;

    return NextResponse.json({ data: { id: categoryId, message: `Room type "${c.name}" created` } });
  } catch (error) {
    console.error('Room create error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

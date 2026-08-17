import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';
import { ensureRoomCategorySchema, backfillKnownRoomContent } from '@/lib/roomSchema';

// ---------------------------------------------------------------------------
// POST /api/admin/seed-inventory
// Updates all room categories to match actual hotel data and re-seeds
// room_inventory for the next 90 days at flat confirmed rack rates.
//
//   DELUXE 4500 · SUPER_DELUXE 5500 · SUITE 4500 · FAMILY 9000 · CLUB 1500
//   Extra bed 1500/night (CLUB has no extra bed).
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    // -----------------------------------------------------------------------
    // 1. Upsert all 5 room categories with correct counts, occupancy & the
    //    default (weekday) rack rate shown on the booking page.
    // -----------------------------------------------------------------------
    await sql`
      INSERT INTO room_category (code, name, capacity, max_occupancy_per_room, max_extra_beds_per_room, base_price)
      VALUES
        ('DELUXE',      'Deluxe Room',                    18, 3, 1, 4500.00),
        ('SUPER_DELUXE','Super Deluxe & Heritage Room',   18, 3, 1, 5500.00),
        ('SUITE',       'Executive Suite',                 4, 4, 2, 4500.00),
        ('FAMILY',      'Family Room',                     1, 6, 2, 9000.00),
        ('CLUB',        'Club Room',                       1, 2, 0, 1500.00)
      ON CONFLICT (code) DO UPDATE SET
        name                    = EXCLUDED.name,
        capacity                = EXCLUDED.capacity,
        max_occupancy_per_room  = EXCLUDED.max_occupancy_per_room,
        max_extra_beds_per_room = EXCLUDED.max_extra_beds_per_room,
        base_price              = EXCLUDED.base_price,
        updated_at              = now()
    `;

    // -----------------------------------------------------------------------
    // 2. Seed / refresh inventory for next 90 days at flat rack rates.
    // -----------------------------------------------------------------------
    await sql`
      INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price)
      SELECT
        rc.id,
        d::date,
        -- available rooms per category
        CASE rc.code
          WHEN 'DELUXE'       THEN 18
          WHEN 'SUPER_DELUXE' THEN 18
          WHEN 'SUITE'        THEN 4
          WHEN 'FAMILY'       THEN 1
          WHEN 'CLUB'         THEN 1
        END,
        -- flat nightly rack rate per room type (confirmed prices)
        CASE rc.code
          WHEN 'DELUXE'       THEN 4500.00
          WHEN 'SUPER_DELUXE' THEN 5500.00
          WHEN 'SUITE'        THEN 4500.00
          WHEN 'FAMILY'       THEN 9000.00
          WHEN 'CLUB'         THEN 1500.00
        END,
        -- extra bed price per night
        CASE rc.code
          WHEN 'CLUB' THEN 0.00
          ELSE 1500.00
        END
      FROM room_category rc
      CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', '1 day') d
      WHERE rc.code IN ('DELUXE', 'SUPER_DELUXE', 'SUITE', 'FAMILY', 'CLUB')
      ON CONFLICT (category_id, date) DO UPDATE SET
        base_available  = EXCLUDED.base_available,
        base_price      = EXCLUDED.base_price,
        extra_bed_price = EXCLUDED.extra_bed_price,
        updated_at      = now()
    `;

    // Ensure the default categories carry their published content (images,
    // descriptions, features) without clobbering any admin edits.
    await backfillKnownRoomContent(sql);

    return NextResponse.json({
      success: true,
      message: 'Room categories and inventory updated for the next 90 days.',
      categories: [
        { code: 'DELUXE',       rooms: 18, price: 4500 },
        { code: 'SUPER_DELUXE', rooms: 18, price: 5500 },
        { code: 'SUITE',        rooms: 4,  price: 4500 },
        { code: 'FAMILY',       rooms: 1,  price: 9000 },
        { code: 'CLUB',         rooms: 1,  price: 1500 },
      ],
    });
  } catch (error) {
    console.error('Seed inventory error:', error);
    return adminErrorResponse(error);
  }
}

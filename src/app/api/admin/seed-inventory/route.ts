import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

// ---------------------------------------------------------------------------
// POST /api/admin/seed-inventory
// Updates all room categories to match actual hotel data and re-seeds
// room_inventory for the next 90 days with weekday/weekend pricing.
//
// Weekend = Friday (5), Saturday (6), Sunday (0)
// Weekday = Monday (1) – Thursday (4)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    // -----------------------------------------------------------------------
    // 1. Upsert all 5 room categories with correct counts & occupancy
    // -----------------------------------------------------------------------
    await sql`
      INSERT INTO room_category (code, name, capacity, max_occupancy_per_room, max_extra_beds_per_room)
      VALUES
        ('DELUXE',      'Deluxe Room',                    18, 3, 1),
        ('SUPER_DELUXE','Super Deluxe & Heritage Room',   18, 3, 1),
        ('SUITE',       'Executive Suite',                 4, 4, 2),
        ('FAMILY',      'Family Room',                     1, 6, 2),
        ('CLUB',        'Club Room',                       1, 2, 0)
      ON CONFLICT (code) DO UPDATE SET
        name                    = EXCLUDED.name,
        capacity                = EXCLUDED.capacity,
        max_occupancy_per_room  = EXCLUDED.max_occupancy_per_room,
        max_extra_beds_per_room = EXCLUDED.max_extra_beds_per_room,
        updated_at              = now()
    `;

    // -----------------------------------------------------------------------
    // 2. Seed / refresh inventory for next 90 days
    //    Uses PostgreSQL EXTRACT(DOW ...) to detect weekday vs weekend.
    //    Weekend: DOW IN (0=Sun, 5=Fri, 6=Sat)
    //    Weekday: DOW IN (1=Mon, 2=Tue, 3=Wed, 4=Thu)
    //
    //    Tariff:
    //      DELUXE       Wday ₹4500  / Wend ₹5500
    //      SUPER_DELUXE Wday ₹5500  / Wend ₹6500
    //      SUITE        Wday ₹6500  / Wend ₹7500
    //      FAMILY       Wday ₹9000  / Wend ₹10000
    //      CLUB         Wday ₹1500  / Wend ₹2000
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
        -- weekday vs weekend price
        CASE
          WHEN EXTRACT(DOW FROM d::date) IN (0, 5, 6) THEN
            CASE rc.code
              WHEN 'DELUXE'       THEN 5500.00
              WHEN 'SUPER_DELUXE' THEN 6500.00
              WHEN 'SUITE'        THEN 7500.00
              WHEN 'FAMILY'       THEN 10000.00
              WHEN 'CLUB'         THEN 2000.00
            END
          ELSE
            CASE rc.code
              WHEN 'DELUXE'       THEN 4500.00
              WHEN 'SUPER_DELUXE' THEN 5500.00
              WHEN 'SUITE'        THEN 6500.00
              WHEN 'FAMILY'       THEN 9000.00
              WHEN 'CLUB'         THEN 1500.00
            END
        END,
        -- extra bed price per night
        CASE rc.code
          WHEN 'SUITE'  THEN 2000.00
          WHEN 'FAMILY' THEN 1500.00
          WHEN 'CLUB'   THEN 0.00
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

    return NextResponse.json({
      success: true,
      message: 'Room categories and inventory updated for next 90 days with weekday/weekend pricing.',
      categories: [
        { code: 'DELUXE',       rooms: 18, weekday: 4500, weekend: 5500 },
        { code: 'SUPER_DELUXE', rooms: 18, weekday: 5500, weekend: 6500 },
        { code: 'SUITE',        rooms: 4,  weekday: 6500, weekend: 7500 },
        { code: 'FAMILY',       rooms: 1,  weekday: 9000, weekend: 10000 },
        { code: 'CLUB',         rooms: 1,  weekday: 1500, weekend: 2000  },
      ],
    });
  } catch (error) {
    console.error('Seed inventory error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

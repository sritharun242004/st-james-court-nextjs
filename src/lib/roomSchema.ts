import type { getDb } from './db';

type Sql = ReturnType<typeof getDb>;

// Warm-instance guard: the migration is idempotent, but re-running its DDL and
// backfills on every request adds avoidable HTTP round-trips to Neon. Once it
// has succeeded in this server instance we skip it entirely. A cold start runs
// it once more (cheap, all statements are no-ops if already applied).
let migrated = false;

/**
 * Backfill content for the known/original room codes so the public site looks
 * identical after rooms become fully DB-driven. Only fills rows whose slug is
 * still NULL, so admin edits are never overwritten.
 */
const SEED_CONTENT: Record<string, {
  slug: string;
  group: string;
  size: string;
  bed: string;
  short: string;
  long: string;
  features: string[];
  amenities: string[];
  highlights: string[];
  images: string[];
}> = {
  DELUXE: {
    slug: 'deluxe-room',
    group: 'deluxe',
    size: '350 sq ft',
    bed: 'Twin Beds',
    short: 'Comfortable room with twin beds and Fenesta French window, perfect for a relaxing stay.',
    long: "Step into our beautifully appointed Deluxe Room, where French colonial architecture meets contemporary comfort. The room features twin beds with premium linens, ensuring a restful night's sleep. The highlight of the room is the elegant Fenesta French window that opens to reveal breathtaking views and fills the space with natural light. The room is thoughtfully designed with warm wood furnishings, local artwork, and modern amenities to create a welcoming atmosphere that reflects the unique character of Pondicherry.",
    features: ['Twin Beds with Premium Linens', 'Fenesta French Window', 'Air Conditioning', '24hrs Hot & Cold Water', 'Complimentary WiFi', 'Mini Refrigerator', 'Tea/Coffee Making Facilities', 'Daily Housekeeping'],
    amenities: ['Free WiFi', 'Tea/Coffee Maker', 'Private Bathroom', 'Parking', 'Room Service'],
    highlights: ['Perfect for couples or friends', 'French colonial architecture', 'Natural light throughout the day', 'Quiet and peaceful environment', 'Easy access to beach and French Quarter'],
    images: ['/images/newrooms/deluxe/room1.JPG', '/images/newrooms/deluxe/room2.JPG', '/images/newrooms/deluxe/unnamed.jpg'],
  },
  SUPER_DELUXE: {
    slug: 'super-deluxe',
    group: 'deluxe',
    size: '450 sq ft',
    bed: 'King Size Bed',
    short: 'Upgraded room with king size bed and elegant furnishings for enhanced comfort.',
    long: 'Our Super Deluxe room represents the perfect upgrade for discerning travelers seeking additional space and luxury. The centerpiece is a plush king size bed adorned with high-quality linens and multiple pillows for ultimate comfort. The room features an elegant cushion chair positioned perfectly for reading or enjoying the view through the double glazing UPVC window. The sophisticated interior design incorporates rich fabrics, tasteful artwork, and premium furnishings that reflect the French colonial heritage of Pondicherry while providing all modern conveniences.',
    features: ['King Size Bed with Luxury Linens', 'Elegant Cushion Chair', 'Curtains with Scallops', 'Double Glazing UPVC Window', 'Enhanced Air Conditioning', 'Premium Bathroom Amenities', 'Spacious Work Desk', 'Complimentary Breakfast'],
    amenities: ['High-Speed WiFi', 'Premium Coffee/Tea', 'Luxury Bathroom', 'Valet Parking', '24/7 Room Service'],
    highlights: ['Spacious and luxurious', 'Perfect for romantic getaways', 'Enhanced privacy with double glazing', 'Premium furnishings and decor', 'Complimentary breakfast included'],
    images: ['/images/newrooms/super-deluxe/room1.jpg', '/images/newrooms/super-deluxe/room2.JPG', '/images/newrooms/super-deluxe/room3.JPG'],
  },
  SUITE: {
    slug: 'executive-suite',
    group: 'suite',
    size: '600 sq ft',
    bed: 'King Size Bed',
    short: 'Premium suite with king size bed, luxurious cushion sofa and private balcony for the ultimate experience.',
    long: 'Our Executive Suite Room represents the pinnacle of luxury accommodation at St James Court Beach Resort. This expansive suite features a separate living area with a luxurious cushion sofa, perfect for relaxation or entertaining. The bedroom area boasts a king size bed with the finest linens and multiple seating options. The crown jewel is the private balcony offering stunning views of the ocean or gardens, providing an intimate space to enjoy morning coffee or evening cocktails. The bathroom is a sanctuary of luxury featuring both a modern shower and a deep soaking bath tub.',
    features: ['King Size Bed with Premium Linens', 'Separate Living Area', 'Luxurious Cushion Sofa', 'Private Balcony with Views', 'Shower and Bath Tub', 'Mini Bar', 'Executive Work Station', 'Complimentary Breakfast & Evening Snacks'],
    amenities: ['Premium WiFi', 'Mini Bar & Coffee', 'Luxury Bath & Shower', 'Priority Parking', 'Priority Room Service'],
    highlights: ['Most spacious accommodation', 'Private balcony with stunning views', 'Separate living and sleeping areas', 'Luxury bathroom with tub', 'Perfect for special occasions'],
    images: ['/images/newrooms/suite/room1.JPG', '/images/newrooms/suite/room2.JPG', '/images/newrooms/suite/room3.JPG'],
  },
  FAMILY: {
    slug: 'family-room',
    group: 'family',
    size: 'Spacious',
    bed: 'Multiple Beds',
    short: 'Roomy accommodation ideal for families, with flexible bedding and space for everyone.',
    long: 'Our Family Room is designed with togetherness in mind — generous space, flexible bedding and child-friendly comfort make it the ideal base for a family holiday by the sea. Thoughtful furnishings and modern amenities keep everyone comfortable, while the resort\'s beach access and activities are just steps away.',
    features: ['Multiple Beds', 'Air Conditioning', '24hrs Hot & Cold Water', 'Complimentary WiFi', 'Extra Bed Friendly', 'Daily Housekeeping'],
    amenities: ['Free WiFi', 'Tea/Coffee Maker', 'Private Bathroom', 'Parking', 'Room Service'],
    highlights: ['Ideal for families', 'Flexible bedding options', 'Space for children', 'Close to beach and pool'],
    images: ['/images/newrooms/deluxe/room1.JPG', '/images/newrooms/deluxe/room2.JPG'],
  },
  CLUB: {
    slug: 'club-room',
    group: 'deluxe',
    size: 'Standard',
    bed: 'Double Bed',
    short: 'A smart, comfortable room offering great value with all essential comforts.',
    long: 'Our Club Room offers comfortable, well-appointed accommodation at exceptional value. With a cosy double bed, air conditioning and all the essential amenities, it\'s perfect for short stays and solo travellers who want easy access to everything the resort has to offer.',
    features: ['Double Bed', 'Air Conditioning', '24hrs Hot & Cold Water', 'Complimentary WiFi', 'Daily Housekeeping'],
    amenities: ['Free WiFi', 'Private Bathroom', 'Parking', 'Room Service'],
    highlights: ['Great value', 'Comfortable for short stays', 'Ideal for solo travellers'],
    images: ['/images/newrooms/deluxe/unnamed.jpg', '/images/newrooms/deluxe/room2.JPG'],
  },
};

/**
 * Ensures all columns/tables used by room management exist and that the
 * original room categories carry their published content. Idempotent and
 * safe to call on every request:
 *   - ALTER ... ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS are no-ops
 *     once applied.
 *   - The content backfill only touches rows where slug IS NULL, so it runs
 *     once per category and never overwrites admin edits.
 *
 * Columns added to room_category:
 *   base_price        canonical rack rate (shown/edited in admin)
 *   slug              public detail-page URL segment (unique)
 *   category_group    grouping for the showcase filter (deluxe/suite/family…)
 *   size_label        e.g. "350 sq ft"
 *   bed_type          e.g. "King Size Bed"
 *   short_description card/summary copy
 *   long_description  detail-page copy
 *   features          jsonb string[]  (bullet list)
 *   amenities         jsonb string[]  (icon list)
 *   highlights        jsonb string[]  ("why choose this room")
 *   images            jsonb string[]  (image URLs — /api/images/<id> or paths)
 *   sort_order        display order
 *   active            visible/bookable on the public site
 *
 * room_inventory.blocked: rooms held internally (offline/bulk). Net sellable =
 * base_available - booked - blocked.
 */
export async function ensureRoomCategorySchema(sql: Sql) {
  if (migrated) return;

  // 1. Add all room_category columns in a single ALTER (one round-trip).
  await sql`
    ALTER TABLE room_category
      ADD COLUMN IF NOT EXISTS base_price        NUMERIC(10,2),
      ADD COLUMN IF NOT EXISTS slug              TEXT,
      ADD COLUMN IF NOT EXISTS category_group    TEXT,
      ADD COLUMN IF NOT EXISTS size_label        TEXT,
      ADD COLUMN IF NOT EXISTS bed_type          TEXT,
      ADD COLUMN IF NOT EXISTS short_description  TEXT,
      ADD COLUMN IF NOT EXISTS long_description   TEXT,
      ADD COLUMN IF NOT EXISTS features          JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS amenities         JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS highlights        JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS images            JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS sort_order        INT DEFAULT 100,
      ADD COLUMN IF NOT EXISTS active            BOOLEAN DEFAULT true
  `;

  // Unique slug index (partial — ignores NULLs so legacy rows don't clash).
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS room_category_slug_key
      ON room_category (slug) WHERE slug IS NOT NULL
  `;

  // 2. room_inventory.blocked for internal holds.
  await sql`ALTER TABLE room_inventory ADD COLUMN IF NOT EXISTS blocked INT NOT NULL DEFAULT 0`;

  // 3. Uploaded-image store (kept in Neon — no external bucket required).
  await sql`
    CREATE TABLE IF NOT EXISTS room_image (
      id          SERIAL PRIMARY KEY,
      category_id INT REFERENCES room_category(id) ON DELETE CASCADE,
      mime        TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // 4. Backfill base_price from earliest upcoming inventory (original behaviour).
  await sql`
    UPDATE room_category rc
    SET base_price = (
      SELECT MIN(ri.base_price)
      FROM room_inventory ri
      WHERE ri.category_id = rc.id AND ri.date >= CURRENT_DATE
    )
    WHERE rc.base_price IS NULL
      AND EXISTS (
        SELECT 1 FROM room_inventory ri
        WHERE ri.category_id = rc.id AND ri.date >= CURRENT_DATE
      )
  `;

  // 5. Content backfill for the original room codes (only where slug IS NULL).
  await backfillKnownRoomContent(sql);

  migrated = true;
}

/**
 * Populates content for the original room codes, but only for rows whose slug
 * is still NULL — so it never overwrites admin edits. Safe to call repeatedly.
 * Called by ensureRoomCategorySchema and by the seed-inventory route (which
 * may create these categories after the warm-instance guard has tripped).
 */
export async function backfillKnownRoomContent(sql: Sql) {
  const needsBackfill = await sql`
    SELECT code FROM room_category WHERE slug IS NULL AND code = ANY(${Object.keys(SEED_CONTENT)})
  `;
  for (const row of needsBackfill) {
    const c = SEED_CONTENT[row.code as keyof typeof SEED_CONTENT];
    if (!c) continue;
    await sql`
      UPDATE room_category SET
        slug              = ${c.slug},
        category_group    = ${c.group},
        size_label        = ${c.size},
        bed_type          = ${c.bed},
        short_description = ${c.short},
        long_description  = ${c.long},
        features          = ${JSON.stringify(c.features)}::jsonb,
        amenities         = ${JSON.stringify(c.amenities)}::jsonb,
        highlights        = ${JSON.stringify(c.highlights)}::jsonb,
        images            = ${JSON.stringify(c.images)}::jsonb,
        active            = COALESCE(active, true),
        updated_at        = now()
      WHERE code = ${row.code} AND slug IS NULL
    `;
  }
}

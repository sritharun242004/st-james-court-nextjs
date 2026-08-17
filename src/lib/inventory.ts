import type { getDb } from './db';

type Sql = ReturnType<typeof getDb>;

// How many days ahead the bookable inventory window should always extend.
export const INVENTORY_WINDOW_DAYS = 365;

/**
 * Self-healing inventory window.
 *
 * Keeps `room_inventory` populated from today through today + windowDays so
 * bookable dates never lapse — without any external cron. Called on the read
 * path (availability / booking), so the window extends itself as time rolls
 * forward or whenever a gap is detected.
 *
 * Behaviour:
 *  - For each category, new future dates inherit that category's most recent
 *    inventory row (base_available, extra_bed_price) and the canonical
 *    room_category.base_price (falling back to the latest row's price). This
 *    means admin price/availability edits propagate to newly generated dates.
 *  - Only MISSING dates are inserted (ON CONFLICT DO NOTHING), so existing
 *    rows — including admin edits and per-date adjustments — are never touched.
 *  - If a category's latest row is already at/after the horizon, its date
 *    series is empty and nothing happens (cheap no-op).
 *  - Also recovers the "all inventory is in the past" case: the series starts
 *    at GREATEST(today, last_date + 1), so a stale window refills from today.
 *
 * A category with no inventory rows at all is skipped (nothing to inherit) —
 * use the admin seed-inventory route to bootstrap those.
 */
export async function ensureInventoryWindow(
  sql: Sql,
  windowDays: number = INVENTORY_WINDOW_DAYS
): Promise<void> {
  await sql`
    INSERT INTO room_inventory (category_id, date, base_available, base_price, extra_bed_price)
    SELECT
      latest.category_id,
      gs.d::date,
      latest.base_available,
      COALESCE(rc.base_price, latest.base_price),
      latest.extra_bed_price
    FROM (
      SELECT DISTINCT ON (category_id)
        category_id, base_available, base_price, extra_bed_price, date AS last_date
      FROM room_inventory
      ORDER BY category_id, date DESC
    ) latest
    JOIN room_category rc ON rc.id = latest.category_id
    CROSS JOIN LATERAL generate_series(
      GREATEST(CURRENT_DATE, latest.last_date + 1),
      CURRENT_DATE + ${windowDays}::int,
      INTERVAL '1 day'
    ) gs(d)
    ON CONFLICT (category_id, date) DO NOTHING
  `;
}

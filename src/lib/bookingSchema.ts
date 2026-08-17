import type { getDb } from './db';

type Sql = ReturnType<typeof getDb>;

// Warm-instance guard — the migration is idempotent but we skip the DDL round
// trip once it has succeeded in this server instance.
let migrated = false;

/**
 * Adds check-in / walk-in / room-number tracking columns to `booking`.
 * All statements are ADD COLUMN IF NOT EXISTS, so this is safe to run on every
 * cold start and is a no-op once applied.
 *
 *   room_numbers   free-text assigned room numbers, e.g. "101, 102"
 *   checked_in_at  set when the guest is checked in (drives Stay status)
 *   checked_out_at set when the guest checks out
 *   is_walk_in     true for bookings created at the desk (no online reservation)
 */
export async function ensureBookingSchema(sql: Sql): Promise<void> {
  if (migrated) return;
  await sql`
    ALTER TABLE booking
      ADD COLUMN IF NOT EXISTS room_numbers   TEXT,
      ADD COLUMN IF NOT EXISTS checked_in_at  TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS is_walk_in     BOOLEAN NOT NULL DEFAULT false
  `;
  migrated = true;
}

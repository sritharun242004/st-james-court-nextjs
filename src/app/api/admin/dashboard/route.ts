import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const today = new Date().toISOString().split('T')[0];

    const [
      userCountRows,
      categoryRows,
      activeDiscountRows,
      recentBookingCountRows,
      todayInventoryRows,
      todayBookedRows,
      recentBookings,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM user_account WHERE is_active = true`,
      sql`SELECT id, code, name, capacity FROM room_category ORDER BY id`,
      sql`SELECT COUNT(*)::int as count FROM discount_rule WHERE active = true AND date >= ${today}::date`,
      sql`SELECT COUNT(*)::int as count FROM booking WHERE created_at >= NOW() - INTERVAL '30 days'`,
      sql`SELECT category_id, base_available, base_price FROM room_inventory WHERE date = ${today}::date`,
      sql`SELECT category_id, COALESCE(SUM(rooms), 0)::int as booked FROM booking_night WHERE date = ${today}::date GROUP BY category_id`,
      sql`
        SELECT b.id, b.check_in::text as check_in, b.check_out::text as check_out,
               b.rooms, b.final_amount, b.payment_status, b.created_at,
               u.full_name, u.phone,
               rc.name as category_name
        FROM booking b
        JOIN user_account u ON u.id = b.user_id
        JOIN room_category rc ON rc.id = b.category_id
        ORDER BY b.created_at DESC
        LIMIT 5
      `,
    ]);

    const userCount = userCountRows[0].count;
    const categoryCount = categoryRows.length;
    const activeDiscountCount = activeDiscountRows[0].count;
    const recentBookingsCount = recentBookingCountRows[0].count;

    // Calculate occupancy rate for today
    const inventoryMap = new Map<number, number>();
    for (const row of todayInventoryRows) {
      inventoryMap.set(row.category_id, row.base_available);
    }
    const bookedMap = new Map<number, number>();
    for (const row of todayBookedRows) {
      bookedMap.set(row.category_id, row.booked);
    }

    let totalAvailable = 0;
    let totalBooked = 0;
    for (const [catId, available] of inventoryMap) {
      totalAvailable += available;
      totalBooked += bookedMap.get(catId) || 0;
    }
    const occupancyRate = totalAvailable > 0 ? Math.round((totalBooked / totalAvailable) * 100) : 0;

    // Category details with today's inventory
    const categories = categoryRows.map((cat: Record<string, unknown>) => {
      const inv = todayInventoryRows.find((i: Record<string, unknown>) => i.category_id === cat.id);
      return {
        id: cat.id,
        code: cat.code,
        name: cat.name,
        capacity: cat.capacity,
        todayAvailable: inv ? inv.base_available : 0,
        todayPrice: inv ? parseFloat(String(inv.base_price)) : 0,
      };
    });

    return NextResponse.json({
      data: {
        userCount,
        categoryCount,
        activeDiscountCount,
        recentBookingsCount,
        occupancyRate,
        categories,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

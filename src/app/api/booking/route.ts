import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendBookingNotification, sendUserBookingConfirmation } from '@/lib/email';

// Helper: extract yyyy-MM-dd from a DB date value (avoids timezone shifts)
function toDateStr(dbDate: unknown): string {
  if (typeof dbDate === 'string') {
    return dbDate.split('T')[0];
  }
  // DB returns Date object — extract local date parts to avoid TZ shift
  if (dbDate instanceof Date) {
    const y = dbDate.getUTCFullYear();
    const m = String(dbDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dbDate.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(dbDate);
}

interface BookingCreateReq {
  categoryCode: string;
  checkIn: string;   // yyyy-MM-dd
  checkOut: string;   // yyyy-MM-dd
  rooms: number;
  adults: number;
  children: number;
  extraBeds: number;
  fullName: string;
  phone: string;
  email?: string;
  privilegeCardNumber?: string;
  specialRequests?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingCreateReq = await request.json();

    // --- Validation ---
    if (!body.categoryCode || !body.checkIn || !body.checkOut || !body.fullName || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields: categoryCode, checkIn, checkOut, fullName, phone' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(body.checkIn + 'T00:00:00Z');
    const checkOutDate = new Date(body.checkOut + 'T00:00:00Z');

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format. Use yyyy-MM-dd' }, { status: 400 });
    }
    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ error: 'Check-in must be before check-out' }, { status: 400 });
    }

    const rooms = body.rooms || 1;
    if (rooms < 1 || rooms > 10) {
      return NextResponse.json({ error: 'Rooms must be between 1 and 10' }, { status: 400 });
    }

    const sql = getDb();

    // --- Phase 1: Parallel lookups (category + user + privilege card) ---
    const [categories, users, ...privilegeResult] = await Promise.all([
      sql`SELECT id, code, name, max_extra_beds_per_room FROM room_category WHERE code = ${body.categoryCode}`,
      sql`SELECT id, full_name, phone, email FROM user_account WHERE phone = ${body.phone}`,
      ...(body.privilegeCardNumber
        ? [sql`SELECT id, active FROM privilege_member WHERE card_number = ${body.privilegeCardNumber}`]
        : []),
    ]);

    if (categories.length === 0) {
      return NextResponse.json({ error: `Unknown room category: ${body.categoryCode}` }, { status: 400 });
    }
    const category = categories[0];

    // --- Validate extra beds ---
    const extraBeds = body.extraBeds || 0;
    const maxExtraBeds = category.max_extra_beds_per_room * rooms;
    if (extraBeds < 0 || extraBeds > maxExtraBeds) {
      return NextResponse.json(
        { error: `Extra beds must be between 0 and ${maxExtraBeds} (${category.max_extra_beds_per_room} per room × ${rooms} room${rooms > 1 ? 's' : ''})` },
        { status: 400 }
      );
    }

    // --- Resolve user ---
    let userId: number;
    if (users.length > 0) {
      userId = users[0].id;
      if (body.email && !users[0].email) {
        await sql`UPDATE user_account SET email = ${body.email} WHERE id = ${userId}`;
      }
    } else {
      const newUsers = await sql`
        INSERT INTO user_account (full_name, phone, email, is_active)
        VALUES (${body.fullName}, ${body.phone}, ${body.email || null}, true)
        RETURNING id
      `;
      userId = newUsers[0].id;
    }

    // --- Validate privilege card ---
    let privilegeMemberId: number | null = null;
    let hasPrivilege = false;
    if (body.privilegeCardNumber) {
      const members = privilegeResult[0] || [];
      if (members.length === 0 || !members[0].active) {
        return NextResponse.json(
          { error: `Invalid or inactive privilege card: ${body.privilegeCardNumber}` },
          { status: 400 }
        );
      }
      privilegeMemberId = members[0].id;
      hasPrivilege = true;
    }

    // --- Generate night dates (yyyy-MM-dd strings) ---
    const nightDates: string[] = [];
    const d = new Date(checkInDate);
    while (d < checkOutDate) {
      nightDates.push(toDateStr(d));
      d.setUTCDate(d.getUTCDate() + 1);
    }

    const lastNight = nightDates[nightDates.length - 1];

    // --- Phase 2: Parallel fetch inventory + discounts + booked rooms ---
    const [inventory, discountRows, bookedRows] = await Promise.all([
      sql`
        SELECT date::text as date, base_available, base_price, extra_bed_price
        FROM room_inventory
        WHERE category_id = ${category.id}
          AND date >= ${body.checkIn}::date
          AND date <= ${lastNight}::date
        ORDER BY date
      `,
      hasPrivilege
        ? sql`
            SELECT date::text as date, room_discount
            FROM discount_rule
            WHERE active = true
              AND date >= ${body.checkIn}::date
              AND date <= ${lastNight}::date
          `
        : Promise.resolve([]),
      sql`
        SELECT date::text as date, COALESCE(SUM(rooms), 0) as booked
        FROM booking_night
        WHERE category_id = ${category.id}
          AND date >= ${body.checkIn}::date
          AND date <= ${lastNight}::date
        GROUP BY date
      `,
    ]);

    const inventoryByDate = new Map<string, { baseAvailable: number; basePrice: number; extraBedPrice: number }>();
    for (const row of inventory) {
      inventoryByDate.set(row.date, {
        baseAvailable: row.base_available,
        basePrice: parseFloat(row.base_price),
        extraBedPrice: parseFloat(row.extra_bed_price),
      });
    }

    const discountByDate = new Map<string, number>();
    for (const row of discountRows) {
      discountByDate.set(row.date, row.room_discount);
    }

    const bookedByDate = new Map<string, number>();
    for (const row of bookedRows) {
      bookedByDate.set(row.date, parseInt(row.booked));
    }

    // Calculate per-night pricing
    interface NightPrice {
      date: string;
      rooms: number;
      basePrice: number;
      discountPercent: number | null;
      finalPrice: number;
    }
    const nightPrices: NightPrice[] = [];

    for (const dateStr of nightDates) {
      const inv = inventoryByDate.get(dateStr);
      if (!inv) {
        return NextResponse.json(
          { error: `No inventory available for date: ${dateStr}` },
          { status: 400 }
        );
      }

      const booked = bookedByDate.get(dateStr) || 0;
      const available = inv.baseAvailable - booked;
      if (available < rooms) {
        return NextResponse.json(
          { error: `Insufficient rooms for ${dateStr} (requested: ${rooms}, available: ${available})` },
          { status: 400 }
        );
      }

      let discountPct: number | null = null;
      let finalPrice = inv.basePrice;

      if (hasPrivilege) {
        const pct = discountByDate.get(dateStr);
        if (pct && pct > 0) {
          discountPct = pct;
          finalPrice = Math.round((inv.basePrice * (100 - pct)) / 100 * 100) / 100;
        }
      }

      nightPrices.push({
        date: dateStr,
        rooms,
        basePrice: inv.basePrice,
        discountPercent: discountPct,
        finalPrice,
      });
    }

    // Calculate totals
    const roomBaseAmount = nightPrices.reduce((sum, n) => sum + n.basePrice, 0) * rooms;
    const extraBedTotal = nightPrices.reduce((sum, n) => {
      const inv = inventoryByDate.get(n.date)!;
      return sum + inv.extraBedPrice * extraBeds;
    }, 0);
    const baseAmount = roomBaseAmount + extraBedTotal;
    const discountAmount = nightPrices.reduce((sum, n) => sum + (n.basePrice - n.finalPrice), 0) * rooms;
    const finalAmount = baseAmount - discountAmount;

    // --- Create booking ---
    const bookingRows = await sql`
      INSERT INTO booking (
        user_id, privilege_member_id, category_id,
        check_in, check_out, rooms, adults, children, extra_beds, special_requests,
        base_amount, discount_amount, final_amount, payment_status
      ) VALUES (
        ${userId}, ${privilegeMemberId}, ${category.id},
        ${body.checkIn}::date, ${body.checkOut}::date, ${rooms},
        ${body.adults || 1}, ${body.children || 0}, ${extraBeds}, ${body.specialRequests || null},
        ${baseAmount}, ${discountAmount}, ${finalAmount}, 'PENDING'
      )
      RETURNING id
    `;
    const bookingId = bookingRows[0].id;

    // --- Create booking nights (single batch INSERT) ---
    await sql`
      INSERT INTO booking_night (booking_id, category_id, date, rooms)
      SELECT ${bookingId}, ${category.id}, unnest(${nightDates}::date[]), ${rooms}
    `;

    // --- Send reservation email (fire-and-forget — never blocks the response) ---
    const emailPayload = {
      bookingId,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      categoryName: category.name,
      categoryCode: body.categoryCode,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: nightPrices,
      rooms,
      adults: body.adults || 1,
      children: body.children || 0,
      extraBeds,
      extraBedTotal,
      privilegeApplied: hasPrivilege,
      privilegeCardNumber: body.privilegeCardNumber,
      baseAmount,
      discountAmount,
      finalAmount,
      paymentStatus: 'PENDING',
      specialRequests: body.specialRequests,
    };
    sendBookingNotification(emailPayload).catch((err) =>
      console.error('[Email] Admin booking notification failed:', err)
    );
    sendUserBookingConfirmation(emailPayload).catch((err) =>
      console.error('[Email] User booking confirmation failed:', err)
    );

    // --- Return response ---
    return NextResponse.json({
      bookingId,
      categoryCode: body.categoryCode,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      rooms,
      adults: body.adults || 1,
      children: body.children || 0,
      extraBeds,
      extraBedTotal,
      privilegeApplied: hasPrivilege,
      privilegeCardNumber: body.privilegeCardNumber || null,
      nights: nightPrices,
      baseAmount,
      discountAmount,
      finalAmount,
      paymentStatus: 'PENDING',
      specialRequests: body.specialRequests || null,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

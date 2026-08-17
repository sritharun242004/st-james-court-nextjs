import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin, adminErrorResponse } from '@/lib/adminAuth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid discount ID' }, { status: 400 });
    }

    const { roomDiscount, foodDiscount, barDiscount, active } = await request.json();

    const rows = await sql`
      UPDATE discount_rule
      SET
        room_discount = COALESCE(${roomDiscount ?? null}, room_discount),
        food_discount = COALESCE(${foodDiscount ?? null}, food_discount),
        bar_discount = COALESCE(${barDiscount ?? null}, bar_discount),
        active = COALESCE(${active ?? null}, active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, date::text as date, room_discount, food_discount, bar_discount, active
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Discount rule not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Discount update error:', error);
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid discount ID' }, { status: 400 });
    }

    const rows = await sql`
      DELETE FROM discount_rule WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Discount rule not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { message: 'Discount rule deleted' } });
  } catch (error) {
    console.error('Discount delete error:', error);
    return adminErrorResponse(error);
  }
}

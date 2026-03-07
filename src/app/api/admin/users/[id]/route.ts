import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { full_name, phone, email } = body;

    const rows = await sql`
      UPDATE user_account
      SET
        full_name = COALESCE(${full_name || null}, full_name),
        phone = COALESCE(${phone || null}, phone),
        email = COALESCE(${email || null}, email),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, full_name, phone, email, is_active, created_at
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('User update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'A user with this phone or email already exists' }, { status: 409 });
    }
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
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Soft-delete to preserve FK integrity with bookings
    const rows = await sql`
      UPDATE user_account
      SET is_active = false, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { message: 'User deactivated' } });
  } catch (error) {
    console.error('User delete error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

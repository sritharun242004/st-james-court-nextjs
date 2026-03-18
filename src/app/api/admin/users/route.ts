import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const search = request.nextUrl.searchParams.get('search') || '';

    let rows;
    if (search) {
      const pattern = `%${search}%`;
      rows = await sql`
        SELECT id, full_name, phone, email, is_active, created_at
        FROM user_account
        WHERE full_name ILIKE ${pattern} OR email ILIKE ${pattern} OR phone ILIKE ${pattern}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT id, full_name, phone, email, is_active, created_at
        FROM user_account
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Users list error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { full_name, phone, email } = await request.json();

    if (!full_name || !phone) {
      return NextResponse.json({ error: 'full_name and phone are required' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO user_account (full_name, phone, email, is_active)
      VALUES (${full_name}, ${phone}, ${email || null}, true)
      RETURNING id, full_name, phone, email, is_active, created_at
    `;

    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('User create error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'A user with this phone or email already exists' }, { status: 409 });
    }
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

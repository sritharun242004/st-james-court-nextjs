import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, username, password_hash, is_active
      FROM admin_user
      WHERE username = ${username}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = rows[0];

    if (!admin.is_active) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ sub: admin.id, username: admin.username });

    return NextResponse.json({
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

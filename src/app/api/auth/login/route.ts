import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const sql = getDb();

    const rows = await sql`
      SELECT id, full_name, phone, email, password_hash, is_active
      FROM user_account
      WHERE email = ${email}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 401 });
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'No password set for this account. Please register first.' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signToken({ sub: user.id, username: user.email });

    return NextResponse.json({
      token,
      user: {
        id: String(user.id),
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        is_admin: false,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

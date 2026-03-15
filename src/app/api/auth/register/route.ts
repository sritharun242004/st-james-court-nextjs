import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone, age, nationality } = await request.json();

    if (!email || !password || !full_name || !phone) {
      return NextResponse.json(
        { error: 'Email, password, full name, and phone are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Check for existing user by email or phone
    const existing = await sql`
      SELECT id, email, phone FROM user_account
      WHERE email = ${email} OR phone = ${phone}
      LIMIT 1
    `;

    if (existing.length > 0) {
      if (existing[0].email === email) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      if (existing[0].phone === phone) {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(password);

    const rows = await sql`
      INSERT INTO user_account (full_name, phone, email, password_hash, is_active, age, nationality)
      VALUES (${full_name}, ${phone}, ${email}, ${passwordHash}, true, ${age ? Number(age) : null}, ${nationality || null})
      RETURNING id, full_name, phone, email, is_active, age, nationality
    `;

    const user = rows[0];

    const token = await signToken({ sub: user.id, username: user.email });

    return NextResponse.json({
      token,
      user: {
        id: String(user.id),
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        age: user.age || null,
        nationality: user.nationality || null,
        is_admin: false,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

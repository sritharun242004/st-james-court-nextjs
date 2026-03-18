import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, full_name, email, reset_token, reset_expires_at
      FROM user_account
      WHERE reset_token = ${token}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const user = rows[0];

    if (!user.reset_expires_at || new Date(user.reset_expires_at) < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await sql`
      UPDATE user_account
      SET password_hash = ${passwordHash}, reset_token = NULL, reset_expires_at = NULL
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

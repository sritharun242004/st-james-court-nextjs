import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

// Ensure reset columns exist (runs once, safe to call repeatedly)
async function ensureResetColumns() {
  const sql = getDb();
  await sql`ALTER TABLE user_account ADD COLUMN IF NOT EXISTS reset_token TEXT`;
  await sql`ALTER TABLE user_account ADD COLUMN IF NOT EXISTS reset_expires_at TIMESTAMPTZ`;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await ensureResetColumns();

    const sql = getDb();
    const rows = await sql`
      SELECT id, full_name, email, is_active FROM user_account WHERE email = ${email}
    `;

    // Always return success to prevent email enumeration attacks
    if (rows.length === 0 || !rows[0].is_active) {
      return NextResponse.json({ success: true });
    }

    const user = rows[0];
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await sql`
      UPDATE user_account
      SET reset_token = ${token}, reset_expires_at = ${expiresAt.toISOString()}
      WHERE id = ${user.id}
    `;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:4001';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    sendPasswordResetEmail(user.email, user.full_name, resetLink).catch((err) =>
      console.error('[Email] Password reset email failed:', err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

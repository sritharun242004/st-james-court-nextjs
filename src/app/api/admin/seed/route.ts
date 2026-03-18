import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const sql = getDb();

    const existing = await sql`SELECT id FROM admin_user LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Admin user already seeded' });
    }

    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const passwordHash = await hashPassword(password);

    await sql`
      INSERT INTO admin_user (username, password_hash, is_active)
      VALUES ('admin', ${passwordHash}, true)
    `;

    return NextResponse.json({ message: 'Admin user seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed admin user' }, { status: 500 });
  }
}

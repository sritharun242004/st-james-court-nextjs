import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, full_name, phone, email, is_active, created_at, age, nationality
      FROM user_account WHERE id = ${auth.sub}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    // Check if user has a privilege card
    const privilegeRows = await sql`
      SELECT card_number, active, expiry_date
      FROM privilege_member WHERE user_id = ${auth.sub}
    `;

    return NextResponse.json({
      user: {
        id: String(user.id),
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        age: user.age || null,
        nationality: user.nationality || null,
        is_admin: false,
        created_at: user.created_at,
      },
      privilegeCard: privilegeRows.length > 0 ? {
        cardNumber: privilegeRows[0].card_number,
        active: privilegeRows[0].active,
        expiryDate: privilegeRows[0].expiry_date,
      } : null,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, phone, age, nationality } = body;

    const sql = getDb();

    // Check phone uniqueness if changing
    if (phone) {
      const existing = await sql`
        SELECT id FROM user_account WHERE phone = ${phone} AND id != ${auth.sub}
      `;
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Phone number already in use' }, { status: 409 });
      }
    }

    const rows = await sql`
      UPDATE user_account
      SET
        full_name = COALESCE(${full_name || null}, full_name),
        phone = COALESCE(${phone || null}, phone),
        age = COALESCE(${age !== undefined ? (age ? Number(age) : null) : null}, age),
        nationality = COALESCE(${nationality || null}, nationality),
        updated_at = now()
      WHERE id = ${auth.sub}
      RETURNING id, full_name, phone, email, age, nationality
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json({
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
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

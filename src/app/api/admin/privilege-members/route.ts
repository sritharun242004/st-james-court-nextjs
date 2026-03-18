import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const rows = await sql`
      SELECT
        pm.id,
        pm.card_number,
        pm.active,
        pm.issued_at,
        pm.expiry_date,
        pm.issue_channel,
        pm.notes,
        pm.created_at,
        ua.id as user_id,
        ua.full_name as user_name,
        ua.phone as user_phone,
        ua.email as user_email
      FROM privilege_member pm
      LEFT JOIN user_account ua ON ua.id = pm.user_id
      ORDER BY pm.created_at DESC
    `;

    return NextResponse.json({
      data: rows.map(r => ({
        id: r.id,
        cardNumber: r.card_number,
        active: r.active,
        issuedAt: r.issued_at,
        expiryDate: r.expiry_date,
        issueChannel: r.issue_channel,
        notes: r.notes,
        createdAt: r.created_at,
        userId: r.user_id,
        userName: r.user_name,
        userPhone: r.user_phone,
        userEmail: r.user_email,
      })),
    });
  } catch (error) {
    console.error('Privilege members fetch error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { cardNumber, userId, expiryDate, notes, issueChannel } = await request.json();

    if (!cardNumber) {
      return NextResponse.json({ error: 'Card number is required' }, { status: 400 });
    }

    // Check uniqueness
    const existing = await sql`
      SELECT id FROM privilege_member WHERE card_number = ${cardNumber}
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Card number already exists' }, { status: 409 });
    }

    // If linking to user, check user exists and doesn't already have a card
    if (userId) {
      const userCheck = await sql`SELECT id FROM user_account WHERE id = ${userId}`;
      if (userCheck.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const userCard = await sql`SELECT id FROM privilege_member WHERE user_id = ${userId}`;
      if (userCard.length > 0) {
        return NextResponse.json({ error: 'User already has a privilege card' }, { status: 409 });
      }
    }

    const rows = await sql`
      INSERT INTO privilege_member (card_number, user_id, active, expiry_date, issue_channel, notes)
      VALUES (
        ${cardNumber},
        ${userId || null},
        true,
        ${expiryDate || null},
        ${issueChannel || 'ONLINE'},
        ${notes || null}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: rows[0].id, message: 'Privilege card created' }, { status: 201 });
  } catch (error) {
    console.error('Create privilege member error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'Card number already exists' }, { status: 409 });
    }
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

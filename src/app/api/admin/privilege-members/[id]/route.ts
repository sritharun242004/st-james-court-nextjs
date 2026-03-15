import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    const { active, expiryDate, notes, userId } = await request.json();

    // If linking to new user, check uniqueness
    if (userId !== undefined && userId !== null) {
      const userCard = await sql`
        SELECT id FROM privilege_member WHERE user_id = ${userId} AND id != ${params.id}
      `;
      if (userCard.length > 0) {
        return NextResponse.json({ error: 'User already has a privilege card' }, { status: 409 });
      }
    }

    await sql`
      UPDATE privilege_member
      SET
        active = COALESCE(${active !== undefined ? active : null}, active),
        expiry_date = ${expiryDate !== undefined ? (expiryDate || null) : null},
        notes = ${notes !== undefined ? (notes || null) : null},
        user_id = ${userId !== undefined ? (userId || null) : null},
        updated_at = now()
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ message: 'Privilege card updated' });
  } catch (error) {
    console.error('Update privilege member error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();

    await sql`
      UPDATE privilege_member SET active = false, updated_at = now()
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ message: 'Privilege card deactivated' });
  } catch (error) {
    console.error('Deactivate privilege member error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

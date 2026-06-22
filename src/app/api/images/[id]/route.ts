import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Serve an uploaded room image stored in the database.
// Cached aggressively: a given image id is immutable (re-uploads get new ids).
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid image id' }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`SELECT mime, data_base64 FROM room_image WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const { mime, data_base64 } = rows[0] as { mime: string; data_base64: string };
    const buffer = Buffer.from(data_base64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}

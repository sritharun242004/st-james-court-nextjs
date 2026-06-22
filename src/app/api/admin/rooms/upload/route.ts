import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { authenticateAdmin } from '@/lib/adminAuth';
import { ensureRoomCategorySchema } from '@/lib/roomSchema';

// Max accepted upload. Images are stored base64 in Postgres and sent to Neon
// over HTTP, so we keep this modest. The admin UI should compress/resize first
// for very large photos.
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

// POST /api/admin/rooms/upload
// multipart/form-data: field "file" (required), "categoryId" (optional int).
// Stores the image and returns { url } pointing at /api/images/<id>.
export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin(request);
    const sql = getDb();
    await ensureRoomCategorySchema(sql);

    const form = await request.formData();
    const file = form.get('file');
    const categoryIdRaw = form.get('categoryId');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type "${file.type || 'unknown'}". Use JPEG, PNG, WebP, GIF or AVIF.` },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }
    if (bytes.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `Image too large (${(bytes.length / 1048576).toFixed(1)} MB). Maximum is 4 MB.` },
        { status: 413 }
      );
    }

    const categoryId =
      categoryIdRaw != null && String(categoryIdRaw) !== '' && !isNaN(parseInt(String(categoryIdRaw)))
        ? parseInt(String(categoryIdRaw))
        : null;

    const inserted = await sql`
      INSERT INTO room_image (category_id, mime, data_base64)
      VALUES (${categoryId}, ${file.type}, ${bytes.toString('base64')})
      RETURNING id
    `;
    const id = inserted[0].id;

    return NextResponse.json({ data: { id, url: `/api/images/${id}` } });
  } catch (error) {
    console.error('Image upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('authorization') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

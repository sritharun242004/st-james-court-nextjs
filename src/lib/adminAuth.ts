import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AuthError } from './auth';

export async function authenticateAdmin(request: NextRequest): Promise<{ id: number; username: string }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid authorization header');
  }
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  return { id: payload.sub, username: payload.username };
}

/**
 * Builds a consistent error response for admin API routes.
 * Auth failures (expired/invalid token, missing header) -> 401 with a friendly message.
 * Everything else -> 500 without leaking internal error details.
 */
export function adminErrorResponse(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error('Admin route error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

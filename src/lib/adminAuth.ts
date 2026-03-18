import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export async function authenticateAdmin(request: NextRequest): Promise<{ id: number; username: string }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  return { id: payload.sub, username: payload.username };
}

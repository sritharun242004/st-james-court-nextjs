import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';

const encoder = new TextEncoder();

// Auth failures that should map to HTTP 401 (expired/invalid token, missing header).
export class AuthError extends Error {
  status = 401 as const;
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// --- Password hashing (PBKDF2 via Web Crypto — Edge-compatible) ---

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const saltHex = Buffer.from(salt).toString('hex');
  const hashHex = Buffer.from(hash).toString('hex');
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return Buffer.from(hash).toString('hex') === hashHex;
}

// --- JWT ---

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return encoder.encode(secret);
}

// Admin sessions are long-lived (1 year) so occasional admins are not forced to
// re-login on every visit. If a token is ever leaked, rotate JWT_SECRET to
// invalidate all existing tokens immediately.
const TOKEN_TTL = '365d';

export async function signToken(payload: { sub: number; username: string }): Promise<string> {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(payload.sub))
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ sub: number; username: string }> {
  let payload;
  try {
    ({ payload } = await jwtVerify(token, getSecret()));
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      throw new AuthError('Your session has expired. Please sign in again.');
    }
    if (err instanceof joseErrors.JOSEError) {
      throw new AuthError('Invalid session. Please sign in again.');
    }
    throw err;
  }
  return {
    sub: Number(payload.sub),
    username: payload.username as string,
  };
}

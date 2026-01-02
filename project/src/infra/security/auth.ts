import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getServerEnv } from '@/config/env';
import bcrypt from 'bcryptjs';

/**
 * Authentication and authorization utilities
 * Server-only module for handling JWT tokens and session management
 */

export interface SessionPayload {
  userId: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
}

/**
 * Session configuration
 */
const SESSION_CONFIG = {
  cookieName: 'admin_session',
  expirationHours: 24,
  algorithm: 'HS256' as const,
} as const;

/**
 * Creates a JWT token for an admin session
 * @param userId - User identifier
 * @returns Signed JWT token
 */
export async function createSessionToken(userId: string): Promise<string> {
  const env = getServerEnv();
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_CONFIG.expirationHours * 3600;

  const payload: SessionPayload = {
    userId,
    role: 'admin',
    issuedAt: now,
    expiresAt,
  };

  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: SESSION_CONFIG.algorithm })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(secret);

  return token;
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Decoded session payload
 * @throws {Error} If token is invalid or expired
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload> {
  const env = getServerEnv();
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [SESSION_CONFIG.algorithm],
    });

    // Cast through unknown to satisfy TypeScript
    return payload as unknown as SessionPayload;
  } catch (error) {
    throw new Error('Invalid or expired session token');
  }
}

/**
 * Gets the current session from cookies
 * @returns Session payload if valid, null otherwise
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Checks if the current user is authenticated as admin
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null && session.role === 'admin';
}

/**
 * Verifies a password against the stored hash
 * @param password - Plain text password
 * @param hash - Bcrypt hash to compare against
 * @returns true if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Guard function for admin routes
 * Throws an error if not authenticated
 * @throws {Error} If not authenticated
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized: No valid session');
  }

  return session;
}

/**
 * Session cookie configuration
 */
export function getSessionCookieOptions(token: string) {
  return {
    name: SESSION_CONFIG.cookieName,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_CONFIG.expirationHours * 3600,
    path: '/',
  };
}

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { timingSafeCompare, sanitizeInput } from './security';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// For enhanced security, you can pre-hash the password
// Run this once: const hash = await bcrypt.hash('your_password', 12);
// Then set ADMIN_PASSWORD_HASH in .env
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function verifyPassword(password: string): Promise<boolean> {
  // Sanitize input to prevent injection attacks
  const sanitized = sanitizeInput(password);

  // If using hashed password (recommended for production)
  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(sanitized, ADMIN_PASSWORD_HASH);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  // Fallback to plain text comparison with timing-safe comparison
  // This prevents timing attacks that could reveal password length
  return timingSafeCompare(sanitized, ADMIN_PASSWORD);
}

export async function createToken(metadata?: {
  ip?: string;
  userAgent?: string;
}): Promise<string> {
  const token = await new SignJWT({
    admin: true,
    ip: metadata?.ip,
    userAgent: metadata?.userAgent,
    sessionId: crypto.randomUUID(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .setJti(crypto.randomUUID()) // Unique token ID
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(
  token: string,
  options?: { validateIp?: string; validateUserAgent?: string }
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Additional security: Validate IP and User-Agent haven't changed
    // This prevents session hijacking
    if (options?.validateIp && payload.ip && payload.ip !== options.validateIp) {
      console.warn('Session IP mismatch - possible session hijacking attempt');
      return false;
    }

    if (
      options?.validateUserAgent &&
      payload.userAgent &&
      payload.userAgent !== options.validateUserAgent
    ) {
      console.warn('Session User-Agent mismatch - possible session hijacking attempt');
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function getSession(request?: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');

  if (!token) {
    return false;
  }

  // Enhanced validation with IP and User-Agent checking
  const options: { validateIp?: string; validateUserAgent?: string } = {};

  if (request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    if (forwarded || realIp) {
      options.validateIp = forwarded ? forwarded.split(',')[0].trim() : realIp || undefined;
    }

    if (userAgent) {
      options.validateUserAgent = userAgent;
    }
  }

  return verifyToken(token.value, options);
}

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true, // Prevents XSS attacks from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}

// Utility function to hash a password (for generating ADMIN_PASSWORD_HASH)
export async function hashPasswordForEnv(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

import crypto from 'crypto';

class DisabledLimiter {
  async consume(_key?: string): Promise<void> {
    return undefined;
  }
}

export const loginRateLimiter = new DisabledLimiter();
export const loginRateLimiterByIP = new DisabledLimiter();
export const apiRateLimiter = new DisabledLimiter();

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const failedAttempts = new Map<string, FailedLoginAttempt>();

export function trackFailedLogin(identifier: string): void {
  const now = Date.now();
  const attempt = failedAttempts.get(identifier) || { count: 0, lastAttempt: now };

  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    attempt.count = 0;
  }

  attempt.count += 1;
  attempt.lastAttempt = now;

  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 30 * 60 * 1000;
  }

  failedAttempts.set(identifier, attempt);
}

export function isBlocked(identifier: string): boolean {
  const attempt = failedAttempts.get(identifier);

  if (!attempt?.blockedUntil) {
    return false;
  }

  if (Date.now() < attempt.blockedUntil) {
    return true;
  }

  failedAttempts.delete(identifier);
  return false;
}

export function clearFailedAttempts(identifier: string): void {
  failedAttempts.delete(identifier);
}

export function timingSafeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    const dummyA = crypto.randomBytes(32);
    const dummyB = crypto.randomBytes(32);
    crypto.timingSafeEqual(dummyA, dummyB);
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return timingSafeCompare(computed, hash);
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return realIp || 'unknown';
}

export interface AuditLog {
  timestamp: string;
  event: string;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

const auditLogs: AuditLog[] = [];
const MAX_LOGS = 1000;

export function logAuditEvent(log: AuditLog): void {
  auditLogs.unshift(log);

  if (auditLogs.length > MAX_LOGS) {
    auditLogs.pop();
  }
}

export function getAuditLogs(limit = 100): AuditLog[] {
  return auditLogs.slice(0, limit);
}

export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.emailjs.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) errors.push('Password must be at least 12 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');

  return {
    valid: errors.length === 0,
    errors,
  };
}

const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

export function generateCsrfToken(sessionId: string): string {
  const token = generateSecureToken(32);
  const expiresAt = Date.now() + 60 * 60 * 1000;
  csrfTokens.set(sessionId, { token, expiresAt });
  cleanupExpiredCsrfTokens();
  return token;
}

export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    csrfTokens.delete(sessionId);
    return false;
  }

  return timingSafeCompare(stored.token, token);
}

function cleanupExpiredCsrfTokens(): void {
  const now = Date.now();

  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(sessionId);
    }
  }
}

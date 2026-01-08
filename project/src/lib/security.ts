import { RateLimiterMemory } from 'rate-limiter-flexible';
import crypto from 'crypto';

// Rate limiters
export const loginRateLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 15 * 60, // Per 15 minutes
  blockDuration: 30 * 60, // Block for 30 minutes after exceeding
});

export const loginRateLimiterByIP = new RateLimiterMemory({
  points: 10, // Number of attempts per IP
  duration: 15 * 60, // Per 15 minutes
  blockDuration: 60 * 60, // Block for 1 hour
});

export const apiRateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per minute
});

// Failed login tracking
interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const failedAttempts = new Map<string, FailedLoginAttempt>();

export function trackFailedLogin(identifier: string): void {
  const now = Date.now();
  const attempt = failedAttempts.get(identifier) || { count: 0, lastAttempt: now };

  // Reset count if last attempt was more than 15 minutes ago
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    attempt.count = 0;
  }

  attempt.count++;
  attempt.lastAttempt = now;

  // Block after 5 failed attempts
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 30 * 60 * 1000; // Block for 30 minutes
  }

  failedAttempts.set(identifier, attempt);
}

export function isBlocked(identifier: string): boolean {
  const attempt = failedAttempts.get(identifier);
  if (!attempt || !attempt.blockedUntil) return false;

  const now = Date.now();
  if (now < attempt.blockedUntil) {
    return true;
  }

  // Unblock if time has passed
  failedAttempts.delete(identifier);
  return false;
}

export function clearFailedAttempts(identifier: string): void {
  failedAttempts.delete(identifier);
}

// Timing-safe string comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Use crypto.timingSafeEqual on dummy strings of same length
    // to maintain constant time even when lengths differ
    const dummyA = crypto.randomBytes(32).toString('hex');
    const dummyB = crypto.randomBytes(32).toString('hex');
    crypto.timingSafeEqual(Buffer.from(dummyA), Buffer.from(dummyB));
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Generate cryptographically secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Hash password with bcrypt (for future use)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12; // Higher = more secure but slower
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// Audit logging
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

  // Keep only last 1000 logs in memory
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.pop();
  }

  // In production, you'd write these to a file or database
  console.log('[AUDIT]', JSON.stringify(log));
}

export function getAuditLogs(limit: number = 100): AuditLog[] {
  return auditLogs.slice(0, limit);
}

// Security headers
export const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://formspree.io https://api.github.com https://api.emailjs.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

// Password strength validator
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common passwords
  const commonPasswords = ['password', 'admin123', '12345678', 'qwerty123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// CSRF token generation and validation
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

export function generateCsrfToken(sessionId: string): string {
  const token = generateSecureToken(32);
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  csrfTokens.set(sessionId, { token, expiresAt });

  // Cleanup expired tokens
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

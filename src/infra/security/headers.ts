/**
 * Security headers utilities
 * Centralized configuration for HTTP security headers following OWASP best practices
 */

export interface SecurityHeadersConfig {
  /** Environment (affects HSTS and other production-only headers) */
  environment: 'development' | 'production' | 'test';
  /** Additional CSP directives to merge */
  additionalCSP?: string[];
  /** Whether to enable strict CSP (may break some functionality) */
  strictCSP?: boolean;
}

/**
 * Generates Content Security Policy header value
 * Follows OWASP recommendations with sensible defaults
 */
export function buildCSP(config: SecurityHeadersConfig): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // TODO: Remove unsafe-eval in production with proper bundling
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind and Framer Motion
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://formspree.io https://api.github.com https://api.emailjs.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  if (config.additionalCSP) {
    directives.push(...config.additionalCSP);
  }

  return directives.join('; ');
}

/**
 * Generates all security headers as a Headers object
 * Safe to use in both Next.js middleware and API routes
 */
export function getSecurityHeaders(config: SecurityHeadersConfig): Headers {
  const headers = new Headers();

  // Content Security Policy
  headers.set('Content-Security-Policy', buildCSP(config));

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (restrict features)
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HSTS (production only)
  if (config.environment === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return headers;
}

/**
 * Converts Headers object to plain object for Next.js response
 */
export function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Backwards compatible security headers as plain object
 * Use this in API routes: NextResponse.json(data, { headers: securityHeaders })
 */
export const securityHeaders: Record<string, string> = headersToObject(
  getSecurityHeaders({ environment: process.env.NODE_ENV as any || 'development' })
);

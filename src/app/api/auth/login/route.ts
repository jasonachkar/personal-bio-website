import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createToken, setSession } from '@/lib/auth';
import {
  loginRateLimiter,
  loginRateLimiterByIP,
  trackFailedLogin,
  isBlocked,
  clearFailedAttempts,
  getClientIp,
  logAuditEvent,
  sanitizeInput,
  securityHeaders,
} from '@/lib/security';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Get client identifiers
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Check if IP or session is blocked due to failed attempts
    if (isBlocked(ip)) {
      logAuditEvent({
        timestamp: new Date().toISOString(),
        event: 'LOGIN_ATTEMPT_BLOCKED',
        ip,
        userAgent,
        success: false,
        details: 'Too many failed attempts - IP blocked',
      });

      return NextResponse.json(
        {
          error: 'Too many failed login attempts. Please try again in 30 minutes.',
        },
        { status: 429, headers: securityHeaders }
      );
    }

    // Rate limiting by IP
    try {
      await loginRateLimiterByIP.consume(ip);
    } catch (rateLimiterRes) {
      logAuditEvent({
        timestamp: new Date().toISOString(),
        event: 'RATE_LIMIT_EXCEEDED',
        ip,
        userAgent,
        success: false,
        details: 'IP-based rate limit exceeded',
      });

      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
        },
        { status: 429, headers: securityHeaders }
      );
    }

    const body = await request.json();
    const { password, honeypot } = body;

    // Honeypot field - if filled, it's a bot
    if (honeypot) {
      logAuditEvent({
        timestamp: new Date().toISOString(),
        event: 'BOT_DETECTED',
        ip,
        userAgent,
        success: false,
        details: 'Honeypot field filled',
      });

      // Return fake success to fool bots
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true }, { headers: securityHeaders });
    }

    // Validate password field exists
    if (!password || typeof password !== 'string') {
      trackFailedLogin(ip);

      logAuditEvent({
        timestamp: new Date().toISOString(),
        event: 'LOGIN_FAILED',
        ip,
        userAgent,
        success: false,
        details: 'Missing password field',
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Sanitize input
    const sanitizedPassword = sanitizeInput(password);

    // Verify password
    const isValid = await verifyPassword(sanitizedPassword);

    // Always take minimum time to prevent timing attacks
    const elapsed = Date.now() - startTime;
    const minTime = 1000; // 1 second minimum
    if (elapsed < minTime) {
      await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
    }

    if (!isValid) {
      trackFailedLogin(ip);

      logAuditEvent({
        timestamp: new Date().toISOString(),
        event: 'LOGIN_FAILED',
        ip,
        userAgent,
        success: false,
        details: 'Invalid password',
      });

      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Successful login - clear failed attempts
    clearFailedAttempts(ip);

    // Create session token with metadata
    const token = await createToken({ ip, userAgent });
    await setSession(token);

    logAuditEvent({
      timestamp: new Date().toISOString(),
      event: 'LOGIN_SUCCESS',
      ip,
      userAgent,
      success: true,
      details: 'Admin logged in successfully',
    });

    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch (error) {
    console.error('Login error:', error);

    logAuditEvent({
      timestamp: new Date().toISOString(),
      event: 'LOGIN_ERROR',
      ip,
      userAgent,
      success: false,
      details: 'Internal server error',
    });

    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500, headers: securityHeaders }
    );
  }
}

// Add security headers to OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: securityHeaders,
  });
}

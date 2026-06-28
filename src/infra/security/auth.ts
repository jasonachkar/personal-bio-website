export interface SessionPayload {
  userId: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
}

export async function createSessionToken(): Promise<string> {
  throw new Error('Admin authentication is disabled on the static portfolio.');
}

export async function verifySessionToken(): Promise<SessionPayload> {
  throw new Error('Admin authentication is disabled on the static portfolio.');
}

export async function getSession(): Promise<SessionPayload | null> {
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}

export async function verifyPassword(): Promise<boolean> {
  return false;
}

export async function requireAuth(): Promise<SessionPayload> {
  throw new Error('Admin authentication is disabled on the static portfolio.');
}

export function getSessionCookieOptions(token: string) {
  return {
    name: 'admin_session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}

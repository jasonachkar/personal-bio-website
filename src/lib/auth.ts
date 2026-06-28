export async function verifyPassword(_password?: string): Promise<boolean> {
  return false;
}

export async function createToken(_metadata?: unknown): Promise<string> {
  return '';
}

export async function verifyToken(_token?: string): Promise<boolean> {
  return false;
}

export async function getSession(_request?: Request): Promise<boolean> {
  return false;
}

export async function setSession(_token?: string) {
  return undefined;
}

export async function clearSession() {
  return undefined;
}

export async function hashPasswordForEnv(): Promise<string> {
  throw new Error('Admin authentication is disabled on the static portfolio.');
}

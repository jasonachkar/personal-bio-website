import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthenticated = await getSession();
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

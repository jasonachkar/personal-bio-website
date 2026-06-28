import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAuditLogs, securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await getSession(request);

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');

    // Get audit logs
    const logs = getAuditLogs(Math.min(limit, 1000)); // Max 1000 logs

    return NextResponse.json(
      {
        logs,
        total: logs.length,
      },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

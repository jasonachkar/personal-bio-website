import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const scanResultsPath = join(process.cwd(), '../content/devsecops/scan-results.json');
    const fileContents = readFileSync(scanResultsPath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(
      data,
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error loading DevSecOps scan results:', error);
    return NextResponse.json(
      { error: 'Failed to load scan results' },
      { status: 500, headers: securityHeaders }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Read architecture data from JSON file
    const filePath = join(process.cwd(), '../content/azure/architecture.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const architecture = JSON.parse(fileContents);

    return NextResponse.json(architecture, { headers: securityHeaders });
  } catch (error) {
    console.error('Error loading Azure architecture:', error);
    return NextResponse.json(
      { error: 'Failed to load Azure architecture data' },
      { status: 500, headers: securityHeaders }
    );
  }
}

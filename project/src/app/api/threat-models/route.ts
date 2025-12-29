import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const templatePath = join(process.cwd(), '../content/threat-models/web-app.json');
    const fileContents = readFileSync(templatePath, 'utf8');
    const template = JSON.parse(fileContents);

    return NextResponse.json(
      { template },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error loading threat model template:', error);
    return NextResponse.json(
      { error: 'Failed to load threat model template' },
      { status: 500, headers: securityHeaders }
    );
  }
}

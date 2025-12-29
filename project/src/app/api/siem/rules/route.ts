import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { detectionRulesSchema } from '@/lib/schemas';
import { securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Read rules from JSON file
    const filePath = join(process.cwd(), '../content/siem/rules.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const rules = JSON.parse(fileContents);

    // Validate with Zod
    const validatedRules = detectionRulesSchema.parse(rules);

    return NextResponse.json(
      { rules: validatedRules, total: validatedRules.length },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error loading SIEM rules:', error);
    return NextResponse.json(
      { error: 'Failed to load rules' },
      { status: 500, headers: securityHeaders }
    );
  }
}

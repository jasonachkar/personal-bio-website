import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { siemEventsSchema } from '@/lib/schemas';
import { securityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Read events from JSON file
    const filePath = join(process.cwd(), '../content/siem/events.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const events = JSON.parse(fileContents);

    // Validate with Zod
    const validatedEvents = siemEventsSchema.parse(events);

    return NextResponse.json(
      { events: validatedEvents, total: validatedEvents.length },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error loading SIEM events:', error);
    return NextResponse.json(
      { error: 'Failed to load events' },
      { status: 500, headers: securityHeaders }
    );
  }
}

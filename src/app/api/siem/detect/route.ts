import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DetectionEngine } from '@/features/siem/lib/detectionEngine';
import { securityHeaders } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Load events and rules
    const eventsPath = join(process.cwd(), '../content/siem/events.json');
    const rulesPath = join(process.cwd(), '../content/siem/rules.json');

    const events = JSON.parse(readFileSync(eventsPath, 'utf8'));
    const rules = JSON.parse(readFileSync(rulesPath, 'utf8'));

    // Run detection engine
    const engine = new DetectionEngine(events, rules);
    const detections = engine.runDetections();
    const stats = engine.getDetectionStats(detections);

    return NextResponse.json(
      {
        detections,
        stats,
        timestamp: new Date().toISOString(),
      },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error('Error running detections:', error);
    return NextResponse.json(
      { error: 'Failed to run detections' },
      { status: 500, headers: securityHeaders }
    );
  }
}

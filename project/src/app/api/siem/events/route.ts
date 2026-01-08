import { NextRequest } from 'next/server';
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { siemEventsSchema } from '@/lib/schemas';

/**
 * GET /api/siem/events
 *
 * Returns all SIEM security events from the content repository.
 * Events are validated against the schema and cached for performance.
 *
 * @returns JSON response with events array and total count
 */
export async function GET(request: NextRequest) {
  try {
    const events = loadContent('siem/events.json', siemEventsSchema);

    return jsonResponse({
      events,
      total: events.length,
    });
  } catch (error) {
    return errorResponse('Failed to load SIEM events', {
      status: 500,
      code: 'SIEM_EVENTS_LOAD_ERROR',
      logError: error,
    });
  }
}

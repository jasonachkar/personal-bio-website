import { NextRequest } from 'next/server';
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { detectionRulesSchema } from '@/lib/schemas';

/**
 * GET /api/siem/rules
 *
 * Returns all SIEM detection rules from the content repository.
 * Rules are validated against the schema and cached for performance.
 *
 * @returns JSON response with rules array and total count
 */
export async function GET(request: NextRequest) {
  try {
    const rules = loadContent('siem/rules.json', detectionRulesSchema);

    return jsonResponse({
      rules,
      total: rules.length,
    });
  } catch (error) {
    return errorResponse('Failed to load SIEM detection rules', {
      status: 500,
      code: 'SIEM_RULES_LOAD_ERROR',
      logError: error,
    });
  }
}

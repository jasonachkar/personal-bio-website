import { NextRequest } from 'next/server';
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { threatModelTemplateSchema } from '@/lib/schemas';

/**
 * GET /api/threat-models
 *
 * Returns threat model template for web application architecture.
 * Includes STRIDE analysis, components, and MITRE ATT&CK mappings.
 * Data is validated against the schema and cached for performance.
 *
 * @returns JSON response with threat model template
 */
export async function GET(request: NextRequest) {
  try {
    const template = loadContent('threat-models/web-app.json', threatModelTemplateSchema);

    return jsonResponse({ template });
  } catch (error) {
    return errorResponse('Failed to load threat model template', {
      status: 500,
      code: 'THREAT_MODEL_LOAD_ERROR',
      logError: error,
    });
  }
}

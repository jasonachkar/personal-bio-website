import { NextRequest } from 'next/server';
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { azureArchitectureSchema } from '@/lib/schemas';

/**
 * GET /api/azure
 *
 * Returns Azure architecture components with security controls and best practices.
 * Data is validated against the schema and cached for performance.
 *
 * @returns JSON response with Azure architecture data
 */
export async function GET(request: NextRequest) {
  try {
    const architecture = loadContent('azure/architecture.json', azureArchitectureSchema);

    return jsonResponse({ architecture });
  } catch (error) {
    return errorResponse('Failed to load Azure architecture', {
      status: 500,
      code: 'AZURE_ARCHITECTURE_LOAD_ERROR',
      logError: error,
    });
  }
}

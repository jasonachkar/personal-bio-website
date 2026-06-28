import { NextRequest, NextResponse } from 'next/server';
import { getMitreTechniques, getMitreTactics, getTechniqueDetails } from '@/features/threat-modeling/utils/mitreAttackApi';

/**
 * GET /api/threat-modeling/mitre
 * 
 * Fetch MITRE ATT&CK data
 * Query params:
 * - platform: Platform to filter techniques (default: enterprise)
 * - techniqueId: Get specific technique details
 * - tactics: Get all tactics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') || 'enterprise';
    const techniqueId = searchParams.get('techniqueId');
    const tactics = searchParams.get('tactics') === 'true';

    if (tactics) {
      const tacticsData = await getMitreTactics();
      return NextResponse.json({ tactics: tacticsData });
    }

    if (techniqueId) {
      const techniqueDetails = await getTechniqueDetails(techniqueId);
      return NextResponse.json({ technique: techniqueDetails });
    }

    const techniques = await getMitreTechniques(platform);
    return NextResponse.json({ techniques });
  } catch (error) {
    console.error('MITRE API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MITRE ATT&CK data' },
      { status: 500 }
    );
  }
}


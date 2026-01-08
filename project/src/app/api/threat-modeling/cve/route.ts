import { NextRequest, NextResponse } from 'next/server';
import { getCVEsForTechnology, getCVEById } from '@/features/threat-modeling/utils/cveApi';

/**
 * GET /api/threat-modeling/cve
 * 
 * Fetch CVE data
 * Query params:
 * - technology: Technology to search CVEs for
 * - cveId: Get specific CVE details
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const technology = searchParams.get('technology');
    const cveId = searchParams.get('cveId');

    if (cveId) {
      const cveDetails = await getCVEById(cveId);
      return NextResponse.json({ cve: cveDetails });
    }

    if (technology) {
      const cves = await getCVEsForTechnology(technology);
      return NextResponse.json({ cves });
    }

    return NextResponse.json(
      { error: 'Either technology or cveId parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CVE API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVE data' },
      { status: 500 }
    );
  }
}


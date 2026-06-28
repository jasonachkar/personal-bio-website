import { NextRequest, NextResponse } from 'next/server';
import { getCloudSecurityFindings, getComplianceStatus } from '@/features/threat-modeling/utils/cloudSecurityApi';
import type { CloudProvider } from '@/features/threat-modeling/types';

/**
 * GET /api/threat-modeling/cloud-security
 * 
 * Fetch cloud security findings and compliance status
 * Query params:
 * - provider: Cloud provider (aws, azure, gcp)
 * - compliance: Get compliance status (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider') as CloudProvider;
    const compliance = searchParams.get('compliance') === 'true';

    if (!provider || !['aws', 'azure', 'gcp'].includes(provider)) {
      return NextResponse.json(
        { error: 'Valid provider (aws, azure, gcp) is required' },
        { status: 400 }
      );
    }

    if (compliance) {
      const complianceStatus = await getComplianceStatus(provider);
      return NextResponse.json({ compliance: complianceStatus });
    }

    const config = {
      provider,
      region: searchParams.get('region') || undefined,
      accountId: searchParams.get('accountId') || undefined,
    };

    const findings = await getCloudSecurityFindings(provider, config);
    return NextResponse.json({ findings });
  } catch (error) {
    console.error('Cloud security API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cloud security data' },
      { status: 500 }
    );
  }
}


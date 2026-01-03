import type { CVE, CVEDetails, ThreatModelComponent } from '../types';

const NVD_API_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cveCache = new Map<string, CacheEntry<CVE[]>>();
const cveDetailsCache = new Map<string, CacheEntry<CVEDetails>>();

/**
 * Fetch CVEs for a specific technology
 */
export async function getCVEsForTechnology(tech: string): Promise<CVE[]> {
  try {
    const cacheKey = `cve-${tech.toLowerCase()}`;
    const cached = cveCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // NVD API requires API key for higher rate limits, but we can use keyword search
    // For demo purposes, we'll use a simplified approach
    const response = await fetch(
      `${NVD_API_BASE}?keywordSearch=${encodeURIComponent(tech)}&resultsPerPage=20`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch CVE data');
    }

    const data = await response.json();
    const cves: CVE[] = (data.vulnerabilities || []).map((vuln: any) => {
      const cve = vuln.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0];
      const baseScore = metrics?.cvssData?.baseScore || 0;
      
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (baseScore >= 9.0) severity = 'critical';
      else if (baseScore >= 7.0) severity = 'high';
      else if (baseScore >= 4.0) severity = 'medium';

      return {
        id: cve.id,
        description: cve.descriptions?.find((d: any) => d.lang === 'en')?.value || 'No description available',
        cvssScore: baseScore,
        cvssVector: metrics?.cvssData?.vectorString,
        severity,
        publishedDate: cve.published || new Date().toISOString(),
        affectedTechnologies: extractTechnologies(cve),
        references: cve.references?.map((ref: any) => ref.url) || [],
      };
    });

    cveCache.set(cacheKey, { data: cves, timestamp: Date.now() });
    return cves;
  } catch (error) {
    console.error('Error fetching CVEs:', error);
    // Return fallback data
    return getFallbackCVEs(tech);
  }
}

/**
 * Get detailed information about a specific CVE
 */
export async function getCVEById(cveId: string): Promise<CVEDetails> {
  try {
    const cacheKey = `cve-details-${cveId}`;
    const cached = cveDetailsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await fetch(`${NVD_API_BASE}?cveId=${cveId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CVE details');
    }

    const data = await response.json();
    const vuln = data.vulnerabilities?.[0]?.cve;
    if (!vuln) {
      throw new Error('CVE not found');
    }

    const metrics = vuln.metrics?.cvssMetricV31?.[0] || vuln.metrics?.cvssMetricV30?.[0] || vuln.metrics?.cvssMetricV2?.[0];
    const baseScore = metrics?.cvssData?.baseScore || 0;
    
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (baseScore >= 9.0) severity = 'critical';
    else if (baseScore >= 7.0) severity = 'high';
    else if (baseScore >= 4.0) severity = 'medium';

    const details: CVEDetails = {
      id: vuln.id,
      description: vuln.descriptions?.find((d: any) => d.lang === 'en')?.value || 'No description available',
      cvssScore: baseScore,
      cvssVector: metrics?.cvssData?.vectorString,
      severity,
      publishedDate: vuln.published || new Date().toISOString(),
      affectedTechnologies: extractTechnologies(vuln),
      references: vuln.references?.map((ref: any) => ref.url) || [],
      cweId: vuln.weaknesses?.[0]?.description?.[0]?.value,
      affectedVersions: extractVersions(vuln),
      remediation: 'Apply security updates and patches as recommended by the vendor.',
    };

    cveDetailsCache.set(cacheKey, { data: details, timestamp: Date.now() });
    return details;
  } catch (error) {
    console.error('Error fetching CVE details:', error);
    return getFallbackCVEDetails(cveId);
  }
}

/**
 * Map component to related CVEs
 */
export function mapComponentToCVEs(component: ThreatModelComponent): CVE[] {
  const technologies: string[] = [];
  
  // Extract technology from metadata
  if (component.metadata?.technology) {
    technologies.push(component.metadata.technology);
  }
  
  // Extract from name and description
  const text = `${component.name} ${component.description}`.toLowerCase();
  
  // Common technology patterns
  if (text.includes('aws') || text.includes('amazon')) technologies.push('AWS');
  if (text.includes('azure') || text.includes('microsoft')) technologies.push('Azure');
  if (text.includes('gcp') || text.includes('google cloud')) technologies.push('GCP');
  if (text.includes('kubernetes') || text.includes('k8s')) technologies.push('Kubernetes');
  if (text.includes('docker')) technologies.push('Docker');
  if (text.includes('nginx')) technologies.push('Nginx');
  if (text.includes('apache')) technologies.push('Apache');
  if (text.includes('node') || text.includes('nodejs')) technologies.push('Node.js');
  if (text.includes('python')) technologies.push('Python');
  if (text.includes('java')) technologies.push('Java');
  if (text.includes('mysql')) technologies.push('MySQL');
  if (text.includes('postgres')) technologies.push('PostgreSQL');
  if (text.includes('redis')) technologies.push('Redis');
  if (text.includes('mongodb')) technologies.push('MongoDB');
  if (text.includes('s3')) technologies.push('AWS S3');
  if (text.includes('lambda')) technologies.push('AWS Lambda');
  if (text.includes('rds')) technologies.push('AWS RDS');
  if (text.includes('iam')) technologies.push('AWS IAM');

  // Return empty array - actual CVE fetching should be done async
  return [];
}

/**
 * Extract technologies from CVE data
 */
function extractTechnologies(cve: any): string[] {
  const technologies: string[] = [];
  const configs = cve.configurations || [];
  
  configs.forEach((config: any) => {
    config.nodes?.forEach((node: any) => {
      node.cpeMatch?.forEach((match: any) => {
        if (match.criteria) {
          const parts = match.criteria.split(':');
          if (parts.length > 3) {
            technologies.push(parts[3]);
          }
        }
      });
    });
  });

  return [...new Set(technologies)];
}

/**
 * Extract affected versions from CVE data
 */
function extractVersions(cve: any): string[] {
  const versions: string[] = [];
  const configs = cve.configurations || [];
  
  configs.forEach((config: any) => {
    config.nodes?.forEach((node: any) => {
      node.cpeMatch?.forEach((match: any) => {
        if (match.versionStartIncluding) {
          versions.push(`>= ${match.versionStartIncluding}`);
        }
        if (match.versionEndExcluding) {
          versions.push(`< ${match.versionEndExcluding}`);
        }
      });
    });
  });

  return versions;
}

/**
 * Fallback CVEs if API fails
 */
function getFallbackCVEs(tech: string): CVE[] {
  return [
    {
      id: 'CVE-2024-XXXXX',
      description: `Example vulnerability in ${tech}. This is fallback data when the CVE API is unavailable.`,
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      severity: 'high',
      publishedDate: new Date().toISOString(),
      affectedTechnologies: [tech],
      references: [],
    },
  ];
}

function getFallbackCVEDetails(cveId: string): CVEDetails {
  return {
    id: cveId,
    description: 'CVE details not available. This is fallback data.',
    severity: 'medium',
    publishedDate: new Date().toISOString(),
    affectedTechnologies: [],
    references: [],
    remediation: 'Apply security updates as recommended.',
  };
}


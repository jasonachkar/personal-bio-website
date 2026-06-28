import type { MitreTactic, MitreTechnique, MitreTechniqueDetails, MitreMapping, Threat } from '../types';

const MITRE_ATTACK_API_BASE = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const techniqueCache = new Map<string, CacheEntry<MitreTechnique | MitreTechniqueDetails>>();
const tacticCache = new Map<string, CacheEntry<MitreTactic[]>>();

/**
 * Fetch MITRE ATT&CK techniques for a platform
 */
export async function getMitreTechniques(platform: string = 'enterprise'): Promise<MitreTechnique[]> {
  try {
    const cacheKey = `techniques-${platform}`;
    const cached = techniqueCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Object.values(cached.data) as MitreTechnique[];
    }

    // Use MITRE CTI GitHub repository
    const response = await fetch(`${MITRE_ATTACK_API_BASE}/technique/techniques.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch MITRE ATT&CK techniques');
    }

    const data = await response.json();
    const techniques: MitreTechnique[] = data.objects
      .filter((obj: any) => obj.type === 'attack-pattern' && obj.x_mitre_platforms?.includes(platform))
      .map((obj: any) => ({
        id: obj.external_references?.find((ref: any) => ref.source_name === 'mitre-attack')?.external_id || obj.id,
        name: obj.name,
        description: obj.description || '',
        tactics: obj.kill_chain_phases?.map((phase: any) => phase.phase_name) || [],
        platforms: obj.x_mitre_platforms || [],
        kill_chain_phases: obj.kill_chain_phases?.map((phase: any) => phase.phase_name),
        detection: obj.x_mitre_detection || [],
        mitigation: obj.x_mitre_mitigation || [],
        url: obj.external_references?.find((ref: any) => ref.source_name === 'mitre-attack')?.url || '',
        subtechniques: obj.relationship?.filter((rel: any) => rel.relationship_type === 'subtechnique-of')
          .map((rel: any) => ({
            id: rel.target_ref,
            name: rel.description || '',
            description: '',
            tactics: [],
            platforms: [],
          })),
      }));

    // Cache individual techniques
    techniques.forEach(tech => {
      techniqueCache.set(tech.id, { data: tech, timestamp: Date.now() });
    });

    return techniques;
  } catch (error) {
    console.error('Error fetching MITRE techniques:', error);
    // Return fallback data
    return getFallbackTechniques();
  }
}

/**
 * Fetch MITRE ATT&CK tactics
 */
export async function getMitreTactics(): Promise<MitreTactic[]> {
  try {
    const cacheKey = 'tactics';
    const cached = tacticCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await fetch(`${MITRE_ATTACK_API_BASE}/tactic/tactics.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch MITRE ATT&CK tactics');
    }

    const data = await response.json();
    const tactics: MitreTactic[] = data.objects
      .filter((obj: any) => obj.type === 'x-mitre-tactic')
      .map((obj: any) => ({
        id: obj.external_references?.find((ref: any) => ref.source_name === 'mitre-attack')?.external_id || obj.id,
        name: obj.name,
        description: obj.description || '',
        url: obj.external_references?.find((ref: any) => ref.source_name === 'mitre-attack')?.url || '',
        techniques: [],
      }));

    tacticCache.set(cacheKey, { data: tactics, timestamp: Date.now() });
    return tactics;
  } catch (error) {
    console.error('Error fetching MITRE tactics:', error);
    return getFallbackTactics();
  }
}

/**
 * Get detailed information about a specific technique
 */
export async function getTechniqueDetails(techniqueId: string): Promise<MitreTechniqueDetails> {
  try {
    const cacheKey = `technique-${techniqueId}`;
    const cached = techniqueCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL && 'examples' in cached.data) {
      return cached.data as MitreTechniqueDetails;
    }

    // Try to fetch from cache first, then API
    const techniques = await getMitreTechniques();
    const technique = techniques.find(t => t.id === techniqueId);

    if (!technique) {
      throw new Error(`Technique ${techniqueId} not found`);
    }

    const details: MitreTechniqueDetails = {
      ...technique,
      examples: [],
      detection: technique.detection?.map((desc: string) => ({ description: desc, name: 'Detection' })) || [],
      mitigation: technique.mitigation?.map((desc: string) => ({ description: desc, name: 'Mitigation' })) || [],
    };

    techniqueCache.set(cacheKey, { data: details, timestamp: Date.now() });
    return details;
  } catch (error) {
    console.error('Error fetching technique details:', error);
    return getFallbackTechniqueDetails(techniqueId);
  }
}

/**
 * Map a threat to MITRE ATT&CK techniques
 */
export function mapThreatToMitre(threat: Threat): MitreMapping {
  const mapping: MitreMapping = {
    tactics: [],
    techniques: [],
  };

  // Map STRIDE categories to MITRE tactics
  const strideToMitre: Record<string, string[]> = {
    'spoofing': ['Initial Access', 'Persistence', 'Privilege Escalation'],
    'tampering': ['Defense Evasion', 'Impact'],
    'repudiation': ['Defense Evasion'],
    'information-disclosure': ['Collection', 'Exfiltration'],
    'denial-of-service': ['Impact'],
    'elevation-of-privilege': ['Privilege Escalation'],
  };

  mapping.tactics = strideToMitre[threat.category] || [];

  // Map common threat patterns to techniques
  if (threat.title.toLowerCase().includes('injection')) {
    mapping.techniques.push('T1055', 'T1059');
  }
  if (threat.title.toLowerCase().includes('authentication')) {
    mapping.techniques.push('T1078', 'T1110');
  }
  if (threat.title.toLowerCase().includes('access control')) {
    mapping.techniques.push('T1078', 'T1134');
  }
  if (threat.title.toLowerCase().includes('data exposure')) {
    mapping.techniques.push('T1040', 'T1530');
  }

  return mapping;
}

/**
 * Fallback techniques if API fails
 */
function getFallbackTechniques(): MitreTechnique[] {
  return [
    {
      id: 'T1055',
      name: 'Process Injection',
      description: 'Adversaries may inject code into processes in order to evade process-based defenses',
      tactics: ['Defense Evasion', 'Privilege Escalation'],
      platforms: ['Windows', 'Linux', 'macOS'],
      url: 'https://attack.mitre.org/techniques/T1055',
    },
    {
      id: 'T1078',
      name: 'Valid Accounts',
      description: 'Adversaries may obtain and abuse credentials of existing accounts',
      tactics: ['Defense Evasion', 'Persistence', 'Privilege Escalation', 'Initial Access'],
      platforms: ['Windows', 'Linux', 'macOS', 'AWS', 'Azure', 'GCP'],
      url: 'https://attack.mitre.org/techniques/T1078',
    },
    {
      id: 'T1110',
      name: 'Brute Force',
      description: 'Adversaries may use brute force techniques to gain access to accounts',
      tactics: ['Credential Access'],
      platforms: ['Windows', 'Linux', 'macOS', 'AWS', 'Azure', 'GCP'],
      url: 'https://attack.mitre.org/techniques/T1110',
    },
  ];
}

function getFallbackTactics(): MitreTactic[] {
  return [
    { id: 'TA0001', name: 'Initial Access', description: 'The adversary is trying to get into your network', url: '', techniques: [] },
    { id: 'TA0002', name: 'Execution', description: 'The adversary is trying to run malicious code', url: '', techniques: [] },
    { id: 'TA0003', name: 'Persistence', description: 'The adversary is trying to maintain their foothold', url: '', techniques: [] },
  ];
}

function getFallbackTechniqueDetails(techniqueId: string): MitreTechniqueDetails {
  return {
    id: techniqueId,
    name: 'Unknown Technique',
    description: 'Details not available',
    tactics: [],
    platforms: [],
    url: '',
    examples: [],
    detection: [],
    mitigation: [],
  };
}


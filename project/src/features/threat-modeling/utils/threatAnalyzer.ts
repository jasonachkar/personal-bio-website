import type {
  ThreatModelComponent,
  DataFlow,
  Threat,
  ThreatAnalysis,
  RiskScore,
  MitreTechnique,
  CVE,
  TrustBoundary,
} from '../types';
import { mapThreatToMitre } from './mitreAttackApi';

/**
 * Analyze architecture and generate threat analysis
 */
export function analyzeArchitecture(
  components: ThreatModelComponent[],
  dataFlows: DataFlow[],
  trustBoundaries: TrustBoundary[] = []
): ThreatAnalysis {
  const identifiedRisks: string[] = [];

  // Check for unencrypted data flows
  const unencryptedFlows = dataFlows.filter(flow => !flow.encrypted);
  if (unencryptedFlows.length > 0) {
    identifiedRisks.push(`${unencryptedFlows.length} unencrypted data flows detected`);
  }

  // Check for unauthenticated data flows
  const unauthenticatedFlows = dataFlows.filter(flow => !flow.authenticated);
  if (unauthenticatedFlows.length > 0) {
    identifiedRisks.push(`${unauthenticatedFlows.length} unauthenticated data flows detected`);
  }

  // Check for components without encryption
  const unencryptedComponents = components.filter(comp => 
    comp.type === 'datastore' && !comp.metadata?.encrypted
  );
  if (unencryptedComponents.length > 0) {
    identifiedRisks.push(`${unencryptedComponents.length} datastores without encryption`);
  }

  // Check for external entities without authentication
  const unauthenticatedExternal = components.filter(comp =>
    comp.type === 'external-entity' && !comp.metadata?.authentication
  );
  if (unauthenticatedExternal.length > 0) {
    identifiedRisks.push(`${unauthenticatedExternal.length} external entities without authentication`);
  }

  // Detect cloud provider
  const cloudProvider = detectCloudProvider(components);

  return {
    components,
    dataFlows,
    identifiedRisks,
    trustBoundaries,
    cloudProvider,
  };
}

/**
 * Generate threats from architecture analysis
 */
export function generateThreats(
  analysis: ThreatAnalysis,
  mitreData: MitreTechnique[] = []
): Threat[] {
  const threats: Threat[] = [];

  // Generate STRIDE-based threats
  threats.push(...generateSpoofingThreats(analysis));
  threats.push(...generateTamperingThreats(analysis));
  threats.push(...generateRepudiationThreats(analysis));
  threats.push(...generateInformationDisclosureThreats(analysis));
  threats.push(...generateDenialOfServiceThreats(analysis));
  threats.push(...generateElevationOfPrivilegeThreats(analysis));

  // Map to MITRE ATT&CK
  threats.forEach(threat => {
    const mitreMapping = mapThreatToMitre(threat);
    threat.mitreTactics = mitreMapping.tactics;
    threat.mitreTechniques = mitreMapping.techniques;
  });

  return threats;
}

/**
 * Calculate risk score for a threat
 */
export function calculateRiskScore(
  threat: Threat,
  cveData: CVE[] = [],
  mitreData: any = {}
): RiskScore {
  let overall = 0;
  let confidentiality = 0;
  let integrity = 0;
  let availability = 0;

  // Base score from severity
  const severityScores = { critical: 9, high: 7, medium: 5, low: 3 };
  overall += severityScores[threat.severity] || 5;

  // Impact from likelihood and impact
  const likelihoodScores = { high: 3, medium: 2, low: 1 };
  const impactScores = { high: 3, medium: 2, low: 1 };
  overall += (likelihoodScores[threat.likelihood] || 1) * (impactScores[threat.impact] || 1);

  // CVE impact
  const cveCount = cveData.length;
  const avgCvss = cveData.length > 0
    ? cveData.reduce((sum, cve) => sum + (cve.cvssScore || 0), 0) / cveData.length
    : 0;
  overall += Math.min(avgCvss / 2, 3);

  // MITRE technique count
  const mitreCount = threat.mitreTechniques?.length || 0;
  overall += Math.min(mitreCount, 2);

  // Calculate CIA scores based on threat category
  if (threat.category === 'information-disclosure' || threat.category === 'spoofing') {
    confidentiality = Math.max(overall * 0.4, severityScores[threat.severity] || 5);
  }
  if (threat.category === 'tampering' || threat.category === 'elevation-of-privilege') {
    integrity = Math.max(overall * 0.4, severityScores[threat.severity] || 5);
  }
  if (threat.category === 'denial-of-service') {
    availability = Math.max(overall * 0.4, severityScores[threat.severity] || 5);
  }

  // Normalize scores
  overall = Math.min(overall, 10);
  confidentiality = Math.min(confidentiality || overall * 0.3, 10);
  integrity = Math.min(integrity || overall * 0.3, 10);
  availability = Math.min(availability || overall * 0.3, 10);

  return {
    overall: Math.round(overall * 10) / 10,
    confidentiality: Math.round(confidentiality * 10) / 10,
    integrity: Math.round(integrity * 10) / 10,
    availability: Math.round(availability * 10) / 10,
    factors: {
      cveCount,
      mitreTechniqueCount: mitreCount,
      cloudMisconfigurations: 0,
      unencryptedFlows: 0,
    },
  };
}

/**
 * Generate spoofing threats
 */
function generateSpoofingThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // Unauthenticated external entities
  analysis.components
    .filter(comp => comp.type === 'external-entity' && !comp.metadata?.authentication)
    .forEach(comp => {
      threats.push({
        id: `spoofing-${comp.id}`,
        category: 'spoofing',
        title: `Identity Spoofing: ${comp.name}`,
        description: `${comp.name} does not require authentication, allowing unauthorized users to impersonate legitimate entities`,
        affectedComponents: [comp.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
      });
    });

  // Unauthenticated data flows
  analysis.dataFlows
    .filter(flow => !flow.authenticated)
    .forEach(flow => {
      threats.push({
        id: `spoofing-flow-${flow.id}`,
        category: 'spoofing',
        title: `Data Flow Spoofing: ${flow.label}`,
        description: `Data flow "${flow.label}" does not require authentication, allowing spoofed requests`,
        affectedComponents: [flow.from, flow.to],
        severity: 'medium',
        likelihood: 'medium',
        impact: 'medium',
      });
    });

  return threats;
}

/**
 * Generate tampering threats
 */
function generateTamperingThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // Unencrypted data flows
  analysis.dataFlows
    .filter(flow => !flow.encrypted)
    .forEach(flow => {
      threats.push({
        id: `tampering-flow-${flow.id}`,
        category: 'tampering',
        title: `Data Tampering: ${flow.label}`,
        description: `Data flow "${flow.label}" is not encrypted, allowing attackers to modify data in transit`,
        affectedComponents: [flow.from, flow.to],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
      });
    });

  // Unencrypted datastores
  analysis.components
    .filter(comp => comp.type === 'datastore' && !comp.metadata?.encrypted)
    .forEach(comp => {
      threats.push({
        id: `tampering-store-${comp.id}`,
        category: 'tampering',
        title: `Data Tampering: ${comp.name}`,
        description: `${comp.name} is not encrypted at rest, allowing attackers to modify stored data`,
        affectedComponents: [comp.id],
        severity: 'critical',
        likelihood: 'low',
        impact: 'high',
      });
    });

  return threats;
}

/**
 * Generate repudiation threats
 */
function generateRepudiationThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // Components without logging
  analysis.components
    .filter(comp => comp.type === 'process' && !comp.metadata?.logging)
    .forEach(comp => {
      threats.push({
        id: `repudiation-${comp.id}`,
        category: 'repudiation',
        title: `Action Repudiation: ${comp.name}`,
        description: `${comp.name} does not log user actions, allowing users to deny performing actions`,
        affectedComponents: [comp.id],
        severity: 'medium',
        likelihood: 'medium',
        impact: 'medium',
      });
    });

  return threats;
}

/**
 * Generate information disclosure threats
 */
function generateInformationDisclosureThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // Unencrypted data flows
  analysis.dataFlows
    .filter(flow => !flow.encrypted)
    .forEach(flow => {
      threats.push({
        id: `disclosure-flow-${flow.id}`,
        category: 'information-disclosure',
        title: `Information Disclosure: ${flow.label}`,
        description: `Data flow "${flow.label}" is not encrypted, allowing attackers to intercept and read sensitive data`,
        affectedComponents: [flow.from, flow.to],
        severity: 'high',
        likelihood: 'high',
        impact: 'high',
      });
    });

  // Unencrypted datastores
  analysis.components
    .filter(comp => comp.type === 'datastore' && !comp.metadata?.encrypted)
    .forEach(comp => {
      threats.push({
        id: `disclosure-store-${comp.id}`,
        category: 'information-disclosure',
        title: `Information Disclosure: ${comp.name}`,
        description: `${comp.name} is not encrypted at rest, exposing sensitive data if accessed`,
        affectedComponents: [comp.id],
        severity: 'critical',
        likelihood: 'medium',
        impact: 'high',
      });
    });

  return threats;
}

/**
 * Generate denial of service threats
 */
function generateDenialOfServiceThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // External entities without rate limiting
  analysis.components
    .filter(comp => comp.type === 'external-entity' && !comp.metadata?.rateLimited)
    .forEach(comp => {
      threats.push({
        id: `dos-${comp.id}`,
        category: 'denial-of-service',
        title: `Denial of Service: ${comp.name}`,
        description: `${comp.name} does not implement rate limiting, allowing attackers to overwhelm the system`,
        affectedComponents: [comp.id],
        severity: 'high',
        likelihood: 'high',
        impact: 'high',
      });
    });

  return threats;
}

/**
 * Generate elevation of privilege threats
 */
function generateElevationOfPrivilegeThreats(analysis: ThreatAnalysis): Threat[] {
  const threats: Threat[] = [];

  // Components without proper access control
  analysis.components
    .filter(comp => comp.type === 'process' && !comp.metadata?.accessControl)
    .forEach(comp => {
      threats.push({
        id: `eop-${comp.id}`,
        category: 'elevation-of-privilege',
        title: `Privilege Escalation: ${comp.name}`,
        description: `${comp.name} does not implement proper access control, allowing unauthorized privilege escalation`,
        affectedComponents: [comp.id],
        severity: 'critical',
        likelihood: 'medium',
        impact: 'high',
      });
    });

  return threats;
}

/**
 * Detect cloud provider from components
 */
export function detectCloudProvider(components: ThreatModelComponent[]): 'aws' | 'azure' | 'gcp' | undefined {
  const text = components.map(c => `${c.name} ${c.description}`).join(' ').toLowerCase();
  
  if (text.includes('aws') || text.includes('amazon') || text.includes('s3') || text.includes('lambda') || text.includes('rds')) {
    return 'aws';
  }
  if (text.includes('azure') || text.includes('microsoft') || text.includes('key vault') || text.includes('app service')) {
    return 'azure';
  }
  if (text.includes('gcp') || text.includes('google cloud') || text.includes('cloud storage') || text.includes('cloud functions')) {
    return 'gcp';
  }
  
  return undefined;
}


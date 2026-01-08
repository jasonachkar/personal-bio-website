// Threat Modeling Type Definitions

export type ComponentType = 'process' | 'datastore' | 'external-entity' | 'data-flow';
export type ThreatCategory = 'spoofing' | 'tampering' | 'repudiation' | 'information-disclosure' | 'denial-of-service' | 'elevation-of-privilege';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface ThreatModelComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  position?: { x: number; y: number };
  metadata?: {
    technology?: string;
    authentication?: boolean;
    encrypted?: boolean;
    [key: string]: any;
  };
}

export interface DataFlow {
  id: string;
  from: string; // Component ID
  to: string; // Component ID
  label: string;
  protocol?: string;
  encrypted?: boolean;
  authenticated?: boolean;
}

export interface TrustBoundary {
  id: string;
  name: string;
  components: string[]; // Component IDs
  level: 'low' | 'medium' | 'high';
}

export interface Threat {
  id: string;
  category: ThreatCategory;
  title: string;
  description: string;
  affectedComponents: string[]; // Component IDs
  severity: Severity;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitreTactics?: string[];
  mitreTechniques?: string[];
}

export interface Mitigation {
  id: string;
  threatId: string;
  title: string;
  description: string;
  implemented: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  effectiveness: 'low' | 'medium' | 'high';
}

export interface ThreatModelTemplate {
  id: string;
  name: string;
  description: string;
  architecture: string; // 'web-app' | 'api' | 'cloud-workload' | 'mobile-app'
  components: ThreatModelComponent[];
  dataFlows: DataFlow[];
  trustBoundaries: TrustBoundary[];
  threats: Threat[];
  mitigations: Mitigation[];
  metadata?: {
    version?: string;
    author?: string;
    lastUpdated?: string;
    [key: string]: any;
  };
}

export interface StrideMapping {
  [key: string]: {
    applicableComponents: ComponentType[];
    threats: Omit<Threat, 'id' | 'affectedComponents'>[];
  };
}

// MITRE ATT&CK Types
export interface MitreTactic {
  id: string;
  name: string;
  description: string;
  url: string;
  techniques: string[];
}

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  platforms: string[];
  kill_chain_phases?: string[];
  detection?: string[];
  mitigation?: string[];
  url: string;
  subtechniques?: MitreTechnique[];
}

export interface MitreTechniqueDetails {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  platforms: string[];
  kill_chain_phases?: string[];
  url: string;
  subtechniques?: MitreTechnique[];
  examples?: Array<{
    description: string;
    name: string;
  }>;
  detection?: Array<{
    description: string;
    name: string;
  }>;
  mitigation?: Array<{
    description: string;
    name: string;
  }>;
}

export interface MitreMapping {
  tactics: string[];
  techniques: string[];
  subtechniques?: string[];
}

// CVE Types
export interface CVE {
  id: string;
  description: string;
  cvssScore?: number;
  cvssVector?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  publishedDate: string;
  affectedTechnologies: string[];
  references: string[];
}

export interface CVEDetails extends CVE {
  cweId?: string;
  affectedVersions?: string[];
  remediation?: string;
}

// Cloud Security Types
export type CloudProvider = 'aws' | 'azure' | 'gcp';

export interface CloudConfig {
  provider: CloudProvider;
  region?: string;
  accountId?: string;
  credentials?: Record<string, string>; // For simulation, not real credentials
}

export interface CloudFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  service: string;
  resourceId?: string;
  complianceFramework?: string[];
  recommendation: string;
  category: 'misconfiguration' | 'vulnerability' | 'compliance' | 'threat';
}

export interface ComplianceStatus {
  framework: string;
  score: number;
  passed: number;
  failed: number;
  total: number;
  findings: CloudFinding[];
}

// Threat Analysis Types
export interface ThreatAnalysis {
  components: ThreatModelComponent[];
  dataFlows: DataFlow[];
  identifiedRisks: string[];
  trustBoundaries: TrustBoundary[];
  cloudProvider?: CloudProvider;
}

export interface RiskScore {
  overall: number;
  confidentiality: number;
  integrity: number;
  availability: number;
  factors: {
    cveCount: number;
    mitreTechniqueCount: number;
    cloudMisconfigurations: number;
    unencryptedFlows: number;
  };
}

// Component Library Types
export interface ComponentTemplate {
  id: string;
  name: string;
  type: ComponentType;
  provider?: CloudProvider;
  service?: string;
  description: string;
  defaultMetadata: ThreatModelComponent['metadata'];
  knownVulnerabilities?: string[];
  bestPractices?: string[];
  icon?: string;
}

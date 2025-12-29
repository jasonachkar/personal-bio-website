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

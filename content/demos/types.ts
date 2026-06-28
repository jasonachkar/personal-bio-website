export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type NodeType =
  | 'Internet'
  | 'Network'
  | 'Compute'
  | 'Identity'
  | 'SecretStore'
  | 'Storage'
  | 'Database'
  | 'SecurityControl'
  | 'SensitiveTarget';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  misconfig?: string;
  mitigation?: string;
  benchmark?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface AttackPath {
  id: string;
  severity: Severity;
  nodeIds: string[];
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface IacScenario {
  id: string;
  title: string;
  ruleId: string;
  description: string;
  terraformSnippet: string;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  paths: AttackPath[];
}

export type Scanner =
  | 'Semgrep'
  | 'Gitleaks'
  | 'Trivy'
  | 'Bandit'
  | 'ESLint-security'
  | 'OSV-Scanner'
  | 'Checkov';

export interface PipelineFinding {
  id: string;
  scanner: Scanner;
  rule: string;
  severity: Severity;
  cvss: number;
  location: string;
  canonicalKey: string;
  owasp: string;
  cwe: string;
  summary: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail';
  findingIds: string[];
  logs: string[];
}

export interface PipelineRun {
  id: string;
  label: string;
  description: string;
  gatePolicy: Severity[];
  gateDecision: 'pass' | 'blocked';
  stages: PipelineStage[];
  findings: PipelineFinding[];
}

export interface ThreatModelNode {
  id: string;
  label: string;
  kind: 'external' | 'process' | 'store' | 'boundary';
}

export interface StrideThreat {
  id: string;
  title: string;
  stride: 'Spoofing' | 'Tampering' | 'Repudiation' | 'Information Disclosure' | 'Denial of Service' | 'Elevation of Privilege';
  componentId: string;
  risk: Severity;
  mitigation: string;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: Severity;
  query: string;
  mitre: string;
  linkedThreatId: string;
}

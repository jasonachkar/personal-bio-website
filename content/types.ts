export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type NodeType =
  | 'Internet'
  | 'Network'
  | 'Compute'
  | 'Identity'
  | 'SecretStore'
  | 'Storage'
  | 'Database'
  | 'SecurityControl'
  | 'SensitiveTarget'
  | 'ResourceGroup';

export type EdgeType =
  | 'PubliclyExposes'
  | 'CanReach'
  | 'UsesIdentity'
  | 'AssignedRoleOn'
  | 'CanReadSecrets'
  | 'CanReadData';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  misconfig?: string;
  mitigation?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
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

export interface Finding {
  id: string;
  scanner: Scanner;
  rule: string;
  severity: Severity;
  location: string;
  canonicalKey: string;
}

export interface Stage {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'skipped';
  findingIds: string[];
}

export interface PipelineRun {
  id: string;
  label: string;
  stages: Stage[];
  findings: Finding[];
  gatePolicy: Severity[];
  gateDecision: 'pass' | 'blocked';
}

export type Role = 'Owner' | 'Admin' | 'Member';
export type Permission =
  | 'viewFindings'
  | 'manageApiKeys'
  | 'editPipelines'
  | 'approveReleases'
  | 'manageMembers';

export interface RbacUser {
  id: string;
  name: string;
  tenantId: string;
  role: Role;
}

export interface Tenant {
  id: string;
  name: string;
  projectIds: string[];
}

import type { DetectionEvent, StrideThreat, ThreatModelNode } from './types';

export const dfdNodes: ThreatModelNode[] = [
  { id: 'user', label: 'External user', kind: 'external' },
  { id: 'gateway', label: 'API gateway', kind: 'process' },
  { id: 'app', label: 'Application service', kind: 'process' },
  { id: 'queue', label: 'Work queue', kind: 'process' },
  { id: 'db', label: 'Tenant database', kind: 'store' },
  { id: 'boundary', label: 'Tenant trust boundary', kind: 'boundary' },
];

export const strideThreats: StrideThreat[] = [
  {
    id: 't1',
    title: 'Token replay against API gateway',
    stride: 'Spoofing',
    componentId: 'gateway',
    risk: 'high',
    mitigation: 'Bind tokens to issuer/audience, enforce expiry, and alert on impossible travel.',
  },
  {
    id: 't2',
    title: 'Cross-tenant object access',
    stride: 'Elevation of Privilege',
    componentId: 'app',
    risk: 'critical',
    mitigation: 'Enforce tenant-scoped authorization and database row-level isolation.',
  },
  {
    id: 't3',
    title: 'Queue payload tampering',
    stride: 'Tampering',
    componentId: 'queue',
    risk: 'medium',
    mitigation: 'Validate message signatures and reject unexpected schema versions.',
  },
];

export const detectionEvents: DetectionEvent[] = [
  {
    id: 'e1',
    timestamp: '10:42:18',
    source: 'SigninLogs',
    message: 'Same account authenticated from distant networks within short interval.',
    severity: 'high',
    query: 'SigninLogs | summarize by UserPrincipalName, IPAddress | detect impossible_travel()',
    mitre: 'T1078 Valid Accounts',
    linkedThreatId: 't1',
  },
  {
    id: 'e2',
    timestamp: '10:43:02',
    source: 'AppAudit',
    message: 'User requested tenant object outside assigned tenant scope.',
    severity: 'critical',
    query: 'AppAudit | where Result == "Denied" and Reason == "TenantScopeMismatch"',
    mitre: 'T1098 Account Manipulation',
    linkedThreatId: 't2',
  },
  {
    id: 'e3',
    timestamp: '10:44:31',
    source: 'QueueAudit',
    message: 'Message schema hash does not match registered producer.',
    severity: 'medium',
    query: 'QueueAudit | where SignatureValid == false or SchemaHashMismatch == true',
    mitre: 'T1565 Data Manipulation',
    linkedThreatId: 't3',
  },
];

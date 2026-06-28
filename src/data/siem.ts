import type { IntelItem, SiemAlert, SiemLog } from './types';

export const siemAlerts: SiemAlert[] = [
  {
    id: 'alert-001',
    title: 'Impossible travel on privileged account',
    severity: 'critical',
    category: 'auth',
    source: 'Okta',
    status: 'Investigating',
    timestamp: '2025-11-21T00:10:00Z',
    description:
      'Login from DE followed by login from SG within 2 minutes. MFA challenged and step-up enforced.',
  },
  {
    id: 'alert-002',
    title: 'DNS tunneling signature hit',
    severity: 'high',
    category: 'network',
    source: 'Elastic',
    status: 'Open',
    timestamp: '2025-11-21T00:08:00Z',
    description: 'High-entropy subdomains observed with consistent beacon interval from lab-host-12.',
  },
  {
    id: 'alert-003',
    title: 'Privileged role escalation in prod',
    severity: 'high',
    category: 'iam',
    source: 'Azure AD',
    status: 'Investigating',
    timestamp: '2025-11-21T00:04:00Z',
    description: 'User elevated to Global Admin outside change window. Audit trail attached.',
  },
  {
    id: 'alert-004',
    title: 'WAF blocked serialized payload',
    severity: 'medium',
    category: 'appsec',
    source: 'Cloudflare',
    status: 'Closed',
    timestamp: '2025-11-20T23:50:00Z',
    description: 'Detected attempted gadget chain targeting deserialization endpoint. Blocked at edge.',
  },
];

export const baseLogs: SiemLog[] = [
  {
    id: 'log-001',
    severity: 'medium',
    category: 'auth',
    message: 'okta: factor reset requested for svc-admin from ASN 12389',
    source: 'Okta',
    timestamp: '2025-11-21T00:11:12Z',
  },
  {
    id: 'log-002',
    severity: 'low',
    category: 'network',
    message: 'elastic: sigma dns_tunnel_exfiltration.yml fired for host lab-12',
    source: 'Elastic',
    timestamp: '2025-11-21T00:10:44Z',
  },
  {
    id: 'log-003',
    severity: 'high',
    category: 'appsec',
    message: 'burp crawler flagged reflected XSS on /support form (staging)',
    source: 'Burp',
    timestamp: '2025-11-21T00:10:05Z',
  },
  {
    id: 'log-004',
    severity: 'medium',
    category: 'endpoint',
    message: 'edr: powershell encoded command blocked on win-lab-07',
    source: 'CrowdStrike',
    timestamp: '2025-11-21T00:09:31Z',
  },
];

export const intelNotes: IntelItem[] = [
  {
    id: 'intel-001',
    label: 'CVE-2025-1234 (deserialization)',
    detail: 'Active exploitation attempts seen against Java services; WAF rules deployed.',
    risk: 'high',
    reference: 'https://example.com/cve-2025-1234',
  },
  {
    id: 'intel-002',
    label: 'New MFA fatigue kit',
    detail: 'Phishing kit automates push bombing; stepped-up WebAuthn enforced for admins.',
    risk: 'medium',
    reference: 'https://example.com/mfa-fatigue',
  },
  {
    id: 'intel-003',
    label: 'DNS beaconing pattern',
    detail: 'High-entropy subdomains with 120s jitter; monitors deployed across egress.',
    risk: 'medium',
    reference: 'https://example.com/dns-beacon',
  },
];

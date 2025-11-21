import type { SiemLog, SiemAlert } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateTimestamp = (offsetMinutes: number = 0) => {
  const date = new Date(Date.now() - offsetMinutes * 60000);
  return date.toISOString();
};

export const mockLogs: SiemLog[] = [
  {
    id: generateId(),
    timestamp: generateTimestamp(2),
    level: 'INFO',
    source: 'firewall',
    message: 'Connection established from 192.168.1.100',
    ip: '192.168.1.100',
    user: 'admin',
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(5),
    level: 'WARN',
    source: 'ids',
    message: 'Multiple failed authentication attempts detected',
    ip: '185.220.101.45',
    user: 'unknown',
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(8),
    level: 'ERROR',
    source: 'web-server',
    message: 'SQL injection attempt blocked',
    ip: '203.0.113.42',
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(10),
    level: 'INFO',
    source: 'vpn',
    message: 'User vpn-user connected via OpenVPN',
    ip: '10.0.5.23',
    user: 'vpn-user',
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(12),
    level: 'WARN',
    source: 'endpoint-protection',
    message: 'Suspicious PowerShell execution detected',
    ip: '192.168.10.50',
    user: 'jdoe',
  },
];

export const mockAlerts: SiemAlert[] = [
  {
    id: generateId(),
    timestamp: generateTimestamp(1),
    severity: 'Critical',
    category: 'Malware Detection',
    title: 'Ransomware Activity Detected',
    description:
      'Potential ransomware behavior identified on endpoint WS-FINANCE-07. Multiple file encryption operations detected in user directories.',
    source_ip: '192.168.10.75',
    user: 'finance-user',
    rule_id: 'MAL-2047',
    indicators: [
      'Rapid file modification (3000+ files in 2 minutes)',
      'Creation of .encrypted extension files',
      'Execution of unknown binary from Temp directory',
    ],
    mitre_tactics: ['T1486 - Data Encrypted for Impact', 'T1490 - Inhibit System Recovery'],
    recommended_actions: [
      'Immediately isolate affected endpoint from network',
      'Initiate incident response protocol',
      'Preserve disk image for forensic analysis',
      'Identify patient zero and lateral movement scope',
    ],
    affected_assets: ['WS-FINANCE-07', '\\\\FILESERVER01\\SharedDocs'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(15),
    severity: 'High',
    category: 'Data Exfiltration',
    title: 'Unusual Outbound Data Transfer',
    description:
      'Large volume of data transferred to external IP address over extended period. Transfer size: 47.3 GB over 8 hours.',
    source_ip: '192.168.20.105',
    destination_ip: '185.220.101.67',
    user: 'dev-admin',
    rule_id: 'DLP-1523',
    indicators: [
      'Outbound transfer to newly registered domain',
      'Transfer occurred during off-hours (02:00-10:00 UTC)',
      'Encrypted channel (TLS 1.3)',
      'Source: Internal database server',
    ],
    mitre_tactics: ['T1048 - Exfiltration Over Alternative Protocol', 'T1567 - Exfiltration Over Web Service'],
    recommended_actions: [
      'Block destination IP at perimeter firewall',
      'Review user access logs and privilege usage',
      'Analyze content of transferred data if possible',
      'Interview user regarding activity',
    ],
    affected_assets: ['DB-PROD-03', 'User: dev-admin'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(30),
    severity: 'Medium',
    category: 'Authentication Failure',
    title: 'Brute Force Attack on SSH Service',
    description: '850 failed SSH login attempts from single source IP targeting admin and root accounts.',
    source_ip: '198.51.100.42',
    user: 'root',
    rule_id: 'AUTH-0892',
    indicators: [
      'Dictionary attack pattern identified',
      'Source IP associated with known botnet',
      'Attack duration: 45 minutes',
    ],
    mitre_tactics: ['T1110 - Brute Force', 'T1078 - Valid Accounts'],
    recommended_actions: [
      'Add source IP to blocklist',
      'Implement rate limiting on SSH service',
      'Enable two-factor authentication for privileged accounts',
      'Review SSH configuration (disable root login)',
    ],
    affected_assets: ['SSH-GATEWAY-01', 'SSH-GATEWAY-02'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(45),
    severity: 'High',
    category: 'Privilege Escalation',
    title: 'Unauthorized Privilege Escalation Attempt',
    description:
      'Standard user account attempted to execute commands requiring administrative privileges using exploit technique.',
    source_ip: '192.168.50.88',
    user: 'contractor-bob',
    rule_id: 'PRIV-0341',
    indicators: [
      'Exploitation of CVE-2024-1234',
      'Token impersonation detected',
      'UAC bypass attempt',
    ],
    mitre_tactics: ['T1068 - Exploitation for Privilege Escalation', 'T1134 - Access Token Manipulation'],
    recommended_actions: [
      'Suspend user account immediately',
      'Patch vulnerable system component',
      'Audit all systems for same vulnerability',
      'Review user onboarding/offboarding process',
    ],
    affected_assets: ['WS-CONTRACTOR-12'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(60),
    severity: 'Low',
    category: 'Policy Violation',
    title: 'Unauthorized Software Installation',
    description: 'Non-approved software detected on corporate endpoint. Software: TeamViewer (remote access tool).',
    source_ip: '192.168.30.22',
    user: 'marketing-jane',
    rule_id: 'POL-0156',
    indicators: [
      'Installation of unapproved remote access tool',
      'Bypassed application whitelisting',
      'Unsigned executable',
    ],
    mitre_tactics: ['T1219 - Remote Access Software'],
    recommended_actions: [
      'Uninstall unauthorized software',
      'Send policy reminder to user',
      'Update application whitelist rules',
      'Monitor for similar violations',
    ],
    affected_assets: ['WS-MARKETING-05'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(90),
    severity: 'Medium',
    category: 'Network Anomaly',
    title: 'Lateral Movement via SMB',
    description:
      'Unusual SMB traffic patterns detected. Single workstation connecting to 25+ internal hosts within 10 minutes.',
    source_ip: '192.168.15.99',
    user: 'compromised-host',
    rule_id: 'NET-0774',
    indicators: [
      'SMB scanning behavior',
      'Connection attempts to admin shares (C$, ADMIN$)',
      'Use of Pass-the-Hash technique suspected',
    ],
    mitre_tactics: ['T1021.002 - SMB/Windows Admin Shares', 'T1550.002 - Pass the Hash'],
    recommended_actions: [
      'Isolate source workstation',
      'Force password reset for all potentially compromised accounts',
      'Enable SMB signing on all hosts',
      'Review network segmentation controls',
    ],
    affected_assets: ['WS-SALES-18', 'Multiple internal hosts'],
  },
  {
    id: generateId(),
    timestamp: generateTimestamp(120),
    severity: 'Info',
    category: 'Suspicious Activity',
    title: 'Anomalous Login Time',
    description: 'User logged in from unusual location outside of normal working hours.',
    source_ip: '203.0.113.89',
    user: 'remote-worker',
    rule_id: 'UBA-0423',
    indicators: [
      'Login at 03:45 AM local time',
      'Geographic location: 500+ miles from usual location',
      'New device fingerprint',
    ],
    mitre_tactics: ['T1078 - Valid Accounts'],
    recommended_actions: [
      'Contact user to verify legitimate access',
      'Review MFA logs',
      'Monitor account for further anomalies',
      'Consider implementing impossible travel detection',
    ],
    affected_assets: ['User: remote-worker'],
  },
];

export function getRandomLog(): SiemLog {
  const levels: Array<'INFO' | 'WARN' | 'ERROR' | 'DEBUG'> = ['INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
  const sources = ['firewall', 'ids', 'web-server', 'endpoint-protection', 'vpn', 'proxy', 'dns'];
  const ips = [
    '192.168.1.100',
    '10.0.5.23',
    '185.220.101.45',
    '203.0.113.42',
    '198.51.100.88',
    '172.16.0.50',
  ];

  return {
    id: generateId(),
    timestamp: generateTimestamp(0),
    level: levels[Math.floor(Math.random() * levels.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    message: `System event logged from ${sources[Math.floor(Math.random() * sources.length)]}`,
    ip: ips[Math.floor(Math.random() * ips.length)],
  };
}

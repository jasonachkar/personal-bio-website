// SIEM Simulator types

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type AlertSeverity = 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';

export type AlertCategory =
  | 'Malware Detection'
  | 'Network Anomaly'
  | 'Authentication Failure'
  | 'Data Exfiltration'
  | 'Privilege Escalation'
  | 'Suspicious Activity'
  | 'Policy Violation';

export interface SiemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  ip?: string;
  user?: string;
}

export interface SiemAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  source_ip: string;
  destination_ip?: string;
  user?: string;
  rule_id: string;
  indicators: string[];
  mitre_tactics?: string[];
  recommended_actions: string[];
  affected_assets: string[];
}

export interface FilterState {
  severity: AlertSeverity[];
  category: AlertCategory[];
  searchQuery: string;
}

export const severityOrder: AlertSeverity[] = ['Info', 'Low', 'Medium', 'High', 'Critical'];

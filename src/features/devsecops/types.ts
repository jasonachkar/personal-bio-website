// DevSecOps Pipeline Types

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ScanStatus = 'passed' | 'failed' | 'warning';

export interface ScanFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  file?: string;
  line?: number;
  code?: string;
  recommendation: string;
  cwe?: string;
  cvss?: number;
}

export interface ScanResult {
  scanType: 'sast' | 'sca' | 'secrets' | 'iac' | 'container';
  status: ScanStatus;
  duration: number; // seconds
  findings: ScanFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'source' | 'build' | 'test' | 'scan' | 'deploy';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  scanResult?: ScanResult;
}

export interface PipelineRun {
  id: string;
  timestamp: string;
  branch: string;
  commit: string;
  author: string;
  stages: PipelineStage[];
  overallStatus: 'passed' | 'failed' | 'running';
  securityGates: {
    sastPassed: boolean;
    scaPassed: boolean;
    secretsPassed: boolean;
    iacPassed: boolean;
    containerPassed: boolean;
  };
}

export interface SecurityThresholds {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

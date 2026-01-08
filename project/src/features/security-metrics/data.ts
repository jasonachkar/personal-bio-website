import type { SecurityMetrics, SecurityEvent } from './types';

export const mockSecurityMetrics: SecurityMetrics = {
  incidentsBlocked: 1247,
  vulnerabilitiesFound: 89,
  detectionsCreated: 34,
  complianceScore: 94,
  avgResponseTime: '2.3 min',
  mitreCoverage: {
    tactics: 12,
    techniques: 28,
    totalTactics: 14,
    totalTechniques: 200,
  },
  timeline: [
    {
      id: '1',
      date: '2024-12-15',
      type: 'incident',
      title: 'Blocked SQL Injection Attempt',
      severity: 'critical',
      description: 'Prevented unauthorized database access attempt',
    },
    {
      id: '2',
      date: '2024-12-10',
      type: 'vulnerability',
      title: 'Identified XSS Vulnerability',
      severity: 'high',
      description: 'Found and remediated cross-site scripting vulnerability',
    },
    {
      id: '3',
      date: '2024-12-05',
      type: 'detection',
      title: 'Created Brute Force Detection Rule',
      severity: 'medium',
      description: 'Implemented KQL-based detection for authentication attacks',
    },
    {
      id: '4',
      date: '2024-11-28',
      type: 'compliance',
      title: 'Improved CIS Benchmark Score',
      severity: 'low',
      description: 'Enhanced cloud security posture compliance',
    },
  ],
};


import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Multi-Cloud Security Posture Enhancement',
    category: 'cloud',
    problem: 'SES & Technologies Ltd. had inconsistent security configurations across Azure and AWS, with 45% of resources non-compliant with CIS Benchmarks. Multiple misconfigurations exposed sensitive data and increased attack surface.',
    analysis: 'Conducted comprehensive security assessment using Azure Security Center and AWS Security Hub. Identified 127 misconfigurations across storage accounts, IAM policies, and network security groups. Root cause: lack of centralized security governance and automated compliance checking.',
    solution: 'Implemented Infrastructure as Code (Terraform) with security policies, automated compliance scanning via Azure Policy and AWS Config, and established security baseline configurations. Created custom detection rules in Microsoft Sentinel for real-time misconfiguration alerts.',
    impact: {
      before: {
        incidentsPerMonth: 12,
        complianceScore: 62,
        avgResponseTime: '4.5 hours',
        vulnerabilities: 127,
      },
      after: {
        incidentsPerMonth: 2,
        complianceScore: 94,
        avgResponseTime: '1.2 hours',
        vulnerabilities: 8,
      },
      improvement: {
        incidentsReduction: '83%',
        complianceIncrease: '+32%',
        responseTimeImprovement: '73% faster',
        vulnerabilitiesFixed: '94%',
      },
    },
    technologies: ['Azure Security Center', 'AWS Security Hub', 'Terraform', 'Microsoft Sentinel', 'KQL', 'Azure Policy'],
    lessonsLearned: [
      'Automated compliance checking is essential for cloud security at scale',
      'Infrastructure as Code prevents configuration drift',
      'Centralized security monitoring provides visibility across multi-cloud environments',
    ],
    date: '2025-08-02',
    duration: '3 months',
    status: 'completed',
  },
  {
    id: '2',
    title: 'SIEM Detection Engineering for Advanced Threats',
    category: 'detection',
    problem: 'Matrox Graphics Inc. Security team was missing advanced persistent threats (APTs) due to insufficient detection coverage. Only 8 out of 14 MITRE ATT&CK tactics had detection rules, leaving significant blind spots.',
    analysis: 'Analyzed 6 months of security logs and identified gaps in detection coverage. Most existing rules were signature-based and failed to detect behavioral anomalies. Missing detections for lateral movement, privilege escalation, and data exfiltration techniques.',
    solution: 'Developed 34 custom KQL-based detection rules covering missing MITRE tactics. Implemented behavioral analytics for anomaly detection, created correlation rules for multi-stage attacks, and established automated response playbooks. Achieved 85% MITRE ATT&CK coverage.',
    impact: {
      before: {
        incidentsPerMonth: 8,
        complianceScore: 70,
        avgResponseTime: '6 hours',
        vulnerabilities: 0,
      },
      after: {
        incidentsPerMonth: 1,
        complianceScore: 85,
        avgResponseTime: '45 minutes',
        vulnerabilities: 0,
      },
      improvement: {
        incidentsReduction: '87%',
        complianceIncrease: '+15%',
        responseTimeImprovement: '87% faster',
        vulnerabilitiesFixed: 'N/A',
      },
    },
    technologies: ['Microsoft Sentinel', 'KQL', 'MITRE ATT&CK', 'Azure Logic Apps', 'PowerShell'],
    lessonsLearned: [
      'Behavioral analytics are more effective than signature-based detection',
      'MITRE ATT&CK framework provides comprehensive threat coverage',
      'Automated response reduces mean time to respond significantly',
    ],
    date: '2024-09-20',
    duration: '2 months',
    status: 'completed',
  },
];


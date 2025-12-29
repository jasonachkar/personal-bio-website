import type { Writeup } from './types';

export const writeups: Writeup[] = [
  {
    id: 'azure-security-baseline',
    title: 'Building a Secure Azure Landing Zone',
    description:
      'A practical guide to implementing Azure security best practices, including network segmentation, identity governance, and compliance policies using Azure Policy and Blueprints.',
    date: '2024-12',
    readingTime: '12 min',
    tags: ['Azure', 'Cloud Security', 'IAM', 'Governance', 'Best Practices'],
    category: 'tutorial',
  },
  {
    id: 'owasp-api-top-10',
    title: 'OWASP API Security Top 10: Practical Mitigations',
    description:
      'Deep dive into each of the OWASP API Security Top 10 vulnerabilities with real-world examples and actionable mitigation strategies for Node.js and .NET applications.',
    date: '2024-11',
    readingTime: '18 min',
    tags: ['OWASP', 'API Security', 'AppSec', 'Web Security', 'Best Practices'],
    category: 'tutorial',
  },
  {
    id: 'threat-modeling-web-app',
    title: 'Threat Modeling a Multi-Tenant SaaS Application',
    description:
      'Step-by-step walkthrough of applying STRIDE methodology to identify threats in a multi-tenant CRM system, with data flow diagrams and mitigation planning.',
    date: '2024-10',
    readingTime: '15 min',
    tags: ['Threat Modeling', 'STRIDE', 'AppSec', 'Risk Assessment'],
    category: 'tutorial',
  },
  {
    id: 'sentinel-detection-engineering',
    title: 'Detection Engineering with Microsoft Sentinel',
    description:
      'Building effective KQL queries for Azure Sentinel to detect suspicious authentication patterns, lateral movement, and privilege escalation attempts.',
    date: '2024-09',
    readingTime: '14 min',
    tags: ['SIEM', 'Microsoft Sentinel', 'KQL', 'Detection Engineering', 'Azure'],
    category: 'tutorial',
  },
  {
    id: 'security-plus-study-guide',
    title: 'CompTIA Security+ Study Notes & Labs',
    description:
      'Comprehensive study guide covering all Security+ exam objectives with hands-on lab exercises, practice scenarios, and memory aids for key concepts.',
    date: '2024-08',
    readingTime: '25 min',
    tags: ['Security+', 'Certification', 'Study Guide', 'Labs'],
    category: 'certification-notes',
  },
  {
    id: 'oauth-security-analysis',
    title: 'Common OAuth 2.0 Misconfigurations and Exploits',
    description:
      'Analysis of real-world OAuth implementation flaws including redirect URI validation bypass, state parameter issues, and token leakage scenarios.',
    date: '2024-07',
    readingTime: '10 min',
    tags: ['OAuth', 'Authentication', 'Web Security', 'Vulnerabilities'],
    category: 'research',
  },
  {
    id: 'ci-cd-security-gates',
    title: 'Implementing Security Gates in CI/CD Pipelines',
    description:
      'Practical guide to integrating SAST, dependency scanning, and container security tools into GitHub Actions and Azure DevOps pipelines.',
    date: '2024-06',
    readingTime: '11 min',
    tags: ['DevSecOps', 'CI/CD', 'SAST', 'Container Security', 'Automation'],
    category: 'tutorial',
  },
  {
    id: 'azure-entra-id-security',
    title: 'Securing Azure Entra ID (formerly Azure AD)',
    description:
      'Best practices for configuring Conditional Access policies, MFA, Privileged Identity Management, and identity protection in Azure Entra ID.',
    date: '2024-05',
    readingTime: '13 min',
    tags: ['Azure', 'Entra ID', 'IAM', 'Zero Trust', 'MFA'],
    category: 'tutorial',
  },
];

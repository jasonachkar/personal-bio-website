import type { CallToAction } from './types';

export const heroCopy = {
  name: 'Jason Achkar Diab',
  title: 'DevSecOps & Platform Engineer | Cloud Security',
  tagline: 'CompTIA Security+ · AZ-900 · SC-500 (In Progress) · MSc Cybersecurity — Georgia Tech',
  blurb:
    'Platform and DevSecOps engineer with a software engineering foundation and production experience building secure CI/CD pipelines, infrastructure-as-code, and multi-tenant cloud systems on Microsoft Azure. Solo-built and deployed SecureObs, a security SaaS unifying seven scanners with cross-tool deduplication, CI/CD build gating, and credential-free IaC attack-path analysis.',
  currentFocus: [
    'Azure DevOps & GitHub platform administration and access governance (Genetec)',
    'Secure CI/CD with build gates: SAST, DAST, secrets scanning, IaC scanning',
    'Infrastructure-as-Code security: Terraform, Checkov, HCL static analysis',
    'SecureObs: production multi-tenant security SaaS (secureobs.com)',
  ],
};

export const heroStats = [
  { label: 'Certifications', value: '4', detail: 'Security+, AZ-900, Google Cyber, SC-500 in progress' },
  { label: 'Engineering', value: '3+ yrs', detail: 'Platform engineering, DevSecOps, secure full-stack development' },
  { label: 'MITRE Techniques', value: '12+', detail: 'covered across detections & projects' },
];

export const heroCtas: CallToAction[] = [
  { label: 'View Projects', href: '#projects', kind: 'primary' },
  { label: 'Download Resume', href: '/resume.pdf', kind: 'ghost' },
];

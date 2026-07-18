import type { Certification, Education } from './types';

export const certifications: Certification[] = [
  {
    id: 'security-plus',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: '2025',
    skills: [
      'Threat Detection & Response',
      'Security Operations',
      'Governance & Compliance',
      'Network Security',
      'Cryptography',
      'Identity & Access Management',
    ],
    description:
      'Industry-standard certification covering core cybersecurity principles, threat analysis, risk management, and security controls across networks, applications, and cloud environments.',
  },
  {
    id: 'sc-500',
    name: 'SC-500: Microsoft Cloud & AI Security Engineer',
    issuer: 'Microsoft',
    date: 'In Progress',
    skills: [
      'Microsoft Security Copilot',
      'AI Security',
      'Cloud Security',
      'Entra ID',
      'Microsoft Defender',
      'Compliance Management',
    ],
    description:
      'Advanced certification for implementing Microsoft cloud security controls, AI security, Microsoft Defender, and compliance solutions across Azure environments.',
  },
  {
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    date: '2025',
    skills: [
      'Cloud Concepts',
      'Azure Services',
      'Security & Compliance',
      'Identity & Governance',
      'Cost Management',
      'Azure Architecture',
    ],
    description:
      'Foundational certification demonstrating knowledge of cloud services, Azure architecture, security, privacy, compliance, and trust in Microsoft Azure.',
  },
  {
    id: 'google-cyber',
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google / Coursera',
    date: '2025',
    skills: [
      'SIEM Tools',
      'Python for Security',
      'Incident Response',
      'Linux Administration',
      'Network Security',
      'Security Automation',
    ],
    description:
      'Comprehensive program covering security foundations, network security, Linux, Python automation, threat detection with SIEM tools, and incident response procedures.',
  },
];

export const education: Education[] = [
  {
    id: 'gatech-msc',
    degree: 'Master of Science in Cybersecurity, Information Security Specialization',
    institution: 'Georgia Institute of Technology',
    location: 'Online',
    period: '2026 – 2028 (In Progress)',
    status: 'in-progress',
    highlights: [
      'Secure software development',
      'Identity and access management',
      'Network security and intrusion detection',
      'Applied cryptography',
      'Software vulnerability analysis',
    ],
  },
  {
    id: 'concordia-bcs',
    degree: 'Bachelor of Computer Science',
    institution: 'Concordia University',
    location: 'Montreal, QC',
    period: 'Graduated April 2025',
    status: 'completed',
    highlights: [
      'Software architecture',
      'Computer networks',
      'Database systems',
      'Secure software development',
      'Operating systems',
    ],
  },
];

import type { Certification, Education } from './types';

export const certifications: Certification[] = [
  {
    id: 'security-plus',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: '2024',
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
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    date: '2024',
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
    date: '2024',
    skills: [
      'SIEM Tools',
      'Python for Security',
      'Incident Response',
      'Linux Administration',
      'Network Security',
      'Security Automation',
    ],
    description:
      'Comprehensive program covering security fundamentals, network security, Linux, Python automation, threat detection with SIEM tools, and incident response procedures.',
  },
];

export const education: Education[] = [
  {
    id: 'msc-cyber',
    degree: 'M.S. Cybersecurity, Information Security specialization',
    institution: 'Georgia Institute of Technology',
    location: 'Online (OMS Cybersecurity)',
    period: '2026 - 2028',
    status: 'in-progress',
    highlights: [
      'Information security, secure systems, and applied cybersecurity engineering',
      'Cloud security, secure software, and defensive engineering practice',
    ],
    relevantCourses: [
      'Information Security',
      'Secure Computer Systems',
      'Software Security',
      'Network Security',
      'Applied Cryptography',
    ],
  },
  {
    id: 'bsc-cs',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Concordia University',
    location: 'Montreal, QC',
    period: '2022 - 2025',
    status: 'completed',
    highlights: [
      'Developed secure web applications with authentication systems',
      'Implemented database security and access controls',
      'Built distributed systems with security considerations',
      'Studied algorithms, data structures, and software engineering',
    ],
    relevantCourses: [
      'Data Structures & Algorithms',
      'Database Systems',
      'Web Development',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
    ],
  },
];

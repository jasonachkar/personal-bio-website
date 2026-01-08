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
    degree: 'Master of Science in Cybersecurity',
    institution: 'University of London',
    location: 'Online',
    period: '2024 - Present',
    status: 'in-progress',
    highlights: [
      'Advanced threat modeling and risk assessment',
      'Secure software development lifecycle',
      'Cloud security architecture and governance',
      'Cryptography and secure communications',
      'Digital forensics and incident response',
    ],
    relevantCourses: [
      'Security Risk Management',
      'Secure Software Development',
      'Cloud Security',
      'Network Security',
      'Cryptography',
      'Digital Forensics',
    ],
  },
  {
    id: 'bsc-cs',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Concordia University',
    location: 'Montreal, QC',
    period: '2016 - 2020',
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

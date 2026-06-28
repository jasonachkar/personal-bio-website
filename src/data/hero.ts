import type { CallToAction } from './types';

export const heroCopy = {
  name: 'Jason Achkar Diab',
  title: 'Software Developer → Cybersecurity',
  tagline: 'Cloud Security (Azure) | Security+ | AZ-900 | MSc Cybersecurity (UoL)',
  blurb:
    'Building secure-by-design software with a focus on cloud security, threat detection, and application security. Transitioning from full-stack development to cybersecurity consulting and security engineering.',
  currentFocus: [
    'Azure Security & Defender for Cloud',
    'SIEM Detection Engineering',
    'Secure SDLC & Threat Modeling',
    'Cloud IAM & Zero Trust Architecture',
  ],
};

export const heroStats = [
  { label: 'Certifications', value: '3', detail: 'Security+, AZ-900, Google Cyber' },
  { label: 'Experience', value: '5+ yrs', detail: 'secure full-stack development' },
  { label: 'Projects', value: '6', detail: 'cybersecurity labs & tools' },
];

export const heroCtas: CallToAction[] = [
  { label: 'View Projects', href: '#projects', kind: 'primary' },
  { label: 'Download Resume', href: '/resume.pdf', kind: 'ghost' },
];

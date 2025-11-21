import type { CallToAction } from './types';

export const heroCopy = {
  name: 'Jason Achkar Diab',
  title: 'Security-minded Full-Stack Engineer',
  tagline: 'Building resilient software, SOC-grade telemetry, and playful WebGL experiences.',
  blurb:
    'I combine product engineering, security reviews, and game prototyping to ship experiences that feel fast, observable, and defensible.',
};

export const heroStats = [
  { label: 'Disclosures', value: '40+', detail: 'responsible findings with remediation plans' },
  { label: 'Deployments', value: '25+', detail: 'production launches across web & APIs' },
  { label: 'Game builds', value: '6', detail: 'PlayCanvas / R3F prototypes with polish' },
];

export const heroCtas: CallToAction[] = [
  { label: 'View Projects', href: '#projects', kind: 'primary' },
  { label: 'Cyber Arcade', href: '#games', kind: 'ghost' },
];

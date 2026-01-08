import type { SkillCategory } from './types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Software Engineering',
    summary:
      'Full-stack delivery with performance budgets, DX tooling, and observability baked in from day one.',
    tools: [
      'React / TypeScript / Vite',
      'Next.js & SSR',
      '.NET 7 / Node.js',
      'GraphQL & REST',
      'PostgreSQL / Redis',
      'CI/CD, SLOs, tracing',
    ],
  },
  {
    title: 'Cybersecurity',
    summary:
      'Practical AppSec and detection engineering: threat modeling, exploit PoCs, and tuned SIEM detections.',
    tools: [
      'OWASP + API Top 10',
      'Burp Suite / ZAP',
      'Elastic SIEM / Sigma',
      'MITRE ATT&CK mapping',
      'Secure SDLC playbooks',
      'Threat modeling workshops',
    ],
  },
  {
    title: 'Game & Real-Time',
    summary:
      'Playable prototypes with tactile feel, WebGL rendering, and lightweight multiplayer experiments.',
    tools: [
      'PlayCanvas',
      'React Three Fiber',
      'Three.js shaders',
      'Input & physics systems',
      'Perf instrumentation',
      'UX/motion direction',
    ],
  },
];

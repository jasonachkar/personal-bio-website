import type { SkillCategory } from './types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Cloud Security',
    summary:
      'Azure-native security posture management, policy enforcement, and identity governance.',
    tools: [
      'Microsoft Sentinel / KQL',
      'Defender for Cloud',
      'Azure Policy & RBAC',
      'Entra ID / Zero Trust',
      'Terraform (IaC security)',
      'Azure Monitor / Log Analytics',
    ],
  },
  {
    title: 'AppSec & DevSecOps',
    summary:
      'Security baked into the SDLC — from threat modeling to automated pipeline gates.',
    tools: [
      'OWASP API & Web Top 10',
      'Burp Suite / OWASP ZAP',
      'SAST: SonarQube',
      'SCA: OWASP Dependency-Check',
      'Container scanning: Trivy',
      'GitHub Actions security gates',
    ],
  },
  {
    title: 'Software Engineering',
    summary:
      'Full-stack delivery foundation — I know how systems are built, so I know how they break.',
    tools: [
      'TypeScript / React / Next.js',
      '.NET 8 / Node.js',
      'PostgreSQL / Redis',
      'REST & GraphQL APIs',
      'Docker & CI/CD',
      'Observability & structured logging',
    ],
  },
];

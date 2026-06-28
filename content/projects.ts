import { profile } from './profile';

export const secureObs = {
  name: 'SecureObs',
  liveUrl: profile.links.secureObs,
  sourceUrl: profile.links.secureObsSource,
  oneLine:
    'Solo-built, production-deployed, multi-tenant security SaaS that unifies seven open-source scanners into one triage dashboard, deduplicates findings across tools, gates CI/CD on unresolved issues, and performs credential-free Infrastructure-as-Code attack-path analysis.',
  stack: [
    '.NET 8 Clean Architecture',
    'Angular 21',
    'PostgreSQL 16 with FORCE row-level security',
    'Azure App Service',
    'Azure Static Web Apps',
    'Azure Container Instances',
    'Key Vault',
    'Managed Identity',
    'VNet-private database',
    'Terraform',
    'Docker',
    'Python',
    'Go',
  ],
  scanners: [
    'Semgrep',
    'Gitleaks',
    'Trivy',
    'Bandit',
    'ESLint-security',
    'OSV-Scanner',
    'Checkov',
  ],
  differentiators: [
    'Credential-free Terraform attack-path engine with a typed Azure graph and ranked paths.',
    'Defense-in-depth tenant isolation with app-layer authorization plus PostgreSQL FORCE RLS under a restricted DB role.',
    'Ephemeral sandboxed scanners in Azure Container Instances with short-lived tokens.',
    'Entra ID OAuth 2.1 PKCE, SHA-256-hashed API keys, and Key Vault via Managed Identity.',
    'Self-verifying canaries for isolation and gate behavior.',
  ],
} as const;

export const secondaryProjects = [
  {
    title: 'Security Tooling Portfolio',
    description:
      'Three Python/FastAPI microservices for vulnerability scanning, assessment orchestration, and network traffic analysis, with Kubernetes objects.',
    href: profile.links.github,
    linkLabel: 'View on GitHub',
  },
  {
    title: 'Cloud Security Labs & Write-ups',
    description:
      'Hands-on cloud security labs and write-ups covering analysis, hardening, and defensive engineering practice.',
    href: 'https://github.com/jasonachkar/cybersecurity-writeups',
    linkLabel: 'Read write-ups',
  },
] as const;

export const labs = [
  {
    title: 'Terraform Attack-Path Explorer',
    href: '/labs/iac-attack-paths',
    description:
      'Explore how Terraform misconfigurations chain into Azure attack paths.',
    demonstrates:
      'Credential-free IaC graph analysis, ranked paths, and cloud mitigations.',
  },
  {
    title: 'Secure CI/CD Pipeline',
    href: '/labs/pipeline',
    description:
      'Replay multi-scanner pipeline runs with deduplication and policy gates.',
    demonstrates:
      'SAST, secrets, SCA, IaC stages, canonical deduplication, and blocking gates.',
  },
  {
    title: 'Multi-Tenant Access Control',
    href: '/labs/access-control',
    description:
      'Test role permissions and cross-tenant isolation across two enforcement layers.',
    demonstrates:
      'RBAC/IAM, app-layer authorization, and PostgreSQL row-level security.',
  },
] as const;

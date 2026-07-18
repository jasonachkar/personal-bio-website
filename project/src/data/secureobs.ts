export type SecureObsStat = {
  value: string;
  label: string;
  detail: string;
};

export type SecureObsPillar = {
  icon: 'Layers' | 'Network' | 'ShieldCheck' | 'Boxes' | 'KeyRound' | 'GitBranch';
  title: string;
  description: string;
};

export type SecureObsTechGroup = {
  group: string;
  items: string[];
};

export type SecureObsData = {
  name: string;
  tagline: string;
  summary: string;
  liveUrl: string;
  status: string;
  stats: SecureObsStat[];
  pillars: SecureObsPillar[];
  techStack: SecureObsTechGroup[];
};

export const secureObs: SecureObsData = {
  name: 'SecureObs',
  tagline: 'DevSecOps Security Observatory',
  summary:
    'A deployed, multi-tenant DevSecOps SaaS that unifies seven open-source security scanners into a centralized triage and enforcement platform. SecureObs provides normalized findings, cross-tool correlation, CI/CD build gates, pull-request feedback, and Terraform-based Azure attack-path analysis through a .NET 8 Clean Architecture backend, Angular 21 SPA, and PostgreSQL with defense-in-depth tenant isolation.',
  liveUrl: 'https://www.secureobs.com',
  status: 'Deployed · Private beta',
  stats: [
    {
      value: '7',
      label: 'Security scanners',
      detail:
        'SAST, SCA, secrets, container, IaC, Python, and JavaScript security analysis through one versioned scanner image.',
    },
    {
      value: '240+',
      label: 'Backend tests',
      detail:
        'Unit, HTTP integration, and PostgreSQL Testcontainers coverage for authorization, RLS, ingestion, billing, deduplication, and build gates.',
    },
    {
      value: '2',
      label: 'CI/CD platforms',
      detail:
        'Managed integrations for GitHub Actions and Azure DevOps, including repository discovery, generated pipeline changes, and first-run verification.',
    },
    {
      value: '2',
      label: 'Tenant-isolation layers',
      detail:
        'Application-level authorization backed by PostgreSQL FORCE row-level security under a restricted runtime database role.',
    },
  ],
  pillars: [
    {
      icon: 'Layers',
      title: 'Multi-scanner aggregation and enforcement',
      description:
        'Runs seven security scanners through one versioned container, normalizes heterogeneous outputs into a unified finding model, correlates repeated and cross-tool results, and enforces project-specific build-gate policies.',
    },
    {
      icon: 'Network',
      title: 'IaC attack-path analysis',
      description:
        'Processes Terraform plan data inside customer-controlled CI, uploads only a sanitized topology model, and maps findings onto Azure resource relationships to surface infrastructure exposure and attack paths without receiving cloud credentials, state files, or raw plans.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Defense-in-depth multi-tenancy',
      description:
        'Combines tenant-scoped application authorization with PostgreSQL FORCE row-level security, separate migration and runtime database roles, fail-closed tenant context, and real PostgreSQL isolation regression tests.',
    },
    {
      icon: 'Boxes',
      title: 'Managed CI/CD integrations',
      description:
        'Connects GitHub and Azure DevOps repositories, discovers Terraform roots, generates reviewable pipeline changes, provisions project-scoped API keys into encrypted CI secret stores, and verifies the resulting integration.',
    },
    {
      icon: 'KeyRound',
      title: 'Identity, secrets, and auditability',
      description:
        'Uses Microsoft Entra ID with PKCE, hashed and revocable pipeline API keys, Azure Key Vault with Managed Identity, append-only administrative audit records, security headers, rate limiting, and Application Insights telemetry.',
    },
    {
      icon: 'GitBranch',
      title: 'Self-verifying release pipeline',
      description:
        'Builds, versions, signs, and publishes scanner images with SBOM and provenance attestations, updates deployed scanner configuration, scans SecureObs with its own release artifact, and validates ingestion and build-gate behavior through automated canaries.',
    },
  ],
  techStack: [
    {
      group: 'Backend',
      items: ['.NET 8', 'Clean Architecture', 'EF Core 8', 'PostgreSQL 16', 'Row-Level Security'],
    },
    {
      group: 'Frontend',
      items: ['Angular 21', 'TypeScript', 'Cytoscape'],
    },
    {
      group: 'Cloud',
      items: [
        'Azure App Service',
        'Azure Static Web Apps',
        'PostgreSQL Flexible Server',
        'Key Vault',
        'Entra ID',
      ],
    },
    {
      group: 'DevSecOps',
      items: ['GitHub Actions', 'Azure DevOps', 'Terraform', 'Docker', 'Cosign', 'Python'],
    },
  ],
};

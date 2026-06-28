import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'ses-devsecops-sdlc',
    title: 'DevSecOps Scanning and RBAC in the SDLC',
    category: 'security',
    problem:
      'Application delivery needed stronger automated security checks and clearer authorization patterns inside the development lifecycle.',
    analysis:
      'Reviewed pipeline touchpoints and application authorization needs, then identified practical places to add SAST, DAST, secrets checks, and RBAC/IAM implementation work.',
    solution:
      'Integrated DevSecOps scanning with Semgrep, OWASP ZAP, and Gitleaks in Azure DevOps workflows, while building RBAC/IAM capabilities into the application delivery path.',
    impact: {
      before: {
        incidentsPerMonth: 0,
        complianceScore: 0,
        avgResponseTime: 'Not claimed',
        vulnerabilities: 0,
      },
      after: {
        incidentsPerMonth: 0,
        complianceScore: 0,
        avgResponseTime: 'Not claimed',
        vulnerabilities: 0,
      },
      improvement: {
        incidentsReduction: 'Not claimed',
        complianceIncrease: 'Not claimed',
        responseTimeImprovement: 'Not claimed',
        vulnerabilitiesFixed: 'Not claimed',
      },
    },
    technologies: ['Azure DevOps', 'Semgrep', 'OWASP ZAP', 'Gitleaks', '.NET', 'Angular', 'RBAC'],
    lessonsLearned: [
      'Security checks are most useful when developers see clear, actionable findings in the pipeline.',
      'RBAC and IAM decisions need to be designed into workflows, not bolted on at the end.',
      'Blocking policies should be explicit and defensible to avoid noisy gates.',
    ],
    date: '2026-05-01',
    duration: 'Role scope',
    status: 'completed',
  },
  {
    id: 'matrox-diagnostic-tooling',
    title: 'Diagnostic Tooling for Deployment Misconfigurations',
    category: 'security',
    problem:
      'Customer deployment issues could be hard to triage when insecure defaults, misconfigurations, or overly permissive access settings were buried in operational details.',
    analysis:
      'Worked from support and engineering signals to understand which configuration states caused risky or unreliable outcomes.',
    solution:
      'Built Python and C# diagnostic automation that surfaced configuration problems and made remediation paths easier to reason about.',
    impact: {
      before: {
        incidentsPerMonth: 0,
        complianceScore: 0,
        avgResponseTime: 'Not claimed',
        vulnerabilities: 0,
      },
      after: {
        incidentsPerMonth: 0,
        complianceScore: 0,
        avgResponseTime: 'Not claimed',
        vulnerabilities: 0,
      },
      improvement: {
        incidentsReduction: 'Not claimed',
        complianceIncrease: 'Not claimed',
        responseTimeImprovement: 'Not claimed',
        vulnerabilitiesFixed: 'Not claimed',
      },
    },
    technologies: ['Python', 'C#', '.NET', 'Diagnostic automation'],
    lessonsLearned: [
      'Good diagnostics reduce ambiguity before security or reliability work can start.',
      'Surfacing insecure defaults is valuable even when the task is not formal detection engineering.',
      'Precise operational evidence is more defensible than broad security claims.',
    ],
    date: '2023-09-01',
    duration: 'Internship scope',
    status: 'completed',
  },
];

import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'oauth-shadow',
    title: 'OAuth Shadow Session Hijack',
    category: 'cyber',
    description:
      'Discovered mis-scoped OAuth redirect leaking session tokens. Built replay PoC, authored mitigations, and paired with teams to deploy fixes.',
    tech: ['Next.js', 'Auth0', 'Burp Suite', 'Cloudflare'],
    role: 'Security research & remediation guidance',
    repoUrl: 'https://github.com/example/oauth-shadow-report',
    demoUrl: 'https://example.com/bug-bounty-oauth',
    thumbnail: '/thumbnails/oauth.jpg',
  },
  {
    id: 'siem-detections',
    title: 'Elastic SIEM Detections & Runbooks',
    category: 'cyber',
    description:
      'Detection engineering for auth anomalies, DNS tunneling, and lateral movement. Authored Sigma rules with ATT&CK mapping and response playbooks.',
    tech: ['Elastic', 'Sigma', 'Python', 'MITRE ATT&CK'],
    role: 'Detection engineer & incident response',
    repoUrl: 'https://github.com/example/elastic-sigma-rules',
    demoUrl: 'https://example.com/siem-dash',
    thumbnail: '/thumbnails/siem.jpg',
  },
  {
    id: 'api-pentest-lab',
    title: 'API Pentest Lab Pipeline',
    category: 'cyber',
    description:
      'Containerized vulnerable APIs with automated scans, Markdown-to-PDF reporting, and CVSS scoring helpers for training engineers.',
    tech: ['Docker', 'ZAP', 'Go', 'Grafana'],
    role: 'Lab design, exploit development',
    repoUrl: 'https://github.com/example/api-pentest-lab',
    demoUrl: 'https://example.com/api-lab',
    thumbnail: '/thumbnails/api-lab.jpg',
  },
  {
    id: 'quote-crm',
    title: 'Sales Quotation CRM',
    category: 'software',
    description:
      'Responsive CRM with quoting engine, approval workflows, PDF generation, and Redis-backed caching for multi-tenant performance.',
    tech: ['React', '.NET 7', 'PostgreSQL', 'Redis'],
    role: 'Tech lead',
    repoUrl: 'https://github.com/example/quotation-crm',
    demoUrl: 'https://example.com/quotation-crm',
    thumbnail: '/thumbnails/crm.jpg',
  },
  {
    id: 'mailer-service',
    title: 'Mailer Microservice',
    category: 'software',
    description:
      'Event-driven emailer with retries, template rendering, structured logging, and SLO dashboards.',
    tech: ['Node.js', 'TypeScript', 'BullMQ', 'SendGrid'],
    role: 'System design & implementation',
    repoUrl: 'https://github.com/example/mailer-service',
    demoUrl: 'https://example.com/mailer',
    thumbnail: '/thumbnails/mailer.jpg',
  },
  {
    id: 'observability-gateway',
    title: 'Observability API Gateway',
    category: 'software',
    description:
      'Signed URL gateway exposing domain metrics with RBAC, tracing, and synthetic monitors for proactive SLO guardrails.',
    tech: ['NestJS', 'OpenTelemetry', 'PostgreSQL', 'Grafana'],
    role: 'Platform engineering',
    repoUrl: 'https://github.com/example/observability-gateway',
    demoUrl: 'https://example.com/observability-gateway',
    thumbnail: '/thumbnails/observability.jpg',
  },
  {
    id: 'neon-skater',
    title: 'Neon Skater',
    category: 'game',
    description:
      'PlayCanvas endless runner with procedural lanes, trick multipliers, and synthwave art direction tuned for low-end devices.',
    tech: ['PlayCanvas', 'TypeScript', 'WebGL'],
    role: 'Gameplay & rendering',
    repoUrl: 'https://github.com/example/neon-skater',
    demoUrl: 'https://example.com/neon-skater',
    thumbnail: '/thumbnails/neon-skater.jpg',
  },
  {
    id: 'orbital-defense',
    title: 'Orbital Defense',
    category: 'game',
    description:
      'React Three Fiber tower defense prototype with HUD overlays, upgrade cards, and simple physics.',
    tech: ['R3F', 'Three.js', 'Cannon.js'],
    role: 'Gameplay systems',
    repoUrl: 'https://github.com/example/orbital-defense',
    demoUrl: 'https://example.com/orbital-defense',
    thumbnail: '/thumbnails/orbital.jpg',
  },
];

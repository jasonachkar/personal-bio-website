import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'azure-landing-zone',
    title: 'Azure Secure Landing Zone Baseline',
    category: 'cyber',
    description:
      'Infrastructure-as-Code implementation of Azure landing zone with security best practices. Includes network segmentation, Azure Policy enforcement, RBAC configuration, centralized logging to Log Analytics, and compliance monitoring.',
    tech: ['Azure', 'Terraform', 'Azure Policy', 'ARM Templates', 'KQL'],
    role: 'Security architecture & infrastructure automation',
    repoUrl: 'https://github.com/jasonachkar/azure-landing-zone',
    thumbnail: '/thumbnails/azure-landing-zone.jpg',
  },
  {
    id: 'sentinel-detection-pack',
    title: 'SIEM Detection Pack (Microsoft Sentinel)',
    category: 'cyber',
    description:
      'Collection of KQL-based detection rules for Azure Sentinel targeting common attack patterns. Includes detections for suspicious authentication, privilege escalation, lateral movement, and data exfiltration with MITRE ATT&CK mapping.',
    tech: ['Microsoft Sentinel', 'KQL', 'Azure Monitor', 'Logic Apps', 'MITRE ATT&CK'],
    role: 'Detection engineering & threat hunting',
    repoUrl: 'https://github.com/jasonachkar/sentinel-detections',
    thumbnail: '/thumbnails/sentinel.jpg',
  },
  {
    id: 'secure-api-gateway',
    title: 'Secure API Gateway Pattern',
    category: 'cyber',
    description:
      'Production-ready API gateway implementing security controls: JWT authentication, rate limiting, request validation, SQL injection prevention, XSS protection, and comprehensive logging. Demonstrates OWASP API Top 10 mitigations.',
    tech: ['Node.js', 'Express', 'Redis', 'JWT', 'Helmet', 'Express-validator'],
    role: 'Secure architecture & implementation',
    repoUrl: 'https://github.com/jasonachkar/secure-api-gateway',
    demoUrl: 'https://api-gateway-demo.yourdomain.com',
    thumbnail: '/thumbnails/api-gateway.jpg',
  },
  {
    id: 'threat-model-crm',
    title: 'Threat Model: CRM Web Application',
    category: 'cyber',
    description:
      'Comprehensive threat model for a multi-tenant CRM system using STRIDE methodology. Includes data flow diagrams, trust boundaries, threat identification, risk assessment, and prioritized mitigation strategies with implementation guidance.',
    tech: ['STRIDE', 'Microsoft Threat Modeling Tool', 'PlantUML', 'Markdown'],
    role: 'Security analysis & risk assessment',
    repoUrl: 'https://github.com/jasonachkar/crm-threat-model',
    thumbnail: '/thumbnails/threat-model.jpg',
  },
  {
    id: 'cloud-hardening-checklist',
    title: 'Cloud Security Hardening Checklist',
    category: 'cyber',
    description:
      'CIS Benchmark-aligned security hardening guide for Azure and AWS environments. Covers identity management, network security, encryption, logging, compliance, and automated verification scripts for continuous compliance monitoring.',
    tech: ['Azure', 'CIS Benchmarks', 'PowerShell', 'Azure CLI', 'Security Scanner'],
    role: 'Security compliance & automation',
    repoUrl: 'https://github.com/jasonachkar/cloud-hardening',
    thumbnail: '/thumbnails/cloud-hardening.jpg',
  },
  {
    id: 'devsecops-pipeline',
    title: 'DevSecOps CI/CD Security Gates',
    category: 'cyber',
    description:
      'Reference CI/CD pipeline integrating security tools: SAST scanning with SonarQube, dependency vulnerability checking, container scanning, infrastructure-as-code security validation, and automated security testing gates.',
    tech: ['GitHub Actions', 'SonarQube', 'Trivy', 'OWASP Dependency-Check', 'Terraform'],
    role: 'DevSecOps implementation & automation',
    repoUrl: 'https://github.com/jasonachkar/devsecops-pipeline',
    thumbnail: '/thumbnails/devsecops.jpg',
  },
  {
    id: 'vulnerability-scanner',
    title: 'Automated Vulnerability Scanner',
    category: 'cyber',
    description:
      'Comprehensive web application security scanner that identifies OWASP Top 10 vulnerabilities, performs CVSS scoring, and provides detailed remediation guidance. Features automated scanning, severity classification, and compliance mapping.',
    tech: ['Python', 'OWASP', 'CVSS', 'REST API', 'Security Testing'],
    role: 'Security Engineer',
    repoUrl: 'https://github.com/jasonachkar/vulnerability-scanner',
    demoUrl: '/vulnerability-scanner',
    thumbnail: '/thumbnails/vuln-scanner.jpg',
  },
  {
    id: 'network-analyzer',
    title: 'Network Traffic Analyzer',
    category: 'cyber',
    description:
      'Real-time network traffic analysis tool for detecting anomalies, security threats, and suspicious patterns. Features packet capture analysis, protocol inspection, anomaly detection, and threat intelligence integration.',
    tech: ['Python', 'Wireshark', 'NetworkX', 'Packet Analysis', 'Security Monitoring'],
    role: 'Security Engineer',
    repoUrl: 'https://github.com/jasonachkar/network-analyzer',
    thumbnail: '/thumbnails/network-analyzer.jpg',
  },
  {
    id: 'pentest-framework',
    title: 'Penetration Testing Framework',
    category: 'cyber',
    description:
      'Comprehensive penetration testing framework with automated exploit detection, vulnerability assessment, and security testing capabilities. Integrates with popular security tools and provides structured reporting.',
    tech: ['Python', 'Metasploit', 'Nmap', 'Security Testing', 'Exploit Development'],
    role: 'Security Engineer',
    repoUrl: 'https://github.com/jasonachkar/pentest-framework',
    thumbnail: '/thumbnails/pentest.jpg',
  },
];

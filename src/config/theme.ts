// Cybersecurity theme configuration

export const theme = {
  colors: {
    primary: {
      cyan: '#00f0ff',
      purple: '#a855f7',
      green: '#00ff88',
    },
    background: {
      dark: '#0a0a0f',
      card: '#13131a',
      elevated: '#1a1a24',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
      muted: '#606060',
    },
    border: {
      default: '#2a2a35',
      accent: '#00f0ff',
    },
    severity: {
      info: '#3b82f6',
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    },
  },
  animations: {
    durations: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      smooth: [0.4, 0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
    },
  },
} as const;

export const skillCategories = [
  {
    name: 'Software Development',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Python',
      'PostgreSQL',
      'Docker',
      'Azure',
      'GraphQL',
      'REST APIs',
    ],
    icon: 'Code2',
  },
  {
    name: 'Cybersecurity',
    skills: [
      'Web Application Security',
      'SIEM (Splunk, ELK)',
      'Threat Hunting',
      'Incident Response',
      'OWASP Top 10',
      'Bug Bounty',
      'Penetration Testing',
      'Security Automation',
      'Vulnerability Assessment',
      'MITRE ATT&CK',
    ],
    icon: 'Shield',
  },
  {
    name: 'Cloud & Platform Security',
    skills: [
      'Azure DevOps',
      'GitHub Administration',
      'Terraform',
      'Key Vault',
      'Managed Identity',
      'KQL',
      'CI/CD Governance',
      'Platform Automation',
    ],
    icon: 'Cloud',
  },
] as const;

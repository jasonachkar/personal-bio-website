export type SectionId =
  | 'hero'
  | 'about'
  | 'certifications'
  | 'experience'
  | 'projects'
  | 'writeups'
  | 'contact';

export type NavItem = {
  id: SectionId;
  label: string;
};

export type SkillCategory = {
  title: string;
  summary: string;
  tools: string[];
};

export type Project = {
  id: string;
  title: string;
  category: 'cyber' | 'software' | 'game';
  description: string;
  tech: string[];
  role: string;
  repoUrl: string;
  demoUrl?: string;
  thumbnail: string;
};

export type CallToAction = {
  label: string;
  href: string;
  kind: 'primary' | 'ghost';
};

export type SocialLink = {
  label: string;
  href: string;
  type: 'email' | 'linkedin' | 'github' | 'resume-download' | 'resume-preview';
};

export type Game = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
};

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertCategory = 'auth' | 'network' | 'endpoint' | 'appsec' | 'iam';

export type SiemAlert = {
  id: string;
  title: string;
  severity: AlertSeverity;
  category: AlertCategory;
  source: string;
  status: 'Open' | 'Investigating' | 'Closed';
  timestamp: string;
  description: string;
};

export type SiemLog = {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  source: string;
  timestamp: string;
};

export type IntelItem = {
  id: string;
  label: string;
  detail: string;
  risk: AlertSeverity;
  reference: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  badge?: string;
  skills: string[];
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: 'completed' | 'in-progress';
  highlights: string[];
  relevantCourses?: string[];
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'full-time' | 'contract' | 'part-time';
  achievements: string[];
  securityHighlights: string[];
  technologies: string[];
};

export type Writeup = {
  id: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  content?: string;
  category: 'tutorial' | 'research' | 'certification-notes' | 'lab-report' | 'analysis';
  githubUrl?: string;
};

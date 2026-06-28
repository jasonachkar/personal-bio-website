import { z } from 'zod';

// Hero Schema
export const heroStatsSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1),
});

export const heroCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(['primary', 'ghost']),
});

export const heroSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  blurb: z.string().min(1),
  currentFocus: z.array(z.string().min(1)).min(1),
  stats: z.array(heroStatsSchema).min(1),
  ctas: z.array(heroCtaSchema).min(1),
});

// About Schema
export const coreStrengthSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const aboutSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  focusAreas: z.array(z.string().min(1)).min(1),
  coreStrengths: z.array(coreStrengthSchema).min(1),
});

// Certifications Schema
export const certificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
});

export const certificationsSchema = z.array(certificationSchema);

// Education Schema
export const educationItemSchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  status: z.enum(['in-progress', 'completed']),
  highlights: z.array(z.string().min(1)).min(1),
  relevantCourses: z.array(z.string().min(1)).min(1),
});

export const educationSchema = z.array(educationItemSchema);

// Experience Schema
export const experienceItemSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  achievements: z.array(z.string().min(1)).min(1),
  securityHighlights: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).min(1),
});

export const experienceSchema = z.array(experienceItemSchema);

// Projects Schema
export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  tech: z.array(z.string().min(1)).min(1),
  role: z.string().min(1),
  repoUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  thumbnail: z.string().optional(),
});

export const projectsSchema = z.array(projectSchema);

// SecureObs (flagship) Schema
export const secureObsStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export const secureObsPillarSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const secureObsTechGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const secureObsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  liveUrl: z.string().url(),
  sourceUrl: z.string().url(),
  status: z.string().min(1),
  stats: z.array(secureObsStatSchema).min(1),
  pillars: z.array(secureObsPillarSchema).min(1),
  techStack: z.array(secureObsTechGroupSchema).min(1),
});

// Skills Schema
export const skillGroupSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const skillPrincipleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const skillsSchema = z.object({
  intro: z.string().min(1),
  groups: z.array(skillGroupSchema).min(1),
  principles: z.array(skillPrincipleSchema).min(1),
});

// Writeups Schema
export const writeupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  readingTime: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  category: z.enum(['tutorial', 'research', 'certification-notes', 'lab-report', 'analysis']),
  githubUrl: z.string().url().optional(),
});

export const writeupsSchema = z.array(writeupSchema);

// Contact Schema
export const contactSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  success: z.string().min(1),
  error: z.string().min(1),
});

// Social Schema
export const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  type: z.enum(['email', 'linkedin', 'github', 'resume-download', 'resume-preview']),
});

export const socialSchema = z.array(socialLinkSchema);

// SIEM Schemas
export const eventSourceSchema = z.object({
  type: z.enum(['endpoint', 'network', 'application', 'cloud']),
  name: z.string().min(1),
  agent: z.string().optional(),
});

export const actorSchema = z.object({
  username: z.string().optional(),
  userId: z.string().optional(),
  ipAddress: z.string().optional(),
  hostname: z.string().optional(),
  processName: z.string().optional(),
  processId: z.number().optional(),
});

export const targetSchema = z.object({
  resource: z.string().optional(),
  hostname: z.string().optional(),
  ipAddress: z.string().optional(),
  port: z.number().optional(),
  protocol: z.string().optional(),
});

export const eventDetailsSchema = z.object({
  action: z.string().min(1),
  result: z.enum(['success', 'failure', 'blocked']),
  reason: z.string().optional(),
}).catchall(z.any()); // Allow additional fields

export const eventEnrichmentSchema = z.object({
  mitreTactics: z.array(z.string()).optional(),
  mitreTechniques: z.array(z.string()).optional(),
  riskScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export const securityEventSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  eventType: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  source: eventSourceSchema,
  actor: actorSchema,
  target: targetSchema.optional(),
  details: eventDetailsSchema,
  enrichment: eventEnrichmentSchema.optional(),
  rawLog: z.string().optional(),
});

export const detectionRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  enabled: z.boolean(),
  mitre: z.object({
    tactics: z.array(z.string()).min(1),
    techniques: z.array(z.string()).min(1),
  }),
  query: z.string().min(1),
  timeWindow: z.object({
    duration: z.number().positive(),
    threshold: z.number().positive(),
    groupBy: z.array(z.string()).optional(),
  }).optional(),
  author: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()),
  alertTemplate: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    recommendations: z.array(z.string()).min(1),
  }).optional(),
});

export const siemEventsSchema = z.array(securityEventSchema);
export const detectionRulesSchema = z.array(detectionRuleSchema);

// Azure Architecture Schemas
export const azureMisconfigurationSchema = z.object({
  issue: z.string().min(1),
  risk: z.enum(['Low', 'Medium', 'High', 'Critical']),
  fix: z.string().min(1),
});

export const azureComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  securityControls: z.array(z.string()).min(1),
  commonMisconfigurations: z.array(azureMisconfigurationSchema),
  bestPractices: z.array(z.string()).min(1),
});

export const azureCisControlSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  implementation: z.string().min(1),
});

export const azureArchitectureSchema = z.object({
  components: z.array(azureComponentSchema),
  cisControls: z.array(azureCisControlSchema).optional(),
  architecturePatterns: z.any().optional(),
}).passthrough();

// Threat Modeling Schemas
// Using very permissive schema - complex nested structure causes Zod issues
export const threatModelComponentSchema = z.any();
export const threatModelDataFlowSchema = z.any();
export const threatModelThreatSchema = z.any();
export const threatModelTemplateSchema = z.any();

// Type exports for TypeScript
export type Hero = z.infer<typeof heroSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Education = z.infer<typeof educationItemSchema>;
export type Experience = z.infer<typeof experienceItemSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SecureObs = z.infer<typeof secureObsSchema>;
export type SecureObsPillar = z.infer<typeof secureObsPillarSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Writeup = z.infer<typeof writeupSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SecurityEvent = z.infer<typeof securityEventSchema>;
export type DetectionRule = z.infer<typeof detectionRuleSchema>;
export type AzureComponent = z.infer<typeof azureComponentSchema>;
export type AzureArchitecture = z.infer<typeof azureArchitectureSchema>;
export type ThreatModelComponent = z.infer<typeof threatModelComponentSchema>;
export type ThreatModelThreat = z.infer<typeof threatModelThreatSchema>;
export type ThreatModelTemplate = z.infer<typeof threatModelTemplateSchema>;

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

// SecureObs Schema
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
  sourceUrl: z.string().url().optional(),
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

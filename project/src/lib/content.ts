import fs from 'fs';
import path from 'path';
import {
  heroSchema,
  aboutSchema,
  certificationsSchema,
  educationSchema,
  experienceSchema,
  projectsSchema,
  writeupsSchema,
  contactSchema,
  socialSchema,
  type Hero,
  type About,
  type Certification,
  type Education,
  type Experience,
  type Project,
  type Writeup,
  type Contact,
  type SocialLink,
} from './schemas';

const contentDir = path.join(process.cwd(), '..', 'content');

function readJsonFile<T>(filename: string, schema: any): T {
  try {
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return schema.parse(jsonData);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

export function getHero(): Hero {
  return readJsonFile<Hero>('hero.json', heroSchema);
}

export function getAbout(): About {
  return readJsonFile<About>('about.json', aboutSchema);
}

export function getCertifications(): Certification[] {
  return readJsonFile<Certification[]>('certifications.json', certificationsSchema);
}

export function getEducation(): Education[] {
  return readJsonFile<Education[]>('education.json', educationSchema);
}

export function getExperience(): Experience[] {
  return readJsonFile<Experience[]>('experience.json', experienceSchema);
}

export function getProjects(): Project[] {
  return readJsonFile<Project[]>('projects.json', projectsSchema);
}

export function getWriteups(): Writeup[] {
  return readJsonFile<Writeup[]>('writeups.json', writeupsSchema);
}

export function getContact(): Contact {
  return readJsonFile<Contact>('contact.json', contactSchema);
}

export function getSocial(): SocialLink[] {
  return readJsonFile<SocialLink[]>('social.json', socialSchema);
}

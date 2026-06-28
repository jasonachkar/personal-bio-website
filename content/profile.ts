export const profile = {
  name: 'Jason Achkar Diab',
  headline: 'DevSecOps & Cloud Security Engineer',
  positioning:
    'Builder + defender focused on secure CI/CD, Infrastructure as Code, and multi-tenant cloud systems on Azure.',
  location: 'Montreal, QC',
  availability: 'Open to remote',
  languages: ['English', 'French', 'Arabic'],
  links: {
    github: 'https://github.com/jasonachkar',
    linkedin: 'https://www.linkedin.com/in/jason-achkar-diab',
    email: 'jasonachkardiab@gmail.com',
    secureObs: 'https://www.secureobs.com',
    secureObsSource: 'https://github.com/jasonachkar/secure-obs',
    resume: '/resume.pdf',
  },
} as const;

export const education = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'M.S. Cybersecurity, Information Security specialization',
    location: 'Online (OMS Cybersecurity)',
    dates: 'In progress, 2026-2028',
  },
  {
    school: 'Concordia University',
    degree: 'B.Sc. Computer Science',
    location: 'Montreal, QC',
    dates: 'April 2025',
  },
] as const;

export const certifications = [
  'CompTIA Security+',
  'Microsoft Azure Fundamentals (AZ-900)',
  'Google Cybersecurity Professional Certificate',
  'SC-500: Microsoft Cloud & AI Security Engineer (in progress)',
] as const;

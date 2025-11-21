import type { SocialLink } from './types';

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/jasonachkar', type: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jasonachkar', type: 'linkedin' },
  {
    label: 'Download Resume',
    href: '/resume.pdf',
    type: 'resume-download',
  },
  {
    label: 'Preview Resume',
    href: '/resume.pdf',
    type: 'resume-preview',
  },
  { label: 'Email', href: 'mailto:jason.achkar@example.com', type: 'email' },
];

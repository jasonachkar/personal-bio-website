import type { SocialLink } from './types';

export const socialLinks: SocialLink[] = [
  { label: 'Email', href: 'mailto:jason.achkar@example.com', type: 'email' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jasonachkar', type: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/jasonachkar', type: 'github' },
  {
    label: 'Download Resume',
    href: '/resume.pdf',
    type: 'resume-download',
  },
];

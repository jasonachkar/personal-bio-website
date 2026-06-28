import type { Metadata, Viewport } from 'next';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { profile } from '@/content/profile';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jasonachkardiab.com'),
  title: {
    default: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    template: '%s | Jason Achkar Diab',
  },
  description:
    'DevSecOps and cloud security portfolio focused on SecureObs, secure CI/CD, Infrastructure as Code attack-path analysis, and multi-tenant Azure systems.',
  authors: [{ name: profile.name }],
  keywords: [
    'DevSecOps',
    'Cloud Security',
    'Azure',
    'Secure CI/CD',
    'Infrastructure as Code',
    'Terraform',
    'SecureObs',
    'Application Security',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description:
      'SecureObs, secure CI/CD, Terraform attack-path analysis, and multi-tenant Azure security systems.',
    siteName: 'Jason Achkar Diab',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'Jason Achkar Diab portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description:
      'SecureObs, secure CI/CD, Terraform attack-path analysis, and multi-tenant Azure security systems.',
    images: ['/og.svg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#080c0f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

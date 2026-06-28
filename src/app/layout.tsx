import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
  description:
    'DevSecOps and cloud security portfolio focused on secure CI/CD, Infrastructure as Code attack-path analysis, Azure hardening, and multi-tenant SaaS security.',
  keywords: [
    'Jason Achkar Diab',
    'DevSecOps',
    'cloud security',
    'Azure security',
    'cybersecurity',
    'secure CI/CD',
    'Infrastructure as Code',
    'Terraform security',
    'SecureObs',
    'React',
    'TypeScript',
    'Next.js',
  ],
  authors: [{ name: 'Jason Achkar Diab' }],
  openGraph: {
    type: 'website',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description:
      'Production secure CI/CD, IaC attack-path analysis, Azure hardening, and multi-tenant SaaS security.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description:
      'Secure CI/CD, IaC attack-path analysis, Azure hardening, and SecureObs.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans bg-background text-text-primary antialiased">
        <SmoothScrollProvider />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

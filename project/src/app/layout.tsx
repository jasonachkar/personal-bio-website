import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
  description:
    'DevSecOps, cloud security, and application security portfolio for Jason Achkar Diab, featuring SecureObs, Azure security engineering, CI/CD security gates, and secure software work.',
  keywords: [
    'Jason Achkar Diab',
    'DevSecOps',
    'cybersecurity',
    'cloud security',
    'application security',
    'Azure security',
    'SecureObs',
    'CI/CD security',
    'secure software development',
    'Terraform security',
    'AppSec',
  ],
  authors: [{ name: 'Jason Achkar Diab' }],
  openGraph: {
    type: 'website',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description:
      'SecureObs-focused portfolio covering DevSecOps, Azure security, application security, and secure-by-design engineering.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

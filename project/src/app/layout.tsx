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
  title: 'Jason Achkar Diab | DevSecOps & Platform Engineer — Cloud Security',
  description:
    'Portfolio of Jason Achkar Diab: DevSecOps and platform engineering, Azure cloud security, detection engineering, and SecureObs — a multi-tenant security observability SaaS. Featuring a live SIEM console, MITRE ATT&CK coverage map, and CVE threat intel feed.',
  keywords: [
    'cybersecurity',
    'DevSecOps',
    'cloud security',
    'Azure',
    'detection engineering',
    'SIEM',
    'MITRE ATT&CK',
    'application security',
    'React',
    'TypeScript',
    'Next.js',
  ],
  authors: [{ name: 'Jason Achkar Diab' }],
  openGraph: {
    type: 'website',
    title: 'Jason Achkar Diab | DevSecOps & Cloud Security Engineer',
    description: 'DevSecOps & Platform Engineer · Cloud Security · Detection Engineering',
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

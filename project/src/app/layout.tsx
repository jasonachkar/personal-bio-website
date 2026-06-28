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
  title: 'Jason Achkar Diab — DevSecOps & Cloud Security Engineer',
  description:
    'DevSecOps and cloud security engineer building secure CI/CD pipelines, infrastructure-as-code, and multi-tenant cloud systems on Azure. Creator of SecureObs, a production security SaaS unifying seven scanners with CI/CD build gating and IaC attack-path analysis.',
  keywords: [
    'DevSecOps',
    'cloud security',
    'application security',
    'Azure security',
    'CI/CD security',
    'infrastructure as code',
    'Terraform',
    'SecureObs',
    'secure SDLC',
    'Jason Achkar Diab',
  ],
  authors: [{ name: 'Jason Achkar Diab' }],
  openGraph: {
    type: 'website',
    title: 'Jason Achkar Diab — DevSecOps & Cloud Security Engineer',
    description:
      'Building security into the SDLC and shipping it to production. Creator of SecureObs, a multi-tenant security SaaS on Azure.',
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

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
  title: 'Jason Achkar Diab | Platform Engineer & DevSecOps Builder',
  description:
    'Platform engineering and DevSecOps portfolio for Jason Achkar Diab, featuring SecureObs, CI/CD controls, developer tooling, and secure delivery systems.',
  keywords: [
    'Jason Achkar Diab',
    'platform engineer',
    'DevSecOps',
    'cybersecurity',
    'developer tooling',
    'SecureObs',
    'CI/CD security',
    'secure software development',
    'Terraform security',
  ],
  authors: [{ name: 'Jason Achkar Diab' }],
  openGraph: {
    type: 'website',
    title: 'Jason Achkar Diab | Platform Engineer & DevSecOps Builder',
    description:
      'Portfolio covering platform engineering, SecureObs, CI/CD controls, developer tooling, and secure delivery systems.',
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

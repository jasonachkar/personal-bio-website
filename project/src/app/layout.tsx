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
  title: 'Cybersecurity Portfolio | Full-Stack Developer & Security Researcher',
  description:
    'Personal portfolio showcasing software development, cybersecurity research, and game development projects. Featuring SIEM simulator, PlayCanvas games, and security tools.',
  keywords: [
    'cybersecurity',
    'full-stack developer',
    'security researcher',
    'game developer',
    'SIEM',
    'penetration testing',
    'React',
    'TypeScript',
    'Next.js',
  ],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    title: 'Cybersecurity Portfolio',
    description: 'Full-Stack Developer " Cybersecurity Analyst " Game Developer',
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

import Link from 'next/link';
import { Container } from './Container';
import { profile } from '@/content/profile';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/labs', label: 'Labs' },
  { href: '/writing', label: 'Writing' },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-text-primary">
          {profile.name}
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}

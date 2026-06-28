import { Container } from './Container';
import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col gap-3 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name} - {new Date().getFullYear()}
        </p>
        <p>Built with Next.js, TypeScript, Tailwind.</p>
      </Container>
    </footer>
  );
}

import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-card py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-text-secondary">
          <span>Built with</span>
          <Heart className="h-4 w-4 text-severity-high" />
          <span>using Next.js, TypeScript, Tailwind CSS and Supabase</span>
        </div>
        <p className="text-sm text-text-muted">
          {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

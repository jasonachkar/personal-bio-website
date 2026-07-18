import { ShieldCheck } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background-card">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />

      <div className="content-container relative py-8">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">
                Securing the path from commit to cloud.
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Cloud Security <span aria-hidden="true">·</span> DevSecOps{' '}
                <span aria-hidden="true">·</span> AppSec
              </p>
            </div>
          </div>

          <div className="text-sm text-text-muted sm:text-right">
            <p>© {currentYear} Jason Achkar Diab</p>
            <p className="mt-1 terminal-text text-xs text-primary/80">
              BUILD SECURE. SHIP WITH CONFIDENCE.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

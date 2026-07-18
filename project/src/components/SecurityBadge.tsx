'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Security scorecard pill linking to an independent securityheaders.com scan
 * so visitors can verify the site's security posture themselves.
 */
export function SecurityBadge({ className }: { className?: string }) {
  return (
    <a
      href="https://securityheaders.com/?q=jasonachkardiab.com&followRedirects=on"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex w-fit items-center gap-2',
        'rounded-full border border-border bg-background-elevated/60',
        'px-3 py-1.5',
        'text-[10px] text-text-muted sm:text-xs',
        'transition-colors duration-200',
        'hover:border-primary/40 hover:text-text-secondary',
        className
      )}
      title="Verify this site's security headers independently"
    >
      <Lock className="h-3 w-3 flex-shrink-0 text-primary" aria-hidden="true" />
      <span>This site: CSP enforced · HSTS enabled · No trackers · Scanned clean</span>
    </a>
  );
}

export default SecurityBadge;

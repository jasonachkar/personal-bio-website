import type { Severity } from '@/content/types';
import { cn } from '@/lib/cn';

const severityClasses: Record<Severity, string> = {
  critical: 'border-severity-critical/30 bg-severity-critical/10 text-severity-critical',
  high: 'border-severity-high/30 bg-severity-high/10 text-severity-high',
  medium: 'border-severity-medium/30 bg-severity-medium/10 text-severity-medium',
  low: 'border-severity-low/30 bg-severity-low/10 text-severity-low',
};

export function SeverityPill({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-1 text-xs font-semibold uppercase',
        severityClasses[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}

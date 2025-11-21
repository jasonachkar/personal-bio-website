import type { AlertSeverity } from '../../data/types';
import { cn } from '../../lib/cn';
import { severityBg, severityColors } from '../../utils/severity';

type SeverityPillProps = {
  severity: AlertSeverity;
  className?: string;
};

const SeverityPill = ({ severity, className }: SeverityPillProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs uppercase tracking-wide',
      severityBg[severity],
      severityColors[severity],
      className,
    )}
  >
    <span className="h-2 w-2 rounded-full bg-current" />
    {severity}
  </span>
);

export default SeverityPill;

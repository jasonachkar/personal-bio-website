import { cn } from '../../lib/cn';

type BadgeProps = {
  label: string;
  className?: string;
};

const Badge = ({ label, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-border bg-background-elevated px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary',
      className,
    )}
  >
    {label}
  </span>
);

export default Badge;

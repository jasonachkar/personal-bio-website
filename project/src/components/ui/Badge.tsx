import { cn } from '../../lib/cn';

type BadgeProps = {
  label: string;
  className?: string;
};

const Badge = ({ label, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 shadow-inner shadow-black/30',
      className,
    )}
  >
    {label}
  </span>
);

export default Badge;

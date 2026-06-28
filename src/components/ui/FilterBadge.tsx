'use client';

import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface FilterBadgeProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  default: 'bg-background-card text-text-primary border-border hover:border-border-accent',
  primary: 'bg-primary/10 text-primary border-primary/20 hover:border-primary/40',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:border-secondary/40',
  success: 'bg-severity-low/10 text-severity-low border-severity-low/20 hover:border-severity-low/40',
  warning: 'bg-severity-medium/10 text-severity-medium border-severity-medium/20 hover:border-severity-medium/40',
  danger: 'bg-severity-critical/10 text-severity-critical border-severity-critical/20 hover:border-severity-critical/40',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function FilterBadge({
  label,
  onRemove,
  variant = 'default',
  size = 'md',
  className,
}: FilterBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <span>{label}</span>

      {onRemove && (
        <button
          onClick={onRemove}
          className={cn(
            'hover:opacity-70 transition-opacity rounded-sm',
            'focus:outline-none focus-visible:ring-1 focus-visible:ring-current'
          )}
          aria-label={`Remove ${label} filter`}
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}

// FilterBadgeGroup component for managing multiple badges
interface FilterBadgeGroupProps {
  filters: Array<{
    id: string;
    label: string;
    variant?: FilterBadgeProps['variant'];
  }>;
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterBadgeGroup({ filters, onRemove, onClearAll, className }: FilterBadgeGroupProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-text-secondary">Active filters:</span>

      {filters.map((filter) => (
        <FilterBadge
          key={filter.id}
          label={filter.label}
          variant={filter.variant}
          onRemove={() => onRemove(filter.id)}
        />
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
          type="button"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

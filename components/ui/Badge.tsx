import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

export function Badge({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-elevated px-2 py-1 text-xs font-medium text-text-secondary',
        className,
      )}
      {...props}
    />
  );
}

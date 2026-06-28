import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({ className, variant = 'rectangular', animation = 'shimmer' }: SkeletonProps) {
  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-background-card via-background-elevated to-background-card bg-[length:200%_100%]',
    none: '',
  };

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'bg-background-card',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

// Skeleton variants for common use cases

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'w-full',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-lg border border-border bg-background-card', className)}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="h-5 w-1/3" />
          <SkeletonText lines={2} />
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rectangular" className="h-6 w-16" />
            <Skeleton variant="rectangular" className="h-6 w-16" />
            <Skeleton variant="rectangular" className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b border-border/50">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              className={cn(
                'h-4',
                colIndex === 0 ? 'w-1/4' : colIndex === columns - 1 ? 'w-1/6' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
}

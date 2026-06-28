'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { badgeVariants, transitions } from '@/utils/animations';
import type { ReactNode } from 'react';

// ============================================
// Enhanced Badge Component
// ============================================

/**
 * Badge component variant types
 * @description Defines the visual appearance of badge components
 */
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'cyber';

/**
 * Badge size options
 * @description Defines the size of badge components
 */
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Badge component props interface
 * @interface BadgeProps
 * @description Props for the enhanced Badge component
 */
interface BadgeProps {
  /** Text content of the badge */
  label: string;
  /** Additional CSS classes for customization */
  className?: string;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Optional icon to display before the label */
  icon?: ReactNode;
  /** Whether the badge should have hover animation */
  interactive?: boolean;
  /** Whether to show a dot indicator */
  dot?: boolean;
  /** Color for the dot indicator */
  dotColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

/**
 * Size class mapping for badges
 * @description Maps size presets to Tailwind classes
 */
const sizeClasses: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm',
};

/**
 * Get variant-specific classes for the badge
 * @param variant - The badge variant
 * @returns CSS classes for the variant
 */
const getVariantClasses = (variant: BadgeVariant): string => {
  switch (variant) {
    case 'primary':
      return cn(
        'bg-primary/15 text-primary border-primary/30',
        'hover:bg-primary/25 hover:border-primary/50'
      );
    case 'secondary':
      return cn(
        'bg-secondary/15 text-secondary border-secondary/30',
        'hover:bg-secondary/25 hover:border-secondary/50'
      );
    case 'accent':
      return cn(
        'bg-accent/15 text-accent border-accent/30',
        'hover:bg-accent/25 hover:border-accent/50'
      );
    case 'outline':
      return cn(
        'bg-transparent text-text-secondary border-border',
        'hover:bg-background-elevated hover:text-text-primary hover:border-primary/30'
      );
    case 'ghost':
      return cn(
        'bg-transparent text-text-muted border-transparent',
        'hover:bg-background-elevated hover:text-text-primary'
      );
    case 'cyber':
      return cn(
        'bg-primary/10 text-primary border-primary/40',
        'hover:bg-primary/20 hover:border-primary/60',
        'shadow-[0_0_10px_rgba(0,212,255,0.1)]',
        'hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]'
      );
    default:
      return cn(
        'bg-background-elevated text-text-secondary border-border',
        'hover:bg-background-elevated hover:text-text-primary hover:border-primary/30'
      );
  }
};

/**
 * Dot color class mapping
 */
const dotColorClasses: Record<NonNullable<BadgeProps['dotColor']>, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-severity-low',
  warning: 'bg-severity-medium',
  error: 'bg-severity-high',
};

/**
 * Enhanced Badge Component
 * @description A versatile badge component with multiple variants and sizes
 * @example
 * ```tsx
 * <Badge label="TypeScript" variant="primary" size="sm" />
 * <Badge label="Active" variant="cyber" dot dotColor="success" />
 * ```
 */
const Badge = ({
  label,
  className,
  variant = 'default',
  size = 'sm',
  icon,
  interactive = true,
  dot = false,
  dotColor = 'primary',
}: BadgeProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Combined classes
  const badgeClasses = cn(
    // Base styles
    'inline-flex items-center justify-center gap-1.5',
    'rounded-full border font-medium',
    'transition-all duration-200',
    // Size classes
    sizeClasses[size],
    // Variant classes
    getVariantClasses(variant),
    // Cursor style
    interactive && 'cursor-default',
    className
  );

  // Badge content
  const content = (
    <>
      {/* Dot indicator */}
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            'animate-pulse',
            dotColorClasses[dotColor]
          )}
        />
      )}
      {/* Optional icon */}
      {icon && (
        <span className="flex-shrink-0 -ml-0.5">{icon}</span>
      )}
      {/* Label text */}
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  // Render without animation if reduced motion is preferred
  if (prefersReducedMotion || !interactive) {
    return <span className={badgeClasses}>{content}</span>;
  }

  // Render with hover animation
  return (
    <motion.span
      className={badgeClasses}
      variants={badgeVariants}
      initial="rest"
      whileHover="hover"
      transition={transitions.fast}
      style={{ willChange: 'transform' }}
    >
      {content}
    </motion.span>
  );
};

export default Badge;

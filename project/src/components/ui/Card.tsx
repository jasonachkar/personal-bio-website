'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cardHoverVariants, cardHoverSubtle, transitions, easings } from '@/utils/animations';
import type { CardVariant, CardHoverEffect } from '@/types';

// ============================================
// Enhanced Card Component
// ============================================

/**
 * Card component props interface
 * @interface CardProps
 * @description Props for the enhanced Card component with advanced styling
 */
interface CardProps {
  /** Child elements to render inside the card */
  children: ReactNode;
  /** Additional CSS classes for customization */
  className?: string;
  /** Visual style variant of the card */
  variant?: CardVariant;
  /** Hover effect type */
  hoverEffect?: CardHoverEffect;
  /** Whether to show the glow effect */
  glow?: boolean;
  /** Whether to show the gradient border */
  gradientBorder?: boolean;
  /** Padding size preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether card is interactive (shows hover effects) */
  interactive?: boolean;
}

/**
 * Padding size class mapping
 * @description Maps padding size presets to Tailwind classes
 */
const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5 md:p-6',
  lg: 'p-5 sm:p-6 md:p-8',
  xl: 'p-6 sm:p-8 md:p-10',
};

/**
 * Get variant-specific classes for the card
 * @param variant - The card variant
 * @returns CSS classes for the variant
 */
const getVariantClasses = (variant: CardVariant): string => {
  switch (variant) {
    case 'glass':
      return cn(
        'bg-background-card/60 backdrop-blur-xl',
        'border border-white/10 dark:border-white/5',
        'shadow-glass dark:shadow-glass-dark'
      );
    case 'elevated':
      return cn(
        'bg-background-card',
        'border border-border',
        'shadow-lg shadow-black/5 dark:shadow-black/20'
      );
    case 'gradient':
      return cn(
        'bg-gradient-to-br from-background-card via-background-card to-background-elevated',
        'border border-border'
      );
    case 'cyber':
      return cn(
        'bg-background-card/80 backdrop-blur-lg',
        'border border-primary/20 dark:border-primary/30',
        'shadow-[0_0_15px_rgba(0,212,255,0.1)] dark:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
        'after:absolute after:inset-0 after:rounded-[inherit]',
        'after:bg-gradient-to-br after:from-primary/5 after:via-transparent after:to-accent/5',
        'after:pointer-events-none after:z-0'
      );
    default:
      return cn(
        'bg-background-card',
        'border border-border',
        'shadow-card'
      );
  }
};

/**
 * Get hover effect variants for the card
 * @param effect - The hover effect type
 * @param interactive - Whether the card is interactive
 * @returns Framer Motion variants
 */
const getHoverVariants = (effect: CardHoverEffect, interactive: boolean) => {
  if (!interactive || effect === 'none') {
    return undefined;
  }

  switch (effect) {
    case 'lift':
      return cardHoverVariants;
    case 'scale':
      return cardHoverSubtle;
    case 'glow':
      return {
        rest: {
          boxShadow: '0 0 0 rgba(0, 212, 255, 0)',
        },
        hover: {
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.25), 0 0 60px rgba(0, 212, 255, 0.1)',
          transition: {
            duration: 0.4,
            ease: easings.easeOutCubic,
          },
        },
      };
    case 'tilt':
      return cardHoverVariants;
    default:
      return cardHoverVariants;
  }
};

/**
 * Enhanced Card Component
 * @description A versatile card component with multiple variants and hover effects
 * @example
 * ```tsx
 * <Card variant="glass" hoverEffect="lift" padding="lg">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
const Card = ({
  children,
  className,
  variant = 'default',
  hoverEffect = 'lift',
  glow = false,
  gradientBorder = false,
  padding = 'md',
  interactive = true,
}: CardProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Base card classes
  const baseClasses = cn(
    'relative overflow-hidden rounded-2xl',
    'transition-colors duration-300',
    paddingClasses[padding]
  );

  // Variant-specific classes
  const variantClasses = getVariantClasses(variant);

  // Glow effect classes
  const glowClasses = glow
    ? cn(
        'before:absolute before:inset-0 before:-z-10',
        'before:bg-gradient-to-r before:from-primary/20 before:via-accent/15 before:to-secondary/20',
        'before:opacity-0 before:blur-2xl before:transition-opacity before:duration-500',
        'hover:before:opacity-100'
      )
    : '';

  // Gradient border classes
  const gradientBorderClasses = gradientBorder
    ? cn(
        'before:absolute before:inset-[-2px] before:-z-10 before:rounded-[18px]',
        'before:bg-gradient-to-br before:from-primary before:via-accent before:to-secondary',
        'before:opacity-50 before:transition-opacity before:duration-300',
        'hover:before:opacity-100'
      )
    : '';

  // Interactive hover classes (CSS fallback)
  const interactiveClasses = interactive
    ? cn(
        'hover:border-primary/40 dark:hover:border-primary/50',
        'hover:shadow-card-hover',
        'cursor-pointer'
      )
    : '';

  // Combined classes
  const cardClasses = cn(
    baseClasses,
    variantClasses,
    glowClasses,
    gradientBorderClasses,
    interactiveClasses,
    className
  );

  // If reduced motion, use simple CSS transitions
  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          cardClasses,
          'transition-all duration-200',
          interactive && 'hover:shadow-lg'
        )}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Get hover variants based on effect type
  const variants = getHoverVariants(hoverEffect, interactive);

  return (
    <motion.div
      className={cardClasses}
      variants={variants}
      initial="rest"
      whileHover={interactive ? 'hover' : undefined}
      transition={transitions.fast}
      style={{
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      {/* Inner content wrapper */}
      <div className="relative z-10">{children}</div>

      {/* Animated border glow on hover (for cyber variant) */}
      {variant === 'cyber' && interactive && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1))',
          }}
        />
      )}
    </motion.div>
  );
};

export default Card;

'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buttonVariants, transitions, easings } from '@/utils/animations';

// ============================================
// Enhanced Button Component
// ============================================

/**
 * Button variant types
 * @description Defines the visual appearance of button components
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'cyber';

/**
 * Button size types
 * @description Defines the size of button components
 */
type Size = 'sm' | 'md' | 'lg';

/**
 * Common button props
 * @interface CommonProps
 */
interface CommonProps {
  /** Visual style variant */
  variant?: Variant;
  /** Size of the button */
  size?: Size;
  /** Optional icon element */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button props - union of button and anchor props
 */
type ButtonProps =
  | (CommonProps &
      ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
      })
  | (CommonProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

/**
 * Variant styles mapping
 * @description CSS classes for each button variant
 */
const variantStyles: Record<Variant, string> = {
  primary: cn(
    'bg-primary text-white',
    'hover:bg-primary-hover',
    'shadow-button hover:shadow-button-hover',
    'border border-primary/20'
  ),
  secondary: cn(
    'bg-accent text-white',
    'hover:bg-accent-hover',
    'shadow-button hover:shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]',
    'border border-accent/20'
  ),
  outline: cn(
    'bg-transparent text-primary',
    'border-2 border-primary',
    'hover:bg-primary/10 dark:hover:bg-primary/15'
  ),
  ghost: cn(
    'bg-transparent text-text-primary',
    'hover:bg-background-elevated',
    'border border-transparent hover:border-border'
  ),
  danger: cn(
    'bg-severity-critical text-white',
    'hover:bg-severity-critical/90',
    'shadow-button hover:shadow-[0_4px_12px_-2px_rgba(220,38,38,0.3)]',
    'border border-severity-critical/20'
  ),
  cyber: cn(
    'bg-primary/10 text-primary',
    'border border-primary/40',
    'hover:bg-primary/20 hover:border-primary/60',
    'shadow-[0_0_10px_rgba(0,212,255,0.1)]',
    'hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]'
  ),
};

/**
 * Size styles mapping
 * @description CSS classes for each button size
 */
const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm sm:text-base rounded-xl gap-2',
  lg: 'px-6 py-3 text-base sm:text-lg rounded-xl gap-2.5',
};

/**
 * Enhanced Button Component
 * @description A versatile button component with multiple variants and sizes
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Base button classes
  const baseClasses = cn(
    // Layout
    'inline-flex items-center justify-center',
    // Typography
    'font-medium whitespace-nowrap',
    // Transitions
    'transition-all duration-200',
    // Focus states
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // Disabled states
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    // Size-specific styles
    sizeStyles[size],
    // Variant-specific styles
    variantStyles[variant]
  );

  // Button content
  const buttonContent = (
    <>
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  // Handle anchor element
  if ('href' in rest && rest.href) {
    if (prefersReducedMotion) {
      return (
        <a {...rest} className={cn(baseClasses, className)}>
          {buttonContent}
        </a>
      );
    }

    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <motion.a
        href={href}
        {...(anchorProps as any)}
        className={cn(baseClasses, className)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={{
          duration: 0.15,
          ease: easings.easeOutCubic,
        }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  // Handle button element
  const { type = 'button', ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  if (prefersReducedMotion) {
    return (
      <button type={type} {...buttonProps} className={cn(baseClasses, className)}>
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      {...(buttonProps as any)}
      className={cn(baseClasses, className)}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.15,
        ease: easings.easeOutCubic,
      }}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;

'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buttonVariants, transitions } from '@/utils/animations';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

type CommonProps = {
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
};

type ButtonProps =
  | (CommonProps &
      ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
      })
  | (CommonProps &
      AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg',
  secondary:
    'bg-accent text-white hover:bg-accent-hover shadow-md hover:shadow-lg',
  outline:
    'border-2 border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20',
  ghost:
    'text-text-primary hover:bg-background-elevated hover:text-text-primary',
  danger:
    'bg-severity-critical text-white hover:bg-severity-critical/90 shadow-md hover:shadow-lg',
};

export const Button = ({ variant = 'primary', icon, className, children, ...rest }: ButtonProps) => {
  const prefersReducedMotion = useReducedMotion();
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const buttonContent = (
    <>
      {children}
      {icon}
    </>
  );

  if ('href' in rest && rest.href) {
    if (prefersReducedMotion) {
      return (
        <a
          {...rest}
          className={cn(baseClasses, variantStyles[variant], className)}
        >
          {buttonContent}
        </a>
      );
    }

    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <motion.a
        href={href}
        {...(anchorProps as any)}
        className={cn(baseClasses, variantStyles[variant], className)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={transitions.fast}
      >
        {buttonContent}
      </motion.a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  if (prefersReducedMotion) {
    return (
      <button
        type={type}
        {...buttonProps}
        className={cn(baseClasses, variantStyles[variant], className)}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      {...(buttonProps as any)}
      className={cn(baseClasses, variantStyles[variant], className)}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={transitions.fast}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;

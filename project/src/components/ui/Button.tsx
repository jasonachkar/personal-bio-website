import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

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
    'bg-primary text-background hover:bg-primary/90 shadow-glow',
  secondary:
    'bg-primary-purple text-white hover:bg-primary-purple/90 shadow-glow-purple',
  outline:
    'border-2 border-primary text-primary hover:bg-primary/10',
  ghost:
    'text-text-primary hover:bg-background-elevated',
  danger:
    'bg-severity-critical text-white hover:bg-severity-critical/90',
};

export const Button = ({ variant = 'primary', icon, className, children, ...rest }: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed';

  if ('href' in rest && rest.href) {
    return (
      <a
        {...rest}
        className={cn(baseClasses, variantStyles[variant], className)}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...rest}
      className={cn(baseClasses, variantStyles[variant], className)}
    >
      {children}
      {icon}
    </button>
  );
};

export default Button;

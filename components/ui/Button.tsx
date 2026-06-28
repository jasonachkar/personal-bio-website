import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'quiet';

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-text-inverse hover:bg-accent-strong hover:border-accent-strong',
  secondary:
    'border-border bg-surface text-text-primary hover:border-accent hover:text-accent-strong',
  quiet:
    'border-transparent bg-transparent text-accent hover:bg-elevated hover:text-accent-strong',
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
};

export function ButtonLink({ className, children, variant = 'secondary', href, ...props }: ButtonLinkProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors',
    variants[variant],
    className,
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}

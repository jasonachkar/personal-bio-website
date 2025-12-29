import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

const Card = ({ children, className, glow = false }: CardProps) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-2xl border border-border bg-background-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-border-accent/50',
      glow && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-accent/10 before:to-transparent before:opacity-60 before:blur-3xl',
      className,
    )}
  >
    <div className="relative z-10">{children}</div>
  </div>
);

export default Card;

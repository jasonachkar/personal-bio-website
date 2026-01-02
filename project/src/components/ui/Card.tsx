'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cardHoverVariants, transitions } from '@/utils/animations';

type CardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

const Card = ({ children, className, glow = false }: CardProps) => {
  const prefersReducedMotion = useReducedMotion();

  const cardClasses = cn(
    'relative overflow-hidden rounded-2xl border border-border bg-background-card p-6 shadow-card',
    glow && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-accent/10 before:to-transparent before:opacity-60 before:blur-3xl',
    className,
  );

  // If reduced motion, use simple CSS transitions
  if (prefersReducedMotion) {
    return (
      <div className={cn(cardClasses, 'transition-all duration-200 hover:shadow-card-hover hover:border-border-accent/50')}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      transition={transitions.fast}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;

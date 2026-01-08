'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants, transitions, viewportSettings } from '@/utils/animations';
import type { Variants } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof scrollVariants;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'fadeUp',
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationVariants = scrollVariants[variant] as Variants;

  // If reduced motion is preferred, use instant transitions
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={animationVariants}
      transition={{ ...transitions.smooth, delay }}
      className={className}
      style={{
        contain: 'layout style paint',
      }}
    >
      {children}
    </motion.div>
  );
}

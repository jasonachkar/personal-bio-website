'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { scrollVariants, transitions, getViewportSettings } from '@/utils/animations';
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
  const isMobile = useIsMobile();
  const animationVariants = scrollVariants[variant] as Variants;

  // If reduced motion is preferred, render content immediately (progressive enhancement)
  if (prefersReducedMotion) {
    return <div className={className} style={{ opacity: 1 }}>{children}</div>;
  }

  // Use mobile-aware viewport settings
  const viewport = getViewportSettings(isMobile);

  return (
    <motion.div
      initial="hidden" // Start from hidden state
      whileInView="visible" // Trigger animation when element enters viewport
      viewport={viewport}
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

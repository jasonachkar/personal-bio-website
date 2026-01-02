'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { badgeVariants, transitions } from '@/utils/animations';

type BadgeProps = {
  label: string;
  className?: string;
};

const Badge = ({ label, className }: BadgeProps) => {
  const prefersReducedMotion = useReducedMotion();

  const badgeClasses = cn(
    'inline-flex items-center rounded-full border border-border bg-background-elevated px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary',
    className,
  );

  if (prefersReducedMotion) {
    return <span className={badgeClasses}>{label}</span>;
  }

  return (
    <motion.span
      className={badgeClasses}
      variants={badgeVariants}
      initial="rest"
      whileHover="hover"
      transition={transitions.fast}
    >
      {label}
    </motion.span>
  );
};

export default Badge;

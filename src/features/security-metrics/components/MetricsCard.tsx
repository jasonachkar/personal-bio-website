'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { MetricsCardProps } from '../types';
import { fadeScaleVariants } from '@/utils/microInteractions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function MetricsCard({ label, value, trend, trendValue, icon, description }: MetricsCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = useMemo(() => prefersReducedMotion ? {} : fadeScaleVariants, [prefersReducedMotion]);

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColors = {
    up: 'text-severity-low',
    down: 'text-severity-high',
    neutral: 'text-text-secondary',
  };

  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-background-card p-6',
        'transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <span className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {label}
            </span>
          </div>
          {trend && TrendIcon && (
            <div className={cn('flex items-center gap-1', trendColors[trend])}>
              <TrendIcon className="h-4 w-4" />
              {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="text-3xl font-bold text-text-primary">{value}</div>
          {description && (
            <p className="mt-1 text-xs text-text-secondary">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}


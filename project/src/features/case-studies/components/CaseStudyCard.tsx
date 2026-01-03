'use client';

import { motion } from 'framer-motion';
import { Shield, Cloud, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CaseStudy } from '../types';
import { fadeScaleVariants } from '@/utils/microInteractions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMemo } from 'react';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: () => void;
  index: number;
}

const categoryIcons = {
  security: Shield,
  cloud: Cloud,
  compliance: CheckCircle2,
  detection: Search,
};

const categoryColors = {
  security: 'from-primary to-secondary',
  cloud: 'from-secondary to-accent',
  compliance: 'from-severity-low to-severity-medium',
  detection: 'from-accent to-primary',
};

export function CaseStudyCard({ caseStudy, onClick, index }: CaseStudyCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = useMemo(() => prefersReducedMotion ? {} : fadeScaleVariants, [prefersReducedMotion]);
  const Icon = categoryIcons[caseStudy.category];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        onClick={onClick}
        className={cn(
          'group relative w-full text-left rounded-xl border border-border bg-background-card p-6',
          'transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        )}
        whileHover={prefersReducedMotion ? {} : { y: -4 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      >
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10',
          categoryColors[caseStudy.category]
        )} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'rounded-lg bg-gradient-to-br p-3 text-white',
              categoryColors[caseStudy.category]
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase',
              caseStudy.status === 'completed'
                ? 'bg-severity-low/20 text-severity-low border border-severity-low/30'
                : 'bg-primary/20 text-primary border border-primary/30'
            )}>
              {caseStudy.status === 'completed' ? 'Completed' : 'In Progress'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
            {caseStudy.title}
          </h3>

          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {caseStudy.problem}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {caseStudy.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-background-elevated text-text-secondary border border-border"
                >
                  {tech}
                </span>
              ))}
              {caseStudy.technologies.length > 3 && (
                <span className="text-xs text-text-muted">
                  +{caseStudy.technologies.length - 3} more
                </span>
              )}
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}


'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  Boxes,
  GitBranch,
  Bug,
  Code2,
  Layers,
  ShieldCheck,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Skills as SkillsContent } from '@/lib/schemas';
import {
  scrollVariants,
  staggerContainer,
  getViewportSettings,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

// ============================================
// Skills Section Component
// ============================================

interface SkillsProps {
  content: SkillsContent;
}

const groupIconMap: Record<string, LucideIcon> = {
  Cloud,
  Boxes,
  GitBranch,
  Bug,
  Code2,
  Layers,
};

const Skills = ({ content }: SkillsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );
  const cardVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.cardReveal),
    [prefersReducedMotion]
  );

  return (
    <section id="skills" className="section-container relative">
      <div className="absolute inset-0 bg-radial-accent opacity-30 pointer-events-none" />

      <div className="content-container relative">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Cpu className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Technical Arsenal
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">Skills &amp; Capabilities</h2>
          <p className="mx-auto mt-4 max-w-3xl text-body-lg text-text-secondary">
            {content.intro}
          </p>
        </motion.div>

        {/* Skill groups */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.groups.map((group) => {
            const Icon = groupIconMap[group.icon] ?? ShieldCheck;
            return (
              <motion.div key={group.title} variants={cardVariants} className="h-full">
                <Card variant="default" hoverEffect="lift" padding="lg" className="group h-full">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      className={cn(
                        'inline-flex rounded-lg p-2',
                        'bg-primary/10 text-primary',
                        'transition-all duration-300 group-hover:bg-primary/20'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-text-primary sm:text-base">
                      {group.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Badge key={item} label={item} variant="outline" size="xs" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Principles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5"
        >
          {content.principles.map((principle) => (
            <motion.div key={principle.title} variants={cardVariants}>
              <Card
                variant="cyber"
                hoverEffect="lift"
                padding="md"
                className="group h-full text-center sm:text-left"
              >
                <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-primary">{principle.title}</h4>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {principle.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Skills);

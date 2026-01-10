'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Shield, Code, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import type { Experience } from '@/lib/schemas';
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
// Experience Section Component
// ============================================

/**
 * Experience section props interface
 * @interface ExperienceProps
 * @description Props for the Experience section component
 */
interface ExperienceProps {
  /** Array of experience data to display */
  experience: Experience[];
}

/**
 * Experience Section Component
 * @description Displays professional experience in a timeline format
 */
const Experience = ({ experience }: ExperienceProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  // Memoized variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );
  const itemVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.slideLeft),
    [prefersReducedMotion]
  );

  return (
    <section id="experience" className="section-container relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12 md:mb-14"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Briefcase className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Career Journey
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">
            Professional Experience
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Secure software development with a focus on building resilient systems
            and integrating security throughout the SDLC
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Desktop Only */}
          <div className={cn(
            'absolute left-8 top-0 hidden h-full w-0.5 md:block',
            'bg-gradient-to-b from-primary via-secondary to-accent opacity-30'
          )} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-8 sm:space-y-10 md:space-y-12"
          >
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative"
              >
                {/* Timeline Dot - Desktop Only */}
                <div className={cn(
                  'absolute left-6 top-6 hidden md:block',
                  'h-5 w-5 rounded-full',
                  'border-4 border-primary bg-background',
                  'shadow-lg shadow-primary/50',
                  'z-10'
                )} />

                {/* Experience Card */}
                <div className="md:ml-20">
                  <motion.div
                    className={cn(
                      'group rounded-2xl border border-border bg-background-card',
                      'p-5 sm:p-6 md:p-8',
                      'transition-all duration-300',
                      'hover:border-primary/40 hover:shadow-card-hover'
                    )}
                    whileHover={prefersReducedMotion ? {} : { y: -4 }}
                    transition={{ duration: 0.3, ease: easings.easeOutCubic }}
                  >
                    {/* Header */}
                    <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="mb-2 text-xl font-semibold text-text-primary sm:text-2xl">
                          {exp.role}
                        </h3>
                        <p className="mb-2 text-base font-medium text-primary sm:text-lg">
                          {exp.company}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-text-muted sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {exp.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {exp.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-5 sm:mb-6 space-y-4 sm:space-y-5">
                      {/* Key Achievements */}
                      <div>
                        <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4 text-secondary sm:h-5 sm:w-5" />
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted sm:text-sm">
                            Key Achievements
                          </h4>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 sm:gap-3 text-sm text-text-secondary"
                            >
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Security Highlights */}
                      <div className={cn(
                        'rounded-xl border border-primary/20 bg-primary/5',
                        'p-3.5 sm:p-4'
                      )}>
                        <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                            Security Highlights
                          </h4>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {exp.securityHighlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 sm:gap-3 text-xs text-text-secondary sm:text-sm"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <p className="mb-2.5 sm:mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} label={tech} size="xs" variant="default" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Experience);

'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Sparkles, Zap } from 'lucide-react';
import Card from '../ui/Card';
import SecurityRadar from '../SecurityRadar';
import type { About } from '@/lib/schemas';
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
// About Section Component
// ============================================

/**
 * About section props interface
 * @interface AboutProps
 * @description Props for the About section component
 */
interface AboutProps {
  /** About content data */
  content: About;
}

/**
 * About Section Component
 * @description Displays personal introduction and core strengths
 */
const About = ({ content }: AboutProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  // Memoized variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const paragraphVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );

  return (
    <section id="about" className="section-container relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-radial-accent opacity-30 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              About Me
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">
            About Me
          </h2>
          
          <p className="mx-auto mt-4 max-w-3xl text-subtitle text-text-secondary">
            {content.title}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Main Content - Paragraphs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-5 sm:space-y-6 lg:col-span-3"
          >
            {content.paragraphs.map((paragraph, index) => (
              <motion.div key={index} variants={paragraphVariants} custom={index}>
                <p className="text-body-lg text-text-secondary">{paragraph}</p>
              </motion.div>
            ))}

            {/* Focus Areas */}
            <motion.div
              variants={paragraphVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-6 sm:mt-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">Focus Areas</h3>
              </div>
              
              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {content.focusAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-2.5"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: easings.easeOutQuint,
                    }}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
                    <span className="text-sm text-text-secondary sm:text-base">{area}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Core Strengths + Security Domain Radar */}
        <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          {/* Left - Core Strengths */}
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-text-primary">Core Strengths</h3>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            >
              {content.coreStrengths.map((strength, index) => (
                <motion.div
                  key={index}
                  variants={prefersReducedMotion ? {} : scrollVariants.scaleFade}
                >
                  <Card
                    variant="default"
                    hoverEffect="lift"
                    padding="sm"
                    className={cn(
                      'h-full border border-border',
                      'hover:border-primary/30'
                    )}
                  >
                    <h4 className="mb-1.5 font-semibold text-primary">
                      {strength.title}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {strength.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Radar Chart */}
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.scaleFade}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <SecurityRadar className="h-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(About);

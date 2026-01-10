'use client';

import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { SectionId } from '../../data/types';
import type { Hero as HeroContent } from '@/lib/schemas';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Shield, Cloud, Lock, TrendingUp, Zap } from 'lucide-react';
import {
  scrollVariants,
  transitions,
  getViewportSettings,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { downloadResume } from '@/lib/resume';
import { fadeScaleVariants } from '@/utils/microInteractions';
import { cn } from '@/lib/cn';

// ============================================
// Hero Section Component
// ============================================

/**
 * Hero section props interface
 * @interface HeroProps
 * @description Props for the Hero section component
 */
interface HeroProps {
  /** Navigation callback function */
  onNavigate: (id: SectionId) => void;
  /** Hero content data */
  content: HeroContent;
}

/**
 * Hero Section Component
 * @description Main hero section with animated content and profile card
 */
const Hero = ({ onNavigate, content }: HeroProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms (disabled on mobile for performance)
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? [0, 0] : [0, -50]
  );
  
  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.6],
    prefersReducedMotion || isMobile ? [1, 1] : [1, 0]
  );

  // CTA handler
  const handleCta = async (href: string, label: string) => {
    if (href.startsWith('#')) {
      onNavigate(href.replace('#', '') as SectionId);
      return;
    }
    if (href === '/resume.pdf' && label.toLowerCase().includes('resume')) {
      await downloadResume();
      return;
    }
    if (href.startsWith('/')) {
      window.open(href, '_blank');
      return;
    }
    window.open(href, '_blank', 'noreferrer');
  };

  // Memoized variants
  const leftVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeIn),
    [prefersReducedMotion]
  );
  
  const rightVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.scaleFade),
    [prefersReducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div
        style={{
          y: yTransform,
          opacity: opacityTransform,
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
        }}
        className="absolute inset-0 bg-cyber-grid opacity-[0.03] dark:opacity-[0.06]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 dark:opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 bg-radial-fade" aria-hidden="true" />

      {/* Content Container */}
      <div className={cn(
        'relative mx-auto max-w-6xl',
        'px-5 sm:px-6 md:px-8 lg:px-10',
        'pt-28 pb-16',
        'sm:pt-32 sm:pb-20',
        'md:pt-36 md:pb-24',
        'lg:pt-40 lg:pb-28'
      )}>
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          
          {/* Left Column - Text Content */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate="visible"
            transition={transitions.smooth}
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easings.easeOutQuint }}
              className={cn(
                'inline-flex w-fit items-center gap-2',
                'rounded-full border border-primary/40 bg-primary/10',
                'px-3.5 py-1.5 sm:px-4 sm:py-2',
                'font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-primary'
              )}
            >
              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {content.title}
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                className={cn(
                  'text-text-primary',
                  'text-3xl font-bold leading-tight',
                  'sm:text-4xl',
                  'md:text-5xl',
                  'lg:text-6xl'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: easings.easeOutQuint }}
              >
                {content.name}
              </motion.h1>
              
              <motion.p
                className={cn(
                  'text-gradient',
                  'text-xl font-semibold',
                  'sm:text-2xl',
                  'md:text-3xl'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: easings.easeOutQuint }}
              >
                {content.tagline}
              </motion.p>
              
              <motion.p
                className="max-w-2xl text-base text-text-secondary sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: easings.easeOutQuint }}
              >
                {content.blurb}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-2.5 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easings.easeOutQuint }}
            >
              {content.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.kind === 'primary' ? 'primary' : 'ghost'}
                  onClick={() => handleCta(cta.href, cta.label)}
                >
                  {cta.label}
                </Button>
              ))}
              <Button variant="secondary" onClick={() => onNavigate('contact')}>
                Contact Me
              </Button>
            </motion.div>

            {/* Current Focus */}
            <motion.div
              className="space-y-2.5 sm:space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: easings.easeOutQuint }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted sm:text-sm">
                Current Focus
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                {content.currentFocus.map((focus, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="line-clamp-1">{focus}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Card */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.smooth, delay: 0.2 }}
            className="lg:pl-4"
          >
            <Card
              variant="cyber"
              hoverEffect="glow"
              padding="lg"
              className={cn(
                'glass-panel relative overflow-hidden',
                'rounded-2xl sm:rounded-3xl'
              )}
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />

              <div className="relative z-10 space-y-5 sm:space-y-6">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    <span className="font-mono text-xs text-text-secondary sm:text-sm">
                      security.profile
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-xs text-primary sm:text-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Active
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {content.stats.map((stat, idx) => (
                    <AnimatedStatCard
                      key={stat.label}
                      stat={stat}
                      delay={idx * 0.1}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>

                {/* Security Toolkit */}
                <div className={cn(
                  'space-y-2.5 sm:space-y-3',
                  'rounded-xl border border-border bg-background-elevated/50',
                  'p-3 sm:p-4'
                )}>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-semibold text-text-primary sm:text-sm">
                      Security Toolkit
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['Azure', 'Sentinel', 'Entra ID', 'Defender', 'OWASP', 'KQL', 'Terraform', 'GitHub'].map((tool) => (
                      <Badge key={tool} label={tool} size="xs" variant="default" />
                    ))}
                  </div>
                </div>

                {/* Opportunity Banner */}
                <div className={cn(
                  'flex items-start gap-2.5 sm:gap-3',
                  'rounded-xl border border-primary/30 bg-primary/5',
                  'p-3 sm:p-4'
                )}>
                  <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary sm:h-5 sm:w-5" />
                  <div className="text-[11px] text-text-secondary sm:text-xs">
                    <span className="font-semibold text-primary">Open to opportunities:</span>{' '}
                    Cloud Security Engineer, Security Consultant, DevSecOps roles in Canada or remote
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Animated Stat Card Sub-component
// ============================================

/**
 * Animated stat card with counter effect
 * @description Displays a stat with animated number counting
 */
function AnimatedStatCard({
  stat,
  delay,
  prefersReducedMotion,
}: {
  stat: { label: string; value: string; detail: string };
  delay: number;
  prefersReducedMotion: boolean;
}) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
  const hasNumber = numericValue > 0;

  useEffect(() => {
    if (isVisible && hasNumber && !prefersReducedMotion) {
      let current = 0;
      const increment = numericValue / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(numericValue.toString());
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current).toString());
        }
      }, 20);
      return () => clearInterval(timer);
    } else if (isVisible) {
      setDisplayValue(stat.value);
    }
  }, [isVisible, numericValue, hasNumber, prefersReducedMotion, stat.value]);

  return (
    <motion.div
      variants={fadeScaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={getViewportSettings(isMobile)}
      transition={{ delay }}
      onViewportEnter={() => setIsVisible(true)}
      className={cn(
        'rounded-lg sm:rounded-xl',
        'border border-border bg-background-elevated/50',
        'p-2.5 sm:p-4',
        'transition-all duration-300',
        'hover:border-primary/40 hover:bg-background-card'
      )}
    >
      {hasNumber ? (
        <div className="text-xl font-bold text-primary sm:text-2xl">
          {displayValue}
          {stat.value.includes('+') && '+'}
          {stat.value.includes('yrs') && ' yrs'}
        </div>
      ) : (
        <div className="text-xl font-bold text-primary sm:text-2xl">{stat.value}</div>
      )}
      <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted sm:text-xs">
        {stat.label}
      </div>
      <p className="mt-0.5 text-[10px] text-text-secondary sm:mt-1 sm:text-[11px]">
        {stat.detail}
      </p>
    </motion.div>
  );
}

export default memo(Hero);

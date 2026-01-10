'use client';

import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { SectionId } from '../../data/types';
import type { Hero as HeroContent } from '@/lib/schemas';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Shield, Cloud, Lock, TrendingUp, Zap, CheckCircle2, Award, Terminal } from 'lucide-react';
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
            <SecurityProfileCard 
              stats={content.stats}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Security Profile Card Component
// ============================================

/**
 * Security Profile Card - Premium styled profile card
 */
function SecurityProfileCard({
  stats,
  prefersReducedMotion,
}: {
  stats: Array<{ label: string; value: string; detail: string }>;
  prefersReducedMotion: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="relative group">
      {/* Outer Glow Effect */}
      <div className={cn(
        'absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500',
        'bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30',
        'group-hover:opacity-100'
      )} />
      
      {/* Main Card */}
      <div className={cn(
        'relative overflow-hidden',
        'rounded-2xl sm:rounded-3xl',
        'border border-primary/20',
        'bg-gradient-to-br from-background-card via-background-card to-background-elevated',
        'shadow-2xl shadow-primary/5'
      )}>
        {/* Animated Border Gradient */}
        <div className={cn(
          'absolute inset-0 rounded-2xl sm:rounded-3xl',
          'bg-gradient-to-br from-primary/30 via-transparent to-accent/30',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'pointer-events-none'
        )} style={{ padding: '1px' }}>
          <div className="h-full w-full rounded-2xl sm:rounded-3xl bg-background-card" />
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute inset-0 hex-pattern opacity-10 pointer-events-none" />
        
        {/* Scan Line Effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
            initial={{ top: 0, opacity: 0 }}
            animate={{ 
              top: ['0%', '100%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'linear',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className={cn(
              'flex items-center gap-2.5',
              'px-3 py-1.5 rounded-lg',
              'bg-background-elevated/80 border border-border/50'
            )}>
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs sm:text-sm text-text-secondary">
                security<span className="text-primary">.</span>profile
              </span>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              'bg-severity-low/10 border border-severity-low/30'
            )}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-low" />
              </span>
              <span className="text-xs font-semibold text-severity-low uppercase tracking-wide">
                Active
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {stats.map((stat, idx) => (
              <AnimatedStatCard
                key={stat.label}
                stat={stat}
                delay={idx * 0.1}
                prefersReducedMotion={prefersReducedMotion}
                index={idx}
              />
            ))}
          </div>

          {/* Security Toolkit */}
          <div className={cn(
            'rounded-xl overflow-hidden',
            'border border-border/50',
            'bg-gradient-to-br from-background-elevated/80 to-background-card/50'
          )}>
            <div className={cn(
              'flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3',
              'border-b border-border/50',
              'bg-background-elevated/50'
            )}>
              <Cloud className="h-4 w-4 text-secondary" />
              <span className="text-xs font-semibold text-text-primary sm:text-sm">
                Security Toolkit
              </span>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { name: 'Azure', icon: '☁️' },
                  { name: 'Sentinel', icon: '🛡️' },
                  { name: 'Entra ID', icon: '🔐' },
                  { name: 'Defender', icon: '🔒' },
                  { name: 'OWASP', icon: '🌐' },
                  { name: 'KQL', icon: '📊' },
                  { name: 'Terraform', icon: '🏗️' },
                  { name: 'GitHub', icon: '💻' },
                ].map((tool, idx) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
                  >
                    <Badge
                      label={tool.name}
                      size="sm"
                      variant="outline"
                      className="hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Opportunity Banner */}
          <motion.div
            className={cn(
              'relative overflow-hidden',
              'flex items-start gap-3',
              'rounded-xl',
              'border border-primary/30',
              'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent',
              'p-3 sm:p-4'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* Animated Corner Accent */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full pointer-events-none" />
            
            <div className={cn(
              'relative z-10 flex-shrink-0',
              'p-2 rounded-lg',
              'bg-primary/20 border border-primary/30'
            )}>
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-xs font-bold text-primary mb-1">
                Open to Opportunities
              </p>
              <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
                Cloud Security Engineer, Security Consultant, DevSecOps roles in Canada or remote
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Animated Stat Card Sub-component
// ============================================

/**
 * Animated stat card with counter effect and improved styling
 */
function AnimatedStatCard({
  stat,
  delay,
  prefersReducedMotion,
  index,
}: {
  stat: { label: string; value: string; detail: string };
  delay: number;
  prefersReducedMotion: boolean;
  index: number;
}) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
  const hasNumber = numericValue > 0;

  // Color variants for visual variety
  const colors = [
    { text: 'text-primary', bg: 'from-primary/10 to-primary/5', border: 'border-primary/20' },
    { text: 'text-secondary', bg: 'from-secondary/10 to-secondary/5', border: 'border-secondary/20' },
    { text: 'text-accent', bg: 'from-accent/10 to-accent/5', border: 'border-accent/20' },
  ];
  const color = colors[index % colors.length];

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
        'relative overflow-hidden',
        'rounded-xl',
        'border',
        color.border,
        `bg-gradient-to-br ${color.bg}`,
        'p-3 sm:p-4',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg'
      )}
    >
      {/* Decorative Corner */}
      <div className={cn(
        'absolute -top-6 -right-6 w-12 h-12',
        'rounded-full opacity-20',
        color.text.replace('text-', 'bg-')
      )} />
      
      <div className="relative z-10">
        {hasNumber ? (
          <div className={cn('text-2xl sm:text-3xl font-bold', color.text)}>
            {displayValue}
            {stat.value.includes('+') && <span className="text-lg">+</span>}
            {stat.value.includes('yrs') && <span className="text-base sm:text-lg font-medium ml-0.5">yrs</span>}
          </div>
        ) : (
          <div className={cn('text-2xl sm:text-3xl font-bold', color.text)}>{stat.value}</div>
        )}
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted sm:text-xs mt-1">
          {stat.label}
        </div>
        <p className="mt-1 text-[10px] text-text-secondary sm:text-[11px] line-clamp-2 leading-relaxed">
          {stat.detail}
        </p>
      </div>
    </motion.div>
  );
}

export default memo(Hero);

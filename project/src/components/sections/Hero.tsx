'use client';

import { memo, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import type { SectionId } from '../../data/types';
import type { Hero as HeroContent } from '@/lib/schemas';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Download,
  GitBranch,
  Layers3,
  Lock,
  Mail,
  Rocket,
  Shield,
  Target,
  Terminal,
  Wifi,
} from 'lucide-react';
import {
  scrollVariants,
  transitions,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { downloadResume } from '@/lib/resume';
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

  // Parallax transforms
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

  const getCtaIcon = (label: string) =>
    label.toLowerCase().includes('resume') ? (
      <Download className="h-4 w-4" />
    ) : (
      <ArrowRight className="h-4 w-4" />
    );

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
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          
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
                'liquid-glass-pill rounded-full border border-primary/40 bg-primary/10',
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
                  'text-display'
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

            {/* Recruiter Snapshot */}
            {content.quickSignals && content.quickSignals.length > 0 && (
              <motion.div
                className="grid gap-2.5 sm:grid-cols-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: easings.easeOutQuint }}
              >
                {content.quickSignals.map((signal, index) => {
                  const SignalIcon = [Building2, Target, Rocket][index % 3];

                  return (
                    <motion.div
                      key={signal.label}
                      className={cn(
                        'group rounded-xl border border-border bg-background-card',
                        'px-3.5 py-3 sm:px-4',
                        'shadow-card transition-colors duration-200 hover:border-primary/35 hover:bg-background-elevated/70'
                      )}
                      whileHover={prefersReducedMotion ? {} : { y: -3 }}
                      transition={{ duration: 0.25, ease: easings.easeOutCubic }}
                    >
                      <div className="mb-2 flex items-center gap-2 text-primary">
                        <SignalIcon className="h-4 w-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                          {signal.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-snug text-text-primary">
                        {signal.value}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-2.5 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.33, ease: easings.easeOutQuint }}
            >
              {content.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.kind === 'primary' ? 'primary' : 'ghost'}
                  onClick={() => handleCta(cta.href, cta.label)}
                  icon={getCtaIcon(cta.label)}
                >
                  {cta.label}
                </Button>
              ))}
              <Button
                variant="secondary"
                onClick={() => onNavigate('contact')}
                icon={<Mail className="h-4 w-4" />}
              >
                Contact Me
              </Button>
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

function SecurityProfileCard({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);

  const profileCards = [
    {
      label: 'Current',
      value: 'Platform Engineer',
      detail: 'SCM, CI/CD, governance tooling at Genetec',
      icon: Building2,
    },
    {
      label: 'Flagship',
      value: '7-Scanner Platform',
      detail: 'SARIF, build gates, IaC attack paths',
      icon: Shield,
    },
    {
      label: 'Delivery',
      value: 'Policy Gates',
      detail: 'Branch rules, build controls, release promotion',
      icon: GitBranch,
    },
    {
      label: 'Architecture',
      value: 'Tenant Isolation',
      detail: 'App-layer auth plus PostgreSQL FORCE RLS',
      icon: Database,
    },
  ];

  const stackGroups = [
    {
      label: 'Platform',
      icon: Layers3,
      tools: ['Azure', 'Entra ID', 'Key Vault', 'PostgreSQL'],
    },
    {
      label: 'Delivery',
      icon: GitBranch,
      tools: ['Azure DevOps', 'GitHub Apps', 'Terraform', 'SARIF'],
    },
    {
      label: 'Scanners',
      icon: Code2,
      tools: ['Semgrep', 'Gitleaks', 'Trivy', 'Checkov'],
    },
  ];
  
  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isMobile) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: prefersReducedMotion || isMobile ? 0 : rotateX,
          rotateY: prefersReducedMotion || isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative group"
      >
        {/* Animated Gradient Border */}
        <div className={cn(
          'absolute -inset-[1px] rounded-2xl sm:rounded-3xl',
          'bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30',
          'opacity-20 group-hover:opacity-40',
          'blur-[2px] group-hover:blur-sm',
          'transition-all duration-500',
          'animate-gradient-shift bg-[length:200%_200%]'
        )} />
        
        {/* Main Card - Theme Aware */}
        <div className={cn(
          'relative overflow-hidden',
          'rounded-2xl sm:rounded-3xl',
          'border border-border bg-background-card',
          'shadow-card-hover dark:shadow-2xl'
        )}>
          {/* Subtle Grid Pattern */}
          <div className={cn(
            'absolute inset-0 opacity-15 dark:opacity-25',
            'bg-[radial-gradient(circle_at_1px_1px,var(--border-default)_1px,transparent_0)]',
            'bg-[size:24px_24px]'
          )} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 space-y-4 p-4 sm:space-y-5 sm:p-6">
            
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <motion.div
                className={cn(
                  'flex items-center gap-2',
                  'px-3 py-2 rounded-xl',
                  'bg-primary/10 dark:bg-primary/15',
                  'border border-primary/20'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Terminal className="h-4 w-4 text-primary" />
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 bg-primary/50 rounded-full blur-md"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className="font-mono text-xs sm:text-sm">
                  <span className="text-text-muted">security</span>
                  <span className="text-primary">.</span>
                  <span className="text-text-primary">profile</span>
                </span>
              </motion.div>
              
              <motion.div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl',
                  'bg-severity-low/10 dark:bg-severity-low/15',
                  'border border-severity-low/30'
                )}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-low" />
                </span>
                <span className="text-xs font-bold text-severity-low uppercase tracking-wider">
                  Active
                </span>
              </motion.div>
            </div>

            <div className="rounded-xl border border-border bg-background-elevated/45 p-4">
              <p className="text-sm font-semibold leading-relaxed text-text-primary">
                I turn delivery workflows into controlled, observable systems:
                source control, build gates, tenant boundaries, and scanner automation.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {profileCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    className={cn(
                      'rounded-xl border border-border bg-background-elevated/35 p-3.5',
                      'transition-colors duration-200 hover:border-primary/35 hover:bg-background-elevated/70'
                    )}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug text-text-primary">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {item.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Security Stack */}
            <motion.div
              className={cn(
                'rounded-xl overflow-hidden',
                'border border-border',
                'bg-background-elevated/50'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={cn(
                'flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3',
                'border-b border-border',
                'bg-background-elevated'
              )}>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold text-text-primary sm:text-sm uppercase tracking-wide">
                    Working Stack
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-3 sm:p-4">
                {stackGroups.map((group, index) => {
                  const Icon = group.icon;

                  return (
                    <motion.div
                      key={group.label}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {group.label}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Opportunity Banner */}
            <motion.div
              className={cn(
                'relative overflow-hidden',
                'rounded-xl',
                'border border-primary/30',
                'bg-primary/5 dark:bg-primary/10'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative z-10 flex items-start gap-3 p-3.5 sm:p-4">
                <div className={cn(
                  'flex-shrink-0 p-2.5 rounded-xl',
                  'bg-primary/10 dark:bg-primary/20',
                  'border border-primary/30'
                )}>
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                    Open to Opportunities
                    <Wifi className="h-3.5 w-3.5 animate-pulse" />
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Platform Engineering', 'DevSecOps', 'Developer Tooling'].map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 rounded-full bg-background-elevated px-2.5 py-1 text-xs font-medium text-text-secondary"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(Hero);

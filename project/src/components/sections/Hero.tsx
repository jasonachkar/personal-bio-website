'use client';

import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import type { SectionId } from '../../data/types';
import type { Hero as HeroContent } from '@/lib/schemas';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Shield, Cloud, Lock, Terminal, Cpu, Wifi } from 'lucide-react';
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

function SecurityProfileCard({
  stats,
  prefersReducedMotion,
}: {
  stats: Array<{ label: string; value: string; detail: string }>;
  prefersReducedMotion: boolean;
}) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  
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
          'bg-gradient-to-r from-primary via-secondary to-accent',
          'opacity-30 group-hover:opacity-60',
          'blur-sm group-hover:blur-md',
          'transition-all duration-500',
          'animate-gradient-shift bg-[length:200%_200%]'
        )} />
        
        {/* Main Card - Theme Aware */}
        <div className={cn(
          'relative overflow-hidden',
          'rounded-2xl sm:rounded-3xl',
          'border border-border',
          'bg-background-card',
          'shadow-xl dark:shadow-2xl'
        )}>
          {/* Subtle Grid Pattern */}
          <div className={cn(
            'absolute inset-0 opacity-30 dark:opacity-50',
            'bg-[radial-gradient(circle_at_1px_1px,var(--border-default)_1px,transparent_0)]',
            'bg-[size:24px_24px]'
          )} />
          
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/10 to-transparent rounded-tl-full" />
          
          {/* Floating Particles */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute top-10 right-10 w-1 h-1 bg-primary rounded-full"
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-20 left-8 w-1.5 h-1.5 bg-secondary rounded-full"
                animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute bottom-24 right-16 w-1 h-1 bg-accent rounded-full"
                animate={{ y: [0, -8, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Content */}
          <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-5">
            
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

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((stat, idx) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  index={idx}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Security Toolkit */}
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
                    Security Toolkit
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {!prefersReducedMotion && (
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-3 bg-primary/60 rounded-full"
                          animate={{ scaleY: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { name: 'Azure', color: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400' },
                    { name: 'Terraform', color: 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400' },
                    { name: 'Entra ID', color: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400' },
                    { name: '.NET', color: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' },
                    { name: 'GitHub Actions', color: 'bg-gray-500/10 dark:bg-gray-500/20 border-gray-500/30 text-gray-600 dark:text-gray-300' },
                    { name: 'Semgrep', color: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' },
                    { name: 'Trivy', color: 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' },
                    { name: 'PostgreSQL', color: 'bg-pink-500/10 dark:bg-pink-500/20 border-pink-500/30 text-pink-600 dark:text-pink-400' },
                  ].map((tool, idx) => (
                    <motion.span
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.05, duration: 0.3 }}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-medium',
                        'border',
                        'hover:scale-105 transition-transform cursor-default',
                        tool.color
                      )}
                    >
                      {tool.name}
                    </motion.span>
                  ))}
                </div>
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
              {/* Animated Background Pulse */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
              
              <div className="relative z-10 flex items-start gap-3 p-3 sm:p-4">
                <div className={cn(
                  'flex-shrink-0 p-2.5 rounded-xl',
                  'bg-primary/10 dark:bg-primary/20',
                  'border border-primary/30'
                )}>
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                    DevSecOps / Cloud Security Roles
                    <Wifi className="h-3.5 w-3.5 animate-pulse" />
                  </p>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Canada or remote · platform security, CI/CD security, and Azure
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Stat Card Component
// ============================================

function StatCard({
  stat,
  index,
  prefersReducedMotion,
}: {
  stat: { label: string; value: string; detail: string };
  index: number;
  prefersReducedMotion: boolean;
}) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
  const hasNumber = numericValue > 0;

  // Different styles for each card - theme aware
  const styles = [
    { 
      bg: 'bg-primary/5 dark:bg-primary/10',
      border: 'border-primary/20 dark:border-primary/30',
      text: 'text-primary',
      glow: 'group-hover:shadow-primary/10'
    },
    { 
      bg: 'bg-secondary/5 dark:bg-secondary/10',
      border: 'border-secondary/20 dark:border-secondary/30',
      text: 'text-secondary',
      glow: 'group-hover:shadow-secondary/10'
    },
    { 
      bg: 'bg-accent/5 dark:bg-accent/10',
      border: 'border-accent/20 dark:border-accent/30',
      text: 'text-accent',
      glow: 'group-hover:shadow-accent/10'
    },
  ];
  const style = styles[index % styles.length];

  useEffect(() => {
    if (isVisible && hasNumber && !prefersReducedMotion) {
      let current = 0;
      const increment = numericValue / 25;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(numericValue.toString());
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current).toString());
        }
      }, 25);
      return () => clearInterval(timer);
    } else if (isVisible) {
      setDisplayValue(stat.value);
    }
  }, [isVisible, numericValue, hasNumber, prefersReducedMotion, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      onViewportEnter={() => setIsVisible(true)}
      className={cn(
        'relative overflow-hidden',
        'rounded-xl',
        'border',
        style.border,
        style.bg,
        'p-3 sm:p-4',
        'group',
        'hover:shadow-lg transition-all duration-300',
        style.glow
      )}
    >
      {/* Shine Effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      <div className="relative z-10">
        {hasNumber ? (
          <div className={cn('text-2xl sm:text-3xl font-black', style.text)}>
            {displayValue}
            {stat.value.includes('+') && <span className="text-lg">+</span>}
            {stat.value.includes('yrs') && <span className="text-sm sm:text-base font-semibold ml-1">yrs</span>}
          </div>
        ) : (
          <div className={cn('text-2xl sm:text-3xl font-black', style.text)}>{stat.value}</div>
        )}
        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">
          {stat.label}
        </div>
        <p className="mt-1.5 text-[10px] sm:text-[11px] text-text-secondary leading-relaxed line-clamp-2">
          {stat.detail}
        </p>
      </div>
    </motion.div>
  );
}

export default memo(Hero);

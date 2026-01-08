import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { SectionId } from '../../data/types';
import type { Hero as HeroContent } from '@/lib/schemas';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Shield, Cloud, Lock, TrendingUp } from 'lucide-react';
import { scrollVariants, transitions } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { downloadResume } from '@/lib/resume';
import { fadeScaleVariants } from '@/utils/microInteractions';

type HeroProps = {
  onNavigate: (id: SectionId) => void;
  content: HeroContent;
};

const Hero = ({ onNavigate, content }: HeroProps) => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms (only if motion is not reduced) - optimized for performance
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -30]
  );
  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.5],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );

  const handleCta = async (href: string, label: string) => {
    if (href.startsWith('#')) {
      onNavigate(href.replace('#', '') as SectionId);
      return;
    }
    // Handle resume download
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

  const leftVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeIn, [prefersReducedMotion]);
  const rightVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.scaleFade, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-40"
    >
      <motion.div
        style={{ 
          y: yTransform, 
          opacity: opacityTransform,
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
        }}
        className="absolute inset-0 bg-cyber-grid opacity-[0.03] dark:opacity-[0.08]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-cyber-mesh opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 bg-radial-fade" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate="visible"
            transition={transitions.smooth}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              <Shield className="h-3.5 w-3.5" />
              {content.title}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-text-primary sm:text-5xl md:text-6xl">
                {content.name}
              </h1>
              <p className="text-gradient text-2xl font-semibold sm:text-3xl">
                {content.tagline}
              </p>
              <p className="max-w-2xl text-lg text-text-secondary">{content.blurb}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Current Focus
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {content.currentFocus.map((focus, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {focus}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.smooth, delay: 0.2 }}
          >
            <Card className="glass-panel relative overflow-hidden rounded-3xl border border-border bg-background-card p-6 terminal-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="absolute inset-0 hex-pattern opacity-30 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-mono text-sm text-text-secondary">security.profile</span>
                  </div>
                  <span className="flex items-center gap-2 text-sm text-primary">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {content.stats.map((stat, idx) => (
                    <AnimatedStatCard key={stat.label} stat={stat} delay={idx * 0.1} prefersReducedMotion={prefersReducedMotion} />
                  ))}
                </div>

                <div className="space-y-3 rounded-xl border border-border bg-background-elevated p-4">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold text-text-primary">Security Toolkit</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Azure', 'Sentinel', 'Entra ID', 'Defender', 'OWASP', 'KQL', 'Terraform', 'GitHub'].map((tool) => (
                      <Badge key={tool} label={tool} />
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="text-xs text-text-secondary">
                    <span className="font-semibold text-primary">Open to opportunities:</span> Cloud Security Engineer, Security Consultant, DevSecOps roles in Canada or remote
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

// Animated stat card with counter
function AnimatedStatCard({ 
  stat, 
  delay, 
  prefersReducedMotion 
}: { 
  stat: { label: string; value: string; detail: string }; 
  delay: number; 
  prefersReducedMotion: boolean;
}) {
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
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      onViewportEnter={() => setIsVisible(true)}
      className="rounded-xl border border-border bg-background-elevated p-4 transition-all hover:border-primary/50 hover:bg-background-card"
    >
      {hasNumber ? (
        <div className="text-2xl font-bold text-primary">
          {displayValue}
          {stat.value.includes('+') && '+'}
          {stat.value.includes('yrs') && ' yrs'}
        </div>
      ) : (
        <div className="text-2xl font-bold text-primary">{stat.value}</div>
      )}
      <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {stat.label}
      </div>
      <p className="mt-1 text-[11px] text-text-secondary">{stat.detail}</p>
    </motion.div>
  );
}

export default memo(Hero);

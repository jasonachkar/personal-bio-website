'use client';

import { memo, useMemo } from 'react';
import { Shield, Network, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import Card from '../ui/Card';
import { scrollVariants, staggerContainer, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

// ============================================
// Showcases Section Component
// ============================================

/**
 * Showcase card props interface
 */
interface ShowcaseCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  href: string;
  status: 'live' | 'coming-soon';
  gradient: string;
}

/**
 * Individual showcase card component
 */
function ShowcaseCard({
  icon: Icon,
  title,
  description,
  features,
  href,
  status,
  gradient,
}: ShowcaseCardProps) {
  const isLive = status === 'live';
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const itemVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.cardSlideUp),
    [prefersReducedMotion]
  );

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="group relative h-full"
    >
      <Link
        href={isLive ? href : '#'}
        className={cn(
          'block h-full',
          !isLive && 'cursor-not-allowed'
        )}
        onClick={!isLive ? (e) => e.preventDefault() : undefined}
      >
        <Card
          variant={isLive ? 'cyber' : 'default'}
          hoverEffect={isLive ? 'lift' : 'none'}
          padding="lg"
          interactive={isLive}
          className={cn(
            'h-full relative overflow-hidden',
            !isLive && 'opacity-60'
          )}
        >
          {/* Decorative Pattern */}
          {isLive && (
            <div className="absolute inset-0 hex-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide',
                isLive
                  ? 'bg-severity-low/15 text-severity-low border border-severity-low/30'
                  : 'bg-text-secondary/10 text-text-secondary border border-text-secondary/20'
              )}
            >
              {isLive ? 'Live Demo' : 'Coming Soon'}
            </span>
          </div>

          {/* Icon with Gradient */}
          <div
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 relative z-10',
              'transition-transform duration-300 group-hover:scale-110',
              gradient
            )}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className={cn(
              'text-lg sm:text-xl font-bold text-text-primary mb-2',
              'transition-colors duration-300',
              isLive && 'group-hover:text-primary'
            )}>
              {title}
            </h3>
            
            <p className="text-sm sm:text-base text-text-secondary mb-4 leading-relaxed">
              {description}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-5 sm:mb-6">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary"
                >
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isLive && (
              <div className={cn(
                'inline-flex items-center gap-2 text-sm font-medium text-primary',
                'transition-all duration-300 group-hover:gap-3'
              )}>
                <span>Explore Demo</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

/**
 * Showcases section component
 * @description Displays interactive security showcase demos
 */
function Showcases() {
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
  const footerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fade),
    [prefersReducedMotion]
  );

  const showcases: ShowcaseCardProps[] = [
    {
      icon: Shield,
      title: 'SIEM Detection Console',
      description:
        'Security event monitoring and threat detection powered by a custom query engine, detection rules, and MITRE ATT&CK mapping — built from scratch.',
      features: [
        'Query engine with KQL-like syntax',
        'Time-window threat detection algorithms',
        'MITRE ATT&CK tactics & techniques mapping',
        '30+ realistic security events with detections',
      ],
      href: '/siem',
      status: 'live',
      gradient: 'bg-gradient-to-br from-primary to-secondary',
    },
    {
      icon: Network,
      title: 'Threat Modeling Playground',
      description:
        'Interactive STRIDE-based threat modeling with a DFD editor, risk scoring, and MITRE ATT&CK integration for end-to-end security analysis.',
      features: [
        'Interactive DFD diagram builder',
        'STRIDE threat analysis with risk scoring',
        'MITRE ATT&CK Navigator layer export',
        'Evidence pack generation (PDF/Markdown)',
      ],
      href: '/threat-modeling',
      status: 'live',
      gradient: 'bg-gradient-to-br from-secondary to-accent',
    },
  ];

  return (
    <section id="showcases" className="section-container relative">
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
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Interactive Demos
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">
            Interactive Security Showcases
          </h2>
          
          <p className="mx-auto mt-4 max-w-3xl text-body-lg text-text-secondary">
            Two fully functional tools built from scratch — a detection engine and a threat-modeling
            workbench — with real query parsing, detection logic, and risk analysis (no mockups).
          </p>
        </motion.div>

        {/* Showcases Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:gap-7"
        >
          {showcases.map((showcase, index) => (
            <ShowcaseCard key={index} {...showcase} />
          ))}
        </motion.div>

        {/* Technical Note */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-12"
        >
          <Card
            variant="glass"
            hoverEffect="none"
            padding="lg"
            interactive={false}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Real Implementations, Not Mockups
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  These showcases feature fully functional implementations with real data processing,
                  detection algorithms, and security analysis capabilities. All detection rules,
                  query engines, and threat models are built from scratch to demonstrate deep
                  technical understanding of security engineering principles.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Showcases);

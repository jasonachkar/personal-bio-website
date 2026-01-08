'use client';

import { memo, useMemo } from 'react';
import { Shield, Network, Cloud, GitBranch, Search, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { scrollVariants, staggerContainer, viewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ShowcaseCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  href: string;
  status: 'live' | 'coming-soon';
  gradient: string;
}

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
  const itemVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.cardSlideUp, [prefersReducedMotion]);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      className="group relative"
    >
      <Link
        href={isLive ? href : '#'}
        className={cn(
          'block h-full rounded-xl border border-border bg-background-card p-6 transition-all duration-300 relative overflow-hidden',
          isLive
            ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 terminal-border'
            : 'cursor-not-allowed opacity-60'
        )}
      >
        {isLive && (
          <div className="absolute inset-0 hex-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase',
              isLive
                ? 'bg-severity-low/20 text-severity-low border border-severity-low/30'
                : 'bg-text-secondary/10 text-text-secondary border border-text-secondary/20'
            )}
          >
            {isLive ? 'Live Demo' : 'Coming Soon'}
          </span>
        </div>

        {/* Icon with Gradient */}
        <div className={cn('w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative z-10', gradient)}>
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10">
        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors glitch-effect">
          {title}
        </h3>
        <p className="text-text-secondary mb-4 leading-relaxed">{description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isLive && (
          <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            <span>Explore Demo</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        )}
        </div>
      </Link>
    </motion.div>
  );
}

function Showcases() {
  const prefersReducedMotion = useReducedMotion();
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);
  const footerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fade, [prefersReducedMotion]);

  const showcases: ShowcaseCardProps[] = [
    {
      icon: Search,
      title: 'Vulnerability Scanner',
      description:
        'Interactive security scanner demonstrating OWASP Top 10 vulnerabilities with CVSS scoring, remediation guidance, and code examples.',
      features: [
        'OWASP Top 10 (2021) vulnerability showcase',
        'CVSS v3.1 scoring with visual indicators',
        'Detailed remediation guides with code examples',
        'CWE/CVE reference mapping',
      ],
      href: '/vulnerability-scanner',
      status: 'live',
      gradient: 'bg-gradient-to-br from-severity-critical to-severity-high',
    },
    {
      icon: Shield,
      title: 'SIEM Detection Console',
      description:
        'Real-time security event monitoring and threat detection powered by custom detection rules and MITRE ATT&CK framework integration.',
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
        'Interactive STRIDE-based threat modeling tool for analyzing security architectures and identifying potential vulnerabilities.',
      features: [
        '10 STRIDE threats with MITRE ATT&CK mapping',
        'Interactive architecture visualization',
        'Mitigation tracking & recommendations',
        'Export to Markdown documentation',
      ],
      href: '/threat-modeling',
      status: 'live',
      gradient: 'bg-gradient-to-br from-secondary to-accent',
    },
    {
      icon: Cloud,
      title: 'Azure Security Blueprint',
      description:
        'Comprehensive Azure security reference with interactive architecture diagrams, security controls, and best practices.',
      features: [
        '6 core Azure security components',
        'Common misconfiguration fixes',
        'CIS benchmark checklist tracker',
        'Best practices & implementation guides',
      ],
      href: '/azure-blueprint',
      status: 'live',
      gradient: 'bg-gradient-to-br from-accent to-primary',
    },
    {
      icon: GitBranch,
      title: 'DevSecOps Pipeline Simulator',
      description:
        'Visual pipeline flow demonstrating security gates, SAST/SCA scanning, and deployment security controls.',
      features: [
        '5 security scan types (SAST, SCA, Secrets, IaC, Container)',
        '50+ realistic security findings with CVE/CWE',
        'Threshold-based security gates',
        'What-if analysis for threshold tuning',
      ],
      href: '/devsecops',
      status: 'live',
      gradient: 'bg-gradient-to-br from-severity-high to-severity-medium',
    },
  ];

  return (
    <section id="showcases" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="text-center mb-12"
        >
          <h2 className="text-headline font-bold text-text-primary mb-4">
            Interactive Security Showcases
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Explore fully functional cybersecurity tools and demonstrations. Each showcase
            demonstrates real detection engineering, threat modeling, and security architecture
            skills with actual working implementations.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
          viewport={viewportSettings}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 rounded-lg border border-border bg-background-card/50"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Real Implementations, Not Mockups
              </h3>
              <p className="text-text-secondary leading-relaxed">
                These showcases feature fully functional implementations with real data processing,
                detection algorithms, and security analysis capabilities. All detection rules,
                query engines, and threat models are built from scratch to demonstrate deep
                technical understanding of security engineering principles.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Showcases);

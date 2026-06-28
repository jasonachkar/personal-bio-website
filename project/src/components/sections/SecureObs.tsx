'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Network,
  ShieldCheck,
  Boxes,
  KeyRound,
  GitBranch,
  ExternalLink,
  Github,
  ArrowRight,
  Sparkles,
  Server,
  MonitorSmartphone,
  Database,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import type { Project, SecureObs } from '@/lib/schemas';
import {
  scrollVariants,
  staggerContainer,
  getViewportSettings,
  transitions,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

// ============================================
// SecureObs Section
// ============================================

interface SecureObsSectionProps {
  content: SecureObs;
  secondaryProjects: Project[];
}

/** Maps pillar icon strings from content to lucide icon components */
const pillarIconMap: Record<string, LucideIcon> = {
  Layers,
  Network,
  ShieldCheck,
  Boxes,
  KeyRound,
  GitBranch,
};

/** Animated count-up stat that triggers when scrolled into view */
function CountUpStat({
  value,
  label,
  detail,
  index,
  prefersReducedMotion,
}: {
  value: string;
  label: string;
  detail: string;
  index: number;
  prefersReducedMotion: boolean;
}) {
  const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const [display, setDisplay] = useState(prefersReducedMotion ? numeric : 0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || prefersReducedMotion || numeric === 0) return;
    let current = 0;
    const increment = Math.max(1, numeric / 24);
    const timer = setInterval(() => {
      current += increment;
      if (current >= numeric) {
        setDisplay(numeric);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [started, numeric, prefersReducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => setStarted(true)}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easings.easeOutQuint }}
      className={cn(
        'flex h-full min-w-0 flex-col rounded-lg border border-border bg-background-elevated/40',
        'p-3.5 text-center sm:p-4'
      )}
    >
      <div className="text-2xl font-black text-gradient sm:text-3xl">
        {display}
        {suffix && <span className="text-xl sm:text-2xl">{suffix}</span>}
      </div>
      <div className="mt-1 break-words text-[10px] font-bold uppercase tracking-widest text-text-primary sm:text-xs">
        {label}
      </div>
      <p className="mt-2 min-w-0 break-words text-[10px] leading-relaxed text-text-muted sm:text-[11px]">
        {detail}
      </p>
    </motion.div>
  );
}

type ArchitectureNode = {
  icon: LucideIcon;
  title: string;
  detail: string;
  tags: string[];
};

type ArchitectureLane = {
  phase: string;
  title: string;
  description: string;
  nodes: ArchitectureNode[];
};

const architectureLanes: ArchitectureLane[] = [
  {
    phase: '01',
    title: 'Entry & identity',
    description: 'Users and repositories enter through separate trust paths before anything reaches the API.',
    nodes: [
      {
        icon: MonitorSmartphone,
        title: 'Angular SPA',
        detail: 'Browser client uses Entra ID PKCE and tenant-aware API calls for the dashboard experience.',
        tags: ['Angular 21', 'PKCE', 'JWT'],
      },
      {
        icon: GitBranch,
        title: 'Repo and CI entry',
        detail: 'GitHub App installs, pipeline events, and scoped project API keys start scan jobs without long-lived secrets.',
        tags: ['GitHub App', 'short-lived tokens'],
      },
    ],
  },
  {
    phase: '02',
    title: 'Control plane',
    description: 'The API owns tenancy, authorization, project state, and the rules that decide whether a build can pass.',
    nodes: [
      {
        icon: Server,
        title: '.NET 8 API',
        detail: 'Clean Architecture services normalize incoming scanner output and apply project, tenant, and rate-limit checks.',
        tags: ['.NET 8', 'EF Core', 'rate limits'],
      },
      {
        icon: Database,
        title: 'PostgreSQL boundary',
        detail: 'FORCE row-level security runs under a restricted non-owner role so tenant isolation is enforced in the database.',
        tags: ['PostgreSQL 16', 'FORCE RLS'],
      },
    ],
  },
  {
    phase: '03',
    title: 'Scan execution',
    description: 'Scans run away from the web app, using ephemeral compute and versioned worker artifacts.',
    nodes: [
      {
        icon: Boxes,
        title: 'Scanner container',
        detail: 'A single Docker image bundles seven scanners and emits a stable finding contract regardless of tool format.',
        tags: ['Semgrep', 'Trivy', 'Gitleaks'],
      },
      {
        icon: Network,
        title: 'IaC graph engine',
        detail: 'Terraform is parsed without a cloud login, converted into an Azure resource graph, then evaluated for attack paths.',
        tags: ['Terraform', 'Azure graph'],
      },
    ],
  },
  {
    phase: '04',
    title: 'Governance loop',
    description: 'Findings are deduplicated, triaged, and fed back into delivery as a release-quality signal.',
    nodes: [
      {
        icon: Layers,
        title: 'Finding pipeline',
        detail: 'Cross-tool canonical hashing merges duplicate issues and keeps the dashboard focused on what still needs action.',
        tags: ['deduplication', 'triage'],
      },
      {
        icon: ShieldCheck,
        title: 'Build gate & canaries',
        detail: 'Blocking findings fail CI, while Go canaries verify scan ingestion and gate behavior after production changes.',
        tags: ['CI gate', 'Go verifier'],
      },
    ],
  },
];

const architecturePaths = [
  ['User request', 'Angular SPA', 'Entra ID', '.NET API', 'FORCE RLS', 'Tenant dashboard'],
  ['Scan request', 'CI pipeline', 'Scanner image', 'Normalizer', 'Dedup engine', 'Build decision'],
  ['IaC analysis', 'Terraform root', 'Resource graph', 'Attack-path rules', 'Risk ranking', 'Evidence view'],
];

function ArchitectureDeepDive() {
  return (
    <motion.div
      variants={scrollVariants.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-8 sm:mt-10"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Network className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Architecture deep dive
            </span>
          </div>
          <h3 className="text-xl font-bold text-text-primary sm:text-2xl">
            How SecureObs moves from code to governed security findings
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
          The system is split between a tenant-aware SaaS control plane and isolated scan workers,
          with database-enforced tenancy and CI/CD feedback loops tying the two together.
        </p>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-4">
        {architectureLanes.map((lane, laneIndex) => (
          <div key={lane.title} className="relative min-w-0">
            {laneIndex < architectureLanes.length - 1 && (
              <ArrowRight
                className="absolute -right-3 top-28 z-10 hidden h-5 w-5 rounded-full border border-border bg-background-card p-0.5 text-primary/60 lg:block"
                aria-hidden="true"
              />
            )}

            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-primary">{lane.phase}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h4 className="text-base font-semibold text-text-primary">{lane.title}</h4>
            <p className="mt-1 min-w-0 text-sm leading-relaxed text-text-muted">
              {lane.description}
            </p>

            <div className="mt-4 space-y-3">
              {lane.nodes.map((node) => (
                <div
                  key={node.title}
                  className="min-w-0 rounded-lg border border-border bg-background-card/80 p-3.5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <node.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="break-words text-sm font-semibold text-text-primary">
                        {node.title}
                      </h5>
                      <p className="mt-1 break-words text-xs leading-relaxed text-text-secondary">
                        {node.detail}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="min-w-0 break-words rounded-md border border-border bg-background-elevated px-2 py-1 font-mono text-[10px] text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {architecturePaths.map((path) => (
          <div key={path[0]} className="min-w-0 rounded-lg border border-border bg-background-elevated/40 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {path[0]}
            </p>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {path.slice(1).map((step, index, steps) => (
                <span key={`${path[0]}-${step}`} className="flex min-w-0 items-center gap-1.5">
                  <span className="min-w-0 break-words rounded-md bg-background-card px-2 py-1 font-mono text-[10px] text-text-secondary">
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-3 w-3 flex-shrink-0 text-primary/50" />
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const SecureObsSection = ({ content, secondaryProjects }: SecureObsSectionProps) => {
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
    <section id="secureobs" className="section-container relative">
      <div className="absolute inset-0 bg-mesh-gradient opacity-50 pointer-events-none" />

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
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Featured Project
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">
            <span className="text-gradient">{content.name}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-subtitle text-text-secondary">
            {content.tagline}
          </p>
        </motion.div>

        {/* Main SecureObs card with animated gradient border */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.scaleFade}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={transitions.smooth}
          className="relative"
        >
          <div
            className={cn(
              'absolute -inset-[1px] rounded-3xl',
              'bg-gradient-to-r from-primary via-secondary to-accent',
              'opacity-30 blur-sm',
              prefersReducedMotion ? '' : 'animate-gradient-shift bg-[length:200%_200%]'
            )}
            aria-hidden="true"
          />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-background-card shadow-xl">
            <div className="absolute inset-0 hex-pattern opacity-40 pointer-events-none" />

            <div className="relative z-10 p-5 sm:p-7 md:p-9">
              {/* Title row + links */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
                      {content.name}
                    </h3>
                    <Badge
                      label={content.status}
                      variant="cyber"
                      size="xs"
                      dot
                      dotColor="success"
                      interactive={false}
                    />
                  </div>
                  <p className="mt-1 font-mono text-xs text-primary/80 sm:text-sm">
                    secureobs.com
                  </p>
                </div>

                <div className="flex flex-shrink-0 flex-wrap gap-2.5">
                  <a
                    href={content.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2',
                      'text-sm font-semibold',
                      'bg-primary text-white',
                      'shadow-lg shadow-primary/20',
                      'transition-all duration-200 hover:shadow-primary/40 hover:-translate-y-0.5'
                    )}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Site
                  </a>
                  {content.sourceUrl && (
                    <a
                      href={content.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2',
                        'text-sm font-semibold',
                        'border border-border bg-background-elevated text-text-primary',
                        'transition-all duration-200 hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      <Github className="h-4 w-4" />
                      Source
                    </a>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="mt-5 max-w-3xl text-body-lg text-text-secondary">{content.summary}</p>

              {/* Scope stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {content.stats.map((stat, idx) => (
                  <CountUpStat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    detail={stat.detail}
                    index={idx}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>

            </div>
          </div>
        </motion.div>

        <ArchitectureDeepDive />

        {/* Capability pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.pillars.map((pillar) => {
            const Icon = pillarIconMap[pillar.icon] ?? ShieldCheck;
            return (
              <motion.div key={pillar.title} variants={cardVariants} className="h-full">
                <Card variant="cyber" hoverEffect="lift" padding="lg" className="group h-full">
                  <div
                    className={cn(
                      'mb-3 inline-flex rounded-xl p-2.5',
                      'bg-primary/10 text-primary',
                      'transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-2 text-base font-semibold text-text-primary transition-colors group-hover:text-primary sm:text-lg">
                    {pillar.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {pillar.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tech stack */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 rounded-2xl border border-border bg-background-card/60 p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.techStack.map((group) => (
              <div key={group.group}>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} label={item} variant="default" size="xs" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Also built (secondary projects) */}
        {secondaryProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-10 sm:mt-12"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Also built
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {secondaryProjects.map((project) => (
                <motion.a
                  key={project.id}
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants}
                  className="group block h-full"
                >
                  <Card variant="default" hoverEffect="lift" padding="lg" className="h-full">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-text-primary transition-colors group-hover:text-primary sm:text-lg">
                          {project.title}
                        </h4>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary/70">
                          {project.role}
                        </p>
                      </div>
                      <Github className="h-4 w-4 flex-shrink-0 text-text-muted transition-colors group-hover:text-primary" />
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 5).map((tech) => (
                        <Badge key={tech} label={tech} variant="default" size="xs" />
                      ))}
                      {project.tech.length > 5 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs text-text-muted">
                          +{project.tech.length - 5}
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default memo(SecureObsSection);

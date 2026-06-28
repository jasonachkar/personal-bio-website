'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Database,
  ExternalLink,
  GitBranch,
  Github,
  Lock,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import Badge from '../ui/Badge';
import type { Project } from '@/lib/schemas';
import {
  scrollVariants,
  getViewportSettings,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

// ============================================
// Projects Section Component
// ============================================

/**
 * Projects section props interface
 * @interface ProjectsProps
 * @description Props for the Projects section component
 */
interface ProjectsProps {
  /** Array of project data to display */
  projects: Project[];
}

type SpotlightProject = Project & {
  highlights?: string[];
  metrics?: Array<{ label: string; value: string }>;
};

const secureObsCapabilities = [
  {
    label: 'Scanner orchestration',
    value: 'SAST, DAST, secrets, SCA, IaC, and container scanning in one workflow',
    icon: Search,
  },
  {
    label: 'Pipeline control',
    value: 'CI/CD gates fail builds on unresolved blocking findings',
    icon: GitBranch,
  },
  {
    label: 'Tenant isolation',
    value: 'Application authorization plus PostgreSQL FORCE row-level security',
    icon: Database,
  },
  {
    label: 'Secure cloud runtime',
    value: 'Managed Identity, Key Vault, short-lived tokens, and sandboxed Azure runners',
    icon: Lock,
  },
];

function SecureObsSpotlight({
  project,
  prefersReducedMotion,
}: {
  project: SpotlightProject;
  prefersReducedMotion: boolean;
}) {
  const highlights = project.highlights ?? [];
  const metrics = project.metrics ?? [];

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : scrollVariants.scaleFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-8 sm:mb-10 md:mb-12"
    >
      <div className="liquid-glass-strong relative overflow-hidden rounded-2xl border border-border p-5 shadow-card dark:shadow-2xl sm:p-6 md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge
                label="Flagship Project"
                variant="cyber"
                size="sm"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                interactive={false}
              />
              <Badge
                label="Production SaaS"
                variant="default"
                size="sm"
                icon={<Shield className="h-3.5 w-3.5" />}
                interactive={false}
              />
            </div>

            <h3 className="text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-primary">
              {project.role}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
              {project.description}
            </p>

            {metrics.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-border bg-background-elevated/55 px-3 py-3 text-center"
                  >
                    <div className="text-xl font-black text-primary sm:text-2xl">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.slice(0, 8).map((tech) => (
                <Badge key={tech} label={tech} size="xs" variant="default" />
              ))}
              {project.tech.length > 8 && (
                <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs text-text-muted">
                  +{project.tech.length - 8}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                    'border border-primary/30 bg-primary text-white',
                    'font-medium shadow-button transition-colors hover:bg-primary-hover'
                  )}
                  whileHover={prefersReducedMotion ? {} : { y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit SecureObs
                </motion.a>
              )}
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                    'border border-border bg-background-elevated/60 text-text-primary',
                    'font-medium transition-colors hover:border-primary/40 hover:bg-primary/10'
                  )}
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <Github className="h-4 w-4" />
                Source
              </motion.a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {secureObsCapabilities.map((capability) => {
                const CapabilityIcon = capability.icon;

                return (
                  <div
                    key={capability.label}
                    className="rounded-xl border border-border bg-background-elevated/45 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <CapabilityIcon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                        {capability.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {capability.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {highlights.length > 0 && (
              <div className="rounded-xl border border-border bg-background-elevated/45 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Why it matters
                </p>
                <ul className="space-y-2.5">
                  {highlights.slice(0, 4).map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Projects Section Component
 * @description Displays featured projects in a responsive grid layout
 * @example
 * ```tsx
 * <Projects projects={projectsData} />
 * ```
 */
const Projects = ({ projects }: ProjectsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const spotlightProject = projects.find((project) => project.id === 'secureobs') as
    | SpotlightProject
    | undefined;

  // Memoized animation variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  
  return (
    <section
      id="projects"
      className="section-container relative"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50 pointer-events-none" />
      
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
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Featured Work
            </span>
          </motion.div>
          
          <h2 className="text-headline text-text-primary">
            Flagship Work
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            A production SaaS I designed and built end to end, focused on scanner
            orchestration, triage, and pipeline enforcement.
          </p>
        </motion.div>

        {spotlightProject && (
          <SecureObsSpotlight
            project={spotlightProject}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

      </div>
    </section>
  );
};

export default memo(Projects);

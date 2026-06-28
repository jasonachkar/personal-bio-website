'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
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
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Project } from '@/lib/schemas';
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
      <div className="liquid-glass-strong relative overflow-hidden rounded-2xl border border-white/15 p-5 shadow-glass dark:border-primary/20 dark:shadow-glass-dark sm:p-6 md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60" />

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
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center dark:bg-white/[0.03]"
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
                  'border border-white/15 bg-white/[0.04] text-text-primary',
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
                    className="rounded-xl border border-white/10 bg-white/[0.035] p-4 dark:bg-white/[0.025]"
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
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Why it matters
                </p>
                <ul className="space-y-2.5">
                  {highlights.slice(0, 5).map((highlight) => (
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
 * Individual project card component
 * @description Renders a single project card with enhanced styling
 */
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  prefersReducedMotion,
}: {
  project: Project;
  index: number;
  prefersReducedMotion: boolean;
}) {
  // Check if project has a demo URL
  const hasDemo = Boolean(project.demoUrl);
  
  // Check if this is a featured project (first 3)
  const isFeatured = index < 3;

  // Animation variants
  const itemVariants = prefersReducedMotion ? {} : scrollVariants.cardReveal;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="h-full"
      style={{ contain: 'layout style paint' }}
    >
      <Card
        variant={isFeatured ? 'cyber' : 'default'}
        hoverEffect="lift"
        padding="none"
        className={cn(
          'group h-full',
          'transition-all duration-300',
          isFeatured && 'ring-1 ring-primary/10 dark:ring-primary/20'
        )}
      >
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute right-3 top-3 z-20">
            <Badge
              label="Featured"
              variant="cyber"
              size="xs"
              icon={<Sparkles className="h-3 w-3" />}
              interactive={false}
            />
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
          {/* Header Section */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className={cn(
                'text-lg font-semibold leading-tight text-text-primary',
                'transition-colors duration-300',
                'group-hover:text-primary',
                'sm:text-xl'
              )}>
                {project.title}
              </h3>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-primary/80">
                {project.role}
              </p>
            </div>
            
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 rounded-xl p-2.5',
              'bg-primary/10 text-primary',
              'transition-all duration-300',
              'group-hover:bg-primary/20 group-hover:scale-110'
            )}>
              <Shield className="h-5 w-5" />
            </div>
          </div>

          {/* Description */}
          <p className={cn(
            'mb-4 flex-1 text-sm leading-relaxed text-text-secondary',
            'line-clamp-3'
          )}>
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  label={tech}
                  variant="default"
                  size="xs"
                />
              ))}
              {project.tech.length > 4 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs text-text-muted">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border/50">
            {/* View Code Button */}
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2',
                'text-sm font-medium text-text-secondary',
                'transition-all duration-200',
                'hover:text-primary'
              )}
              whileHover={prefersReducedMotion ? {} : { x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <Github className="h-4 w-4" />
              <span>View Code</span>
            </motion.a>

            {/* Live Demo Button (if available) */}
            {hasDemo && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2',
                  'rounded-full px-3 py-1.5',
                  'text-sm font-medium',
                  'bg-primary/10 text-primary',
                  'border border-primary/30',
                  'transition-all duration-200',
                  'hover:bg-primary/20 hover:border-primary/50'
                )}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Demo</span>
              </motion.a>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={cn(
          'absolute inset-0 rounded-[inherit] pointer-events-none',
          'opacity-0 transition-opacity duration-500',
          'group-hover:opacity-100'
        )}>
          {/* Hex Pattern Overlay */}
          <div className="absolute inset-0 hex-pattern opacity-50" />
          
          {/* Gradient Border Glow */}
          <div className={cn(
            'absolute inset-0 rounded-[inherit]',
            'bg-gradient-to-br from-primary/5 via-transparent to-accent/5'
          )} />
        </div>
      </Card>
    </motion.div>
  );
});

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
  const supportingProjects = spotlightProject
    ? projects.filter((project) => project.id !== spotlightProject.id)
    : projects;

  // Memoized animation variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
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
            Flagship Project & Security Work
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            SecureObs is the centerpiece: a production DevSecOps security platform
            backed by focused labs and security engineering projects.
          </p>
        </motion.div>

        {spotlightProject && (
          <SecureObsSpotlight
            project={spotlightProject}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className={cn(
            'grid gap-5 sm:gap-6 md:gap-7',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          )}
          style={{ contain: 'layout style paint' }}
        >
          {supportingProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={spotlightProject ? index + 1 : index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fade}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="mt-10 text-center sm:mt-12 md:mt-14"
        >
          <p className="text-text-secondary">
            More projects and labs in development. Check my{' '}
            <motion.a
              href="https://github.com/jasonachkar"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1',
                'font-medium text-primary',
                'transition-colors duration-200',
                'hover:text-primary-hover'
              )}
              whileHover={prefersReducedMotion ? {} : { x: 3 }}
              transition={{ duration: 0.2 }}
            >
              GitHub
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            {' '}for the latest updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Projects);

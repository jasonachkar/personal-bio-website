'use client';

import { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Github, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import SecureObsSpotlight from '../SecureObsSpotlight';
import KqlViewer from '../KqlViewer';
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

/**
 * Compact project card — CSS-only hover, no decorative overlays, consistent
 * heights so the "Other Projects" grid reads as a tidy list.
 */
const ProjectCard = memo(function ProjectCard({
  project,
  prefersReducedMotion,
}: {
  project: Project;
  prefersReducedMotion: boolean;
}) {
  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);

  // Hide the thumbnail gracefully when the image file does not exist
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = Boolean(project.thumbnail) && !thumbnailFailed;

  const itemVariants = prefersReducedMotion ? {} : scrollVariants.fadeUp;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <div
        className={cn(
          'group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl',
          'border border-border bg-background-card',
          'transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft-lg'
        )}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Thumbnail (hidden if the file is missing) */}
        {showThumbnail && (
          <img
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            loading="lazy"
            onError={() => setThumbnailFailed(true)}
            className="h-32 w-full object-cover"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          {/* Header */}
          <h3
            className={cn(
              'break-words text-base font-semibold leading-snug text-text-primary [overflow-wrap:anywhere]',
              'transition-colors duration-200 group-hover:text-primary',
              'sm:text-lg'
            )}
          >
            {project.title}
          </h3>
          <p className="mt-1 break-words text-[11px] font-medium uppercase leading-relaxed tracking-wide text-text-muted [overflow-wrap:anywhere]">
            {project.role}
          </p>

          {/* Description */}
          <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-text-secondary [overflow-wrap:anywhere]">
            {project.description}
          </p>

          {/* KQL Playground (Sentinel detection pack only) */}
          {project.id === 'sentinel-detection-pack' && <KqlViewer />}

          {/* Tech Stack */}
          <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                label={tech}
                variant="default"
                size="xs"
                className="max-w-full overflow-hidden [&>span]:truncate"
              />
            ))}
            {project.tech.length > 4 && (
              <span className="inline-flex items-center px-1.5 text-xs text-text-muted">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3.5">
            {hasRepo && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-primary"
              >
                <Github className="h-4 w-4" />
                View Code
              </a>
            )}
            {hasDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
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
  const [showOtherProjects, setShowOtherProjects] = useState(false);

  const otherProjects = useMemo(
    () => projects.filter((project) => !project.featured && project.id !== 'secureobs'),
    [projects]
  );

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
            Featured Projects
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Cybersecurity projects demonstrating security architecture,
            threat detection, and secure development practices
          </p>
        </motion.div>

        {/* SecureObs Featured Spotlight */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 sm:mb-12"
        >
          <SecureObsSpotlight />
        </motion.div>

        {/* Other Projects */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className={cn('flex items-center gap-4', showOtherProjects && 'mb-6 sm:mb-8')}
        >
          <button
            type="button"
            onClick={() => setShowOtherProjects((visible) => !visible)}
            aria-expanded={showOtherProjects}
            aria-controls="other-projects-grid"
            className="group/toggle flex w-full items-center gap-4 rounded-xl py-2 text-left focus-ring"
          >
            <span className="flex shrink-0 items-center gap-2.5">
              <span className="text-lg font-semibold text-text-primary transition-colors group-hover/toggle:text-primary sm:text-xl">
                Other Projects
              </span>
              <span className="rounded-full border border-border bg-background-elevated px-2 py-0.5 font-mono text-[10px] text-text-muted">
                {otherProjects.length}
              </span>
            </span>
            <span className="h-px flex-1 bg-border transition-colors group-hover/toggle:bg-primary/40" aria-hidden="true" />
            <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-text-muted transition-colors group-hover/toggle:text-primary">
              <span className="hidden sm:inline">{showOtherProjects ? 'Hide' : 'Show projects'}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  showOtherProjects && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </span>
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {showOtherProjects && (
            <motion.div
              id="other-projects-grid"
              initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : transitions.smooth}
              className="overflow-hidden"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  'grid items-stretch gap-4 sm:gap-5',
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                )}
              >
                {otherProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fade}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className={cn(
            'text-center transition-[margin] duration-300',
            showOtherProjects ? 'mt-10 sm:mt-12 md:mt-14' : 'mt-6 sm:mt-8'
          )}
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

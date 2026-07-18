'use client';

import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Sparkles } from 'lucide-react';
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
          'group flex h-full flex-col overflow-hidden rounded-2xl',
          'border border-border bg-background-card',
          'transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft-lg'
        )}
      >
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

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Header */}
          <h3
            className={cn(
              'text-base font-semibold leading-snug text-text-primary',
              'transition-colors duration-200 group-hover:text-primary',
              'sm:text-lg'
            )}
          >
            {project.title}
          </h3>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
            {project.role}
          </p>

          {/* Description */}
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
            {project.description}
          </p>

          {/* KQL Playground (Sentinel detection pack only) */}
          {project.id === 'sentinel-detection-pack' && <KqlViewer />}

          {/* Tech Stack */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge key={tech} label={tech} variant="default" size="xs" />
            ))}
            {project.tech.length > 4 && (
              <span className="inline-flex items-center px-1.5 text-xs text-text-muted">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-3.5">
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
          className="mb-6 flex items-center gap-4 sm:mb-8"
        >
          <h3 className="flex-shrink-0 text-lg font-semibold text-text-primary sm:text-xl">
            Other Projects
          </h3>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className={cn(
            'grid items-stretch gap-4 sm:gap-5',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {projects
            .filter((project) => !project.featured && project.id !== 'secureobs')
            .map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
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

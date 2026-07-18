'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Sparkles, Shield } from 'lucide-react';
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

/**
 * Individual project card component
 * @description Renders a single project card with enhanced styling
 */
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  prefersReducedMotion,
  isMobile,
}: {
  project: Project;
  index: number;
  prefersReducedMotion: boolean;
  isMobile: boolean;
}) {
  // Check if project has a demo URL
  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);
  
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
            {hasRepo && (
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
            )}

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
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
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

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Project } from '@/lib/schemas';
import { scrollVariants, staggerContainer, getViewportSettings, transitions } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);
  const itemVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.cardReveal, [prefersReducedMotion]);

  return (
    <section id="projects" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Cybersecurity projects demonstrating security architecture, threat detection, and secure development practices
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          style={{ contain: 'layout style paint' }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
              style={{ contain: 'layout style paint' }}
            >
              <Card className="group relative h-full overflow-hidden border border-border bg-background-card terminal-border">
                <div className="absolute inset-0 hex-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="p-6 relative z-10">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold text-text-primary transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Github className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Role
                    </p>
                    <p className="text-sm text-text-secondary">{project.role}</p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <Badge key={tech} label={tech} />
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs text-text-muted">+{project.tech.length - 4}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                      View Code
                      <Github className="h-4 w-4" />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-secondary-hover"
                      >
                        Live Demo
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-primary/0 transition-all group-hover:border-primary/20" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : scrollVariants.fade}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary">
            More projects and labs in development. Check my{' '}
            <a
              href="https://github.com/jasonachkar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover"
            >
              GitHub
              <ArrowRight className="h-4 w-4" />
            </a>
            {' '}for the latest updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Projects);

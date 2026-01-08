import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Shield, Code } from 'lucide-react';
import Badge from '../ui/Badge';
import type { Experience } from '@/lib/schemas';
import { scrollVariants, staggerContainer, getViewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ExperienceProps {
  experience: Experience[];
}

const Experience = ({ experience }: ExperienceProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);
  const itemVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.slideLeft, [prefersReducedMotion]);

  return (
    <section
      id="experience"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Professional Experience
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Secure software development with a focus on building resilient systems and integrating security throughout the SDLC
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30 md:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-12"
          >
            {experience.map((exp) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute left-6 top-6 hidden h-5 w-5 rounded-full border-4 border-primary bg-background shadow-lg shadow-primary/50 md:block" />

                <div className="md:ml-20">
                  <div className="group rounded-2xl border border-border bg-background-card p-6 transition-all hover:border-primary/50 hover:shadow-lg md:p-8">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="mb-2 text-2xl font-semibold text-text-primary">
                          {exp.role}
                        </h3>
                        <p className="mb-2 text-lg font-medium text-primary">
                          {exp.company}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {exp.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 space-y-4">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <Code className="h-5 w-5 text-secondary" />
                          <h4 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                            Key Achievements
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-text-secondary">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
                            Security Highlights
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {exp.securityHighlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} label={tech} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Experience);

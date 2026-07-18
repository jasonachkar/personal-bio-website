'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  GraduationCap,
  Award,
  CheckCircle2,
  ExternalLink,
  Verified,
  Sparkles,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Certification, Education } from '@/lib/schemas';
import {
  scrollVariants,
  staggerContainer,
  getViewportSettings,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

// ============================================
// Certifications Section Component
// ============================================

/**
 * Certifications section props interface
 * @interface CertificationsProps
 * @description Props for the Certifications section component
 */
interface CertificationsProps {
  /** Array of certification data */
  certifications: Certification[];
  /** Array of education data */
  education: Education[];
}

/**
 * Certifications Section Component
 * @description Displays certifications and education in a grid layout
 */
const Certifications = ({ certifications, education }: CertificationsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  // Memoized variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );
  const itemVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.cardReveal),
    [prefersReducedMotion]
  );

  return (
    <section id="certifications" className="section-container relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-radial-fade opacity-40 pointer-events-none" />

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
            <Award className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Credentials
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">
            Certifications & Education
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Structured learning path combining industry certifications with
            formal academic study in cybersecurity
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mb-6 sm:mb-8 flex items-center gap-3"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Award className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary sm:text-2xl">
              Certifications
            </h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          >
            {certifications.map((cert) => {
              const isInProgress = cert.date.toLowerCase() === 'in progress';
              const verificationUrl = (cert as any).verificationUrl;
              const credentialId = (cert as any).credentialId;

              return (
                <motion.div key={cert.id} variants={itemVariants} className="h-full">
                  <Card
                    variant="cyber"
                    hoverEffect="lift"
                    padding="none"
                    className="group h-full border-primary/15"
                  >
                    <div className="relative flex h-full flex-col p-5 sm:p-6">
                      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Icon and credential status */}
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/15">
                          <Shield className="h-5 w-5" aria-hidden="true" />
                        </div>

                        {verificationUrl ? (
                          <motion.a
                            href={verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
                              'border-severity-low/30 bg-severity-low/10',
                              'text-xs font-semibold text-severity-low transition-colors',
                              'hover:bg-severity-low/20'
                            )}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                          >
                            <Verified className="h-3.5 w-3.5" aria-hidden="true" />
                            Verified
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </motion.a>
                        ) : (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
                              'text-xs font-medium',
                              isInProgress
                                ? 'border-accent/30 bg-accent/10 text-accent'
                                : 'border-severity-low/25 bg-severity-low/10 text-severity-low'
                            )}
                          >
                            {isInProgress ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {isInProgress ? 'In progress' : `Earned ${cert.date}`}
                          </span>
                        )}
                      </div>

                      {/* Certification details */}
                      <div>
                        <h4 className="text-lg font-semibold leading-snug text-text-primary sm:text-xl">
                          {cert.name}
                        </h4>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                          <span className="font-medium text-primary">{cert.issuer}</span>
                          {verificationUrl && (
                            <>
                              <span className="text-text-muted" aria-hidden="true">•</span>
                              <span className="text-text-muted">{cert.date}</span>
                            </>
                          )}
                          {credentialId && (
                            <>
                              <span className="text-text-muted" aria-hidden="true">•</span>
                              <span className="font-mono text-xs text-text-muted">
                                ID: {credentialId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="mb-5 mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
                        {cert.description}
                      </p>

                      {/* Skills */}
                      <div className="border-t border-border/80 pt-4">
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          Key Skills
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {cert.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} label={skill} size="xs" variant="default" />
                          ))}
                          {cert.skills.length > 4 && (
                            <span className="px-1 text-xs text-text-muted">
                              +{cert.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Education Grid */}
        <div>
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mb-6 sm:mb-8 flex items-center gap-3"
          >
            <div className="rounded-lg bg-secondary/10 p-2">
              <GraduationCap className="h-5 w-5 text-secondary sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary sm:text-2xl">
              Education
            </h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid gap-4 sm:gap-5 lg:grid-cols-2 md:gap-6"
          >
            {education.map((edu) => (
              <motion.div key={edu.id} variants={itemVariants}>
                <Card
                  variant="default"
                  hoverEffect="lift"
                  padding="none"
                  className="group h-full"
                >
                  <div className="relative p-5 sm:p-6">
                    {/* In Progress Badge */}
                    {edu.status === 'in-progress' && (
                      <div className="absolute right-4 top-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full',
                          'bg-secondary/15 px-3 py-1',
                          'text-xs font-medium text-secondary'
                        )}>
                          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                          In Progress
                        </span>
                      </div>
                    )}

                    {/* Education Content */}
                    <div className={edu.status === 'in-progress' ? 'pr-24' : ''}>
                      <h4 className="mb-2 text-lg font-semibold text-text-primary sm:text-xl">
                        {edu.degree}
                      </h4>
                      <p className="mb-1 text-sm font-medium text-secondary">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-text-muted sm:text-sm">
                        {edu.location} • {edu.period}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="mt-4 mb-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Highlights
                      </p>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {edu.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Relevant Courses */}
                    {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                          Relevant Coursework
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {edu.relevantCourses.map((course) => (
                            <Badge
                              key={course}
                              label={course}
                              size="xs"
                              variant="default"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Certifications);

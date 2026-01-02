import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Certification, Education } from '@/lib/schemas';
import { scrollVariants, staggerContainer, viewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CertificationsProps {
  certifications: Certification[];
  education: Education[];
}

const Certifications = ({ certifications, education }: CertificationsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);
  const itemVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.cardReveal, [prefersReducedMotion]);

  return (
    <section
      id="certifications"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Certifications & Education
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Structured learning path combining industry certifications with formal academic study in cybersecurity
          </p>
        </motion.div>

        <div className="mb-16">
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            className="mb-8 flex items-center gap-3"
          >
            <Award className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold text-text-primary">Certifications</h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
              >
                <Card className="group relative h-full overflow-hidden border border-border bg-background-card p-6">
                  <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Shield className="h-8 w-8 text-primary/20" />
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 text-xl font-semibold text-text-primary">
                      {cert.name}
                    </h4>
                    <p className="mb-1 text-sm font-medium text-primary">{cert.issuer}</p>
                    <p className="text-sm text-text-muted">{cert.date}</p>
                  </div>

                  <p className="mb-4 text-sm text-text-secondary">{cert.description}</p>

                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Key Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} label={skill} />
                      ))}
                      {cert.skills.length > 4 && (
                        <span className="text-xs text-text-muted">
                          +{cert.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            className="mb-8 flex items-center gap-3"
          >
            <GraduationCap className="h-6 w-6 text-secondary" />
            <h3 className="text-2xl font-semibold text-text-primary">Education</h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            className="grid gap-6 lg:grid-cols-2"
          >
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                variants={itemVariants}
              >
                <Card className="group relative h-full overflow-hidden border border-border bg-background-card p-6">
                  {edu.status === 'in-progress' && (
                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                        In Progress
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="mb-2 text-xl font-semibold text-text-primary">
                      {edu.degree}
                    </h4>
                    <p className="mb-1 text-sm font-medium text-secondary">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-text-muted">
                      {edu.location} • {edu.period}
                    </p>
                  </div>

                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Highlights
                    </p>
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Relevant Coursework
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.relevantCourses.map((course) => (
                          <Badge key={course} label={course} />
                        ))}
                      </div>
                    </div>
                  )}
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

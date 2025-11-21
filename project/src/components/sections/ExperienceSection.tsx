import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getExperiences } from '@/lib/data-access/experiences';
import { Briefcase, Calendar } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export async function ExperienceSection() {
  const experiences = await getExperiences();

  const formatDate = (date: string | null) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <SectionContainer id="experience" background="default">
      <AnimatedSection>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              Experience
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-purple to-primary-green md:left-1/2"></div>

            {experiences.length === 0 ? (
              <div className="rounded-lg border border-border bg-background-card p-8 text-center">
                <Briefcase className="mx-auto mb-4 h-12 w-12 text-text-muted" />
                <p className="text-text-secondary">
                  No experiences added yet. Add some to your Supabase database!
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <AnimatedSection key={exp.id} delay={index * 0.1}>
                    <div className={`relative md:flex md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-6 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-primary bg-background md:left-1/2"></div>

                      {/* Content */}
                      <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="rounded-lg border border-border bg-background-card p-6 transition-all hover:border-primary hover:shadow-card-hover">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-text-primary">{exp.role}</h3>
                              <p className="text-lg text-primary">{exp.company}</p>
                            </div>
                            <Briefcase className="h-6 w-6 text-text-muted" />
                          </div>

                          <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                            </span>
                          </div>

                          <p className="mb-4 text-text-secondary">{exp.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {exp.tech_stack.map((tech) => (
                              <Badge key={tech} label={tech} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}

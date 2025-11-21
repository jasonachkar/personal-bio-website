import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { skillCategories } from '@/config/theme';
import { Code2, Shield, Gamepad2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const iconMap = {
  Code2,
  Shield,
  Gamepad2,
};

export function SkillsSection() {
  return (
    <SectionContainer id="skills" background="elevated">
      <AnimatedSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              Skills & Expertise
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {skillCategories.map((category, index) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap];

              return (
                <AnimatedSection key={category.name} delay={index * 0.1}>
                  <div className="rounded-lg border border-border bg-background-card p-6 transition-all hover:border-primary hover:shadow-card-hover">
                    <div className="mb-6 flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold text-text-primary">{category.name}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} label={skill} className="hover:border-primary hover:bg-primary/10" />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}

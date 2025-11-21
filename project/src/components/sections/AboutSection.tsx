import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { User, Code, Shield, Zap } from 'lucide-react';

export function AboutSection() {
  return (
    <SectionContainer id="about" background="grid">
      <AnimatedSection>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              About Me
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
          </div>

          <div className="mb-12 rounded-lg border border-border bg-background-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold text-text-primary">Who I Am</h3>
            </div>
            <p className="mb-4 text-lg leading-relaxed text-text-secondary">
              I'm a passionate technologist at the intersection of software development, cybersecurity, and game development.
              With a foundation in full-stack web development and a deep interest in security research, I build secure,
              scalable applications while hunting for vulnerabilities and strengthening digital defenses.
            </p>
            <p className="text-lg leading-relaxed text-text-secondary">
              My approach combines creative problem-solving from game development with rigorous security practices from
              penetration testing and threat analysis. Whether I'm building React applications, analyzing SIEM logs,
              or creating interactive experiences with PlayCanvas, I bring a security-first mindset to every project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <AnimatedSection delay={0.1}>
              <div className="rounded-lg border border-border bg-background-card p-6 transition-all hover:border-primary hover:shadow-card-hover">
                <Code className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold text-text-primary">Software Engineer</h3>
                <p className="text-text-secondary">
                  Building modern web applications with React, TypeScript, Next.js, and Node.js.
                  Focused on performance, scalability, and user experience.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-lg border border-border bg-background-card p-6 transition-all hover:border-primary-purple hover:shadow-glow-purple">
                <Shield className="mb-4 h-12 w-12 text-primary-purple" />
                <h3 className="mb-2 text-xl font-bold text-text-primary">Security Researcher</h3>
                <p className="text-text-secondary">
                  Specializing in web application security, SIEM analysis, threat hunting, and incident response.
                  Active in bug bounty programs and CTF competitions.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="rounded-lg border border-border bg-background-card p-6 transition-all hover:border-primary-green hover:shadow-glow-green">
                <Zap className="mb-4 h-12 w-12 text-primary-green" />
                <h3 className="mb-2 text-xl font-bold text-text-primary">Game Developer</h3>
                <p className="text-text-secondary">
                  Creating interactive web-based games using PlayCanvas, Three.js, and WebGL.
                  Combining creative design with technical implementation.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}

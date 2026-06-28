import { ExternalLink, Github } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { profile } from '@/content/profile';
import { secondaryProjects } from '@/content/projects';

export function SecondaryProjects() {
  return (
    <section className="page-section">
      <Container>
        <div className="max-w-prose">
          <p className="eyebrow">Supporting work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text-primary">
            Focused project links
          </h2>
          <p className="mt-4 text-base leading-7 text-text-secondary">
            SecureObs leads the portfolio. These supporting links give more context without turning the site into a project archive.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {secondaryProjects.map((project) => (
            <Card key={project.title} className="p-6">
              <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{project.description}</p>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
              >
                {project.linkLabel}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <ButtonLink href={profile.links.github} target="_blank" rel="noreferrer" variant="secondary">
            More on GitHub
            <Github aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

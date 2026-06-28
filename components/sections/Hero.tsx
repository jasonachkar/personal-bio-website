import { ArrowRight, Download, ExternalLink, GitBranch, LockKeyhole, ShieldCheck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { profile } from '@/content/profile';

const labCtas = [
  {
    href: '/labs/iac-attack-paths',
    label: 'Explore cloud attack paths from Terraform',
    icon: GitBranch,
  },
  {
    href: '/labs/pipeline',
    label: 'Run a secure CI/CD pipeline',
    icon: ShieldCheck,
  },
  {
    href: '/labs/access-control',
    label: 'Try multi-tenant access control',
    icon: LockKeyhole,
  },
] as const;

export function Hero() {
  return (
    <section className="py-16 md:py-20">
      <Container className="text-center">
        <p className="eyebrow">{profile.location} · {profile.availability}</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-normal text-text-primary md:text-6xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-xl leading-8 text-text-secondary">
          <span className="font-semibold text-text-primary">{profile.headline}</span> - {profile.positioning}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-muted">
          Click a lab below - explore attack paths, run a pipeline, or test access control. All sample data.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-3 md:grid-cols-3">
          {labCtas.map((cta) => {
            const Icon = cta.icon;

            return (
              <ButtonLink key={cta.href} href={cta.href} variant="primary" className="h-full justify-between text-left">
                <span>{cta.label}</span>
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              </ButtonLink>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ButtonLink href={profile.links.secureObs} target="_blank" rel="noreferrer" variant="secondary">
            View SecureObs
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={profile.links.resume} variant="secondary">
            Resume
            <Download aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/labs" variant="quiet">
            All labs
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

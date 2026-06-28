import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { secureObs } from '@/content/projects';

export function SecureObsSection() {
  return (
    <section className="page-section bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <p className="eyebrow">Flagship project</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text-primary md:text-4xl">
              SecureObs
            </h2>
            <p className="mt-5 max-w-prose text-lg leading-8 text-text-secondary">{secureObs.oneLine}</p>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Differentiators
              </h3>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-text-secondary">
                {secureObs.differentiators.map((item) => (
                  <li key={item} className="rounded-lg border border-border bg-background p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {secureObs.scanners.map((scanner) => (
                <Badge key={scanner}>{scanner}</Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={secureObs.liveUrl} target="_blank" rel="noreferrer" variant="primary">
                Live product
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={secureObs.sourceUrl} target="_blank" rel="noreferrer" variant="secondary">
                Source & architecture
                <Github aria-hidden="true" className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <Image
              src="/secureobs-architecture.svg"
              alt="SecureObs architecture diagram showing scanners, triage, gates, tenant isolation, and Azure deployment"
              width={840}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

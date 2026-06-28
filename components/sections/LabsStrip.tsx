import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { labs } from '@/content/projects';

export function LabsStrip() {
  return (
    <section className="page-section">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Labs</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text-primary">
              Three ways to inspect the work
            </h2>
          </div>
          <Link href="/labs" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong">
            View all labs
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {labs.map((lab) => (
            <Card key={lab.href} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-semibold text-text-primary">{lab.title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{lab.description}</p>
              <p className="mt-4 text-sm leading-6 text-text-muted">{lab.demonstrates}</p>
              <Link
                href={lab.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
              >
                Open
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

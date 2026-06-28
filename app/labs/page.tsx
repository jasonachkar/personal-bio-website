import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { labs } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Labs',
  description:
    'Three client-side simulations demonstrating Terraform attack-path analysis, secure CI/CD gates, and multi-tenant access control.',
};

export default function LabsPage() {
  return (
    <Container className="py-16 md:py-20">
      <div className="max-w-prose">
        <p className="eyebrow">Labs</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-text-primary md:text-5xl">
          Interactive simulations on sample data
        </h1>
        <p className="mt-5 text-lg leading-8 text-text-secondary">
          Each lab runs entirely in the browser on baked-in fixtures. No live systems are queried, no scans are triggered, and no user targets are submitted.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {labs.map((lab) => (
          <Card key={lab.href} className="flex h-full flex-col p-6">
            <h2 className="text-xl font-semibold text-text-primary">{lab.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{lab.description}</p>
            <p className="mt-4 text-sm leading-6 text-text-muted">{lab.demonstrates}</p>
            <Link
              href={lab.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
            >
              Open lab
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  );
}

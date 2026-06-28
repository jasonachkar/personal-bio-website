import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { writing } from '@/content/writing';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Cloud security labs and write-ups by Jason Achkar Diab.',
};

export default function WritingPage() {
  return (
    <Container className="py-16 md:py-20">
      <div className="max-w-prose">
        <p className="eyebrow">Writing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-text-primary md:text-5xl">
          Cloud security labs and write-ups
        </h1>
        <p className="mt-5 text-lg leading-8 text-text-secondary">
          A short index for external write-ups. The portfolio keeps writing lightweight so the main site stays focused on SecureObs and the three labs.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {writing.map((item) => (
          <Card key={item.href} className="p-6">
            <h2 className="text-xl font-semibold text-text-primary">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{item.description}</p>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
            >
              Open GitHub
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
    </Container>
  );
}

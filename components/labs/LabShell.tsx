import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SampleDataNotice } from './SampleDataNotice';
import { WhatThisDemonstrates } from './WhatThisDemonstrates';

export function LabShell({
  title,
  intro,
  demonstrates,
  children,
}: {
  title: string;
  intro: string;
  demonstrates: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-10 md:py-14">
      <Link href="/labs" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Labs
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow">Client-side lab</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-text-primary md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-8 text-text-secondary">{intro}</p>
        </div>
        <div className="space-y-4">
          <SampleDataNotice />
          <WhatThisDemonstrates>{demonstrates}</WhatThisDemonstrates>
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </Container>
  );
}

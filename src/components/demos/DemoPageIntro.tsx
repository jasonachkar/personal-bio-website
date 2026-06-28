import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface DemoPageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  proof: string[];
}

export function DemoPageIntro({ eyebrow, title, description, proof }: DemoPageIntroProps) {
  return (
    <section className="pt-20 pb-6 md:pt-24 md:pb-8">
      <div className="content-container">
        <Link
          href="/demos"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to demos
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
            <h1 className="mt-4 text-headline text-text-primary">{title}</h1>
            <p className="mt-5 max-w-3xl text-body-lg text-text-secondary">{description}</p>
          </div>

          <div className="liquid-glass p-5">
            <div className="relative z-10">
              <h2 className="text-sm font-semibold text-text-primary">What this proves</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-text-secondary">
                {proof.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

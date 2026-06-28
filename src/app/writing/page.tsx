import { ArrowLeft, Github } from 'lucide-react';
import Link from 'next/link';
import { getWriteups } from '@/lib/content';

export default function WritingPage() {
  const writeups = getWriteups();

  return (
    <div className="section-container">
      <div className="content-container">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to portfolio
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase text-primary">Writing</p>
          <h1 className="mt-3 text-headline text-text-primary">Security notes and writeups</h1>
          <p className="mt-4 text-body-lg text-text-secondary">
            Longer-form notes live off the main recruiter path so the homepage stays short and demo-focused.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {writeups.map((writeup) => (
            <article key={writeup.id} className="liquid-glass p-5">
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                  <span>{writeup.date}</span>
                  <span>{writeup.readingTime}</span>
                  <span>{writeup.category}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-text-primary">{writeup.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{writeup.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {writeup.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                {writeup.githubUrl ? (
                  <a
                    href={writeup.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    Read on GitHub
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

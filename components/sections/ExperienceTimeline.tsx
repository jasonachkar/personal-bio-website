import { Container } from '@/components/layout/Container';
import { education, certifications } from '@/content/profile';
import { experience } from '@/content/experience';

export function ExperienceTimeline() {
  return (
    <section className="page-section bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text-primary">
              Cloud security and engineering roles
            </h2>
            <div className="mt-8 space-y-5">
              {experience.map((item) => (
                <article key={`${item.company}-${item.dates}`} className="border-l-2 border-border pl-5">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">{item.company}</h3>
                    <p className="text-sm text-text-muted">{item.dates}</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-text-secondary">{item.role}</p>
                  <p className="mt-1 text-sm text-text-muted">{item.location}</p>
                  <p className="mt-3 max-w-prose text-sm leading-6 text-text-secondary">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Education</h3>
              <div className="mt-4 space-y-4">
                {education.map((item) => (
                  <div key={item.school} className="rounded-lg border border-border bg-background p-4">
                    <p className="font-semibold text-text-primary">{item.school}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{item.degree}</p>
                    <p className="mt-2 text-xs text-text-muted">{item.location} · {item.dates}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Certifications
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-text-secondary">
                {certifications.map((certification) => (
                  <li key={certification} className="rounded-md border border-border bg-background px-3 py-2">
                    {certification}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

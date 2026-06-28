'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import { z } from 'zod';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { profile } from '@/content/profile';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Use a valid email address.'),
  subject: z.string().min(3, 'Subject is required.'),
  message: z.string().min(10, 'Message should be at least 10 characters.'),
});

type ContactState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function Contact() {
  const [form, setForm] = useState<ContactState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const mailtoHref = useMemo(() => {
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, '', form.message].join('\n');
    return `mailto:${profile.links.email}?subject=${encodeURIComponent(`Portfolio contact: ${form.subject}`)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  function updateField(field: keyof ContactState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.');
      return;
    }

    setError(null);
    window.location.href = mailtoHref;
  }

  return (
    <section className="page-section bg-surface">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text-primary">
              Talk cloud security, CI/CD, or SecureObs
            </h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              Based in Montreal, open to remote. Languages: {profile.languages.join(', ')}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${profile.links.email}`} variant="secondary">
                <Mail aria-hidden="true" className="h-4 w-4" />
                Email
              </ButtonLink>
              <ButtonLink href={profile.links.linkedin} target="_blank" rel="noreferrer" variant="secondary">
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                LinkedIn
              </ButtonLink>
              <ButtonLink href={profile.links.github} target="_blank" rel="noreferrer" variant="secondary">
                <Github aria-hidden="true" className="h-4 w-4" />
                GitHub
              </ButtonLink>
            </div>
          </div>

          <Card className="p-5">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-text-primary">
                  Name
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-text-primary">
                  Email
                  <input
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
                    autoComplete="email"
                    inputMode="email"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-text-primary">
                Subject
                <input
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-text-primary">
                Message
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="min-h-36 rounded-md border border-border bg-background p-3 text-base text-text-primary"
                />
              </label>
              {error ? <p className="text-sm font-medium text-severity-high">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:border-accent-strong hover:bg-accent-strong"
              >
                Compose email
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
}

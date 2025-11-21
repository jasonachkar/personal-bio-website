import { FormEvent, useState } from 'react';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import { socialLinks } from '../../data/social';
import { contactCopy } from '../../data/contact';

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormState = { name: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.message) {
      setError(contactCopy.error);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError(contactCopy.error);
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setForm(initialForm);
    }, 700);
  };

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Contact"
        title={contactCopy.title}
        subtitle={contactCopy.subtitle}
      />
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h3 className="text-xl text-white">Drop a line</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm text-slate-300">
                Name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-slate-100 outline-none ring-0 transition focus:border-primary/60 focus:bg-black/60"
                placeholder="Your name"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-slate-100 outline-none transition focus:border-primary/60 focus:bg-black/60"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm text-slate-300">
                Message
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-slate-100 outline-none transition focus:border-primary/60 focus:bg-black/60"
                placeholder="Tell me about your project, security needs, or idea."
                required
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            {status === 'success' && (
              <p className="text-sm text-primary" role="status" aria-live="polite">
                {contactCopy.success}
              </p>
            )}
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-xl text-white">Links</h3>
          <p className="text-slate-300">
            Prefer async? Reach out via email or socials. Resume is available to preview or download.
          </p>
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:border-primary/60 hover:text-white"
              >
                <span>{link.label}</span>
                <span className="text-xs uppercase tracking-wide text-primary">{link.type}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
};

export default Contact;

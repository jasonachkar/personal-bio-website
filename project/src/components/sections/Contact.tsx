import { FormEvent, useState } from 'react';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import type { Contact, SocialLink } from '@/lib/schemas';

interface ContactProps {
  content: Contact;
  socialLinks: SocialLink[];
}

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormState = { name: '', email: '', message: '' };

const Contact = ({ content, socialLinks }: ContactProps) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus('idle');

    if (!form.name || !form.email || !form.message) {
      setError(content.error);
      setStatus('error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError(content.error);
      setStatus('error');
      return;
    }

    setStatus('loading');

    // If FORMSPREE_ENDPOINT is configured, use it
    const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (formspreeEndpoint) {
      try {
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
          }),
        });

        if (response.ok) {
          setStatus('success');
          setForm(initialForm);
        } else {
          setError('Failed to send message. Please try again.');
          setStatus('error');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setStatus('error');
      }
    } else {
      // Fallback: open mailto link
      const subject = encodeURIComponent('Contact from Portfolio Website');
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
      );
      const mailtoLink = `mailto:jason.achkar@example.com?subject=${subject}&body=${body}`;

      window.location.href = mailtoLink;

      // Show success message after a delay
      setTimeout(() => {
        setStatus('success');
        setForm(initialForm);
      }, 500);
    }
  };

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Contact"
        title={content.title}
        subtitle={content.subtitle}
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
                {content.success}
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

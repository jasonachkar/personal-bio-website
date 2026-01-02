'use client';

import { memo, useMemo, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import type { Contact, SocialLink } from '@/lib/schemas';
import { scrollVariants, viewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const cardVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.scaleFade, [prefersReducedMotion]);

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
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]"
      >
        <Card className="space-y-4">
          <h3 className="text-xl text-text-primary">Drop a line</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm text-text-secondary">
                Name
              </label>
              <motion.input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border border-border bg-background-elevated px-3 py-2 text-text-primary outline-none ring-0 transition focus:border-primary/60 focus:bg-background-elevated"
                placeholder="Your name"
                required
                whileFocus={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-text-secondary">
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl border border-border bg-background-elevated px-3 py-2 text-text-primary outline-none transition focus:border-primary/60 focus:bg-background-elevated"
                placeholder="you@example.com"
                required
                whileFocus={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm text-text-secondary">
                Message
              </label>
              <motion.textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                className="min-h-[120px] rounded-xl border border-border bg-background-elevated px-3 py-2 text-text-primary outline-none transition focus:border-primary/60 focus:bg-background-elevated"
                placeholder="Tell me about your project, security needs, or idea."
                required
                whileFocus={prefersReducedMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
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
          <h3 className="text-xl text-text-primary">Links</h3>
          <p className="text-text-secondary">
            Prefer async? Reach out via email or socials. Resume is available to preview or download.
          </p>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-background-elevated px-4 py-3 text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={viewportSettings}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
              >
                <span>{link.label}</span>
                <span className="text-xs uppercase tracking-wide text-primary">{link.type}</span>
              </motion.a>
            ))}
          </div>
        </Card>
      </motion.div>
    </Section>
  );
};

export default memo(Contact);

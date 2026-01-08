'use client';

import { memo, useMemo, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import type { Contact, SocialLink } from '@/lib/schemas';
import { scrollVariants, getViewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { previewResume, downloadResume } from '@/lib/resume';

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
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
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

    // Check if EmailJS is configured
    const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      try {
        // Generate timestamp for email template
        const currentTime = new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        });

        const response = await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            name: form.name, // Template uses {{name}}
            email: form.email, // Template uses {{email}} for From Email and Reply-To
            message: form.message, // Template uses {{message}}
            title: 'Portfolio Contact Form', // Template uses {{title}} in subject
            time: currentTime, // Template uses {{time}}
            // Legacy support (in case template uses these)
            from_name: form.name,
            from_email: form.email,
            reply_to: form.email, // Sets Reply-To header so replies go to sender
          },
          emailjsPublicKey
        );

        // Check if response indicates success
        if (response.status === 200 || response.text === 'OK') {
          setStatus('success');
          setForm(initialForm);
        } else {
          throw new Error(`Unexpected response: ${response.status} - ${response.text}`);
        }
      } catch (err) {
        // Extract meaningful error message
        let errorMessage = 'Failed to send message. Please try again.';
        
        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        } else if (typeof err === 'object' && err !== null) {
          // EmailJS errors might have text, status, or other properties
          const errorObj = err as Record<string, unknown>;
          if (errorObj.text) {
            errorMessage = `Error: ${String(errorObj.text)}`;
          } else if (errorObj.status) {
            errorMessage = `Error ${errorObj.status}: Failed to send message`;
          } else {
            // Log full error for debugging
            console.error('EmailJS error details:', JSON.stringify(err, null, 2));
            errorMessage = 'Failed to send message. Please check your EmailJS configuration.';
          }
        }
        
        console.error('EmailJS error:', err);
        setError(errorMessage);
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
        animate="visible"
        whileInView="visible"
        viewport={viewport}
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
            {socialLinks.map((link, index) => {
              // Handle resume preview and download with custom functions
              if (link.type === 'resume-preview') {
                return (
                  <motion.button
                    key={link.type}
                    onClick={(e) => {
                      e.preventDefault();
                      previewResume();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-background-elevated px-4 py-3 text-left text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs uppercase tracking-wide text-primary">{link.type}</span>
                  </motion.button>
                );
              }

              if (link.type === 'resume-download') {
                return (
                  <motion.button
                    key={link.type}
                    onClick={async (e) => {
                      e.preventDefault();
                      await downloadResume();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-background-elevated px-4 py-3 text-left text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs uppercase tracking-wide text-primary">{link.type}</span>
                  </motion.button>
                );
              }

              // Regular links (email, LinkedIn, GitHub)
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-background-elevated px-4 py-3 text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
                >
                  <span>{link.label}</span>
                  <span className="text-xs uppercase tracking-wide text-primary">{link.type}</span>
                </motion.a>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </Section>
  );
};

export default memo(Contact);

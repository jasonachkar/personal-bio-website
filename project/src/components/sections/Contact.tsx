'use client';

import { memo, useMemo, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import type { Contact as ContactContent, SocialLink } from '@/lib/schemas';
import {
  scrollVariants,
  getViewportSettings,
  staggerContainer,
  easings,
} from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { previewResume, downloadResume } from '@/lib/resume';
import { cn } from '@/lib/cn';
import {
  Mail,
  Send,
  Sparkles,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// ============================================
// Contact Section Component
// ============================================

/**
 * Contact section props interface
 * @interface ContactProps
 * @description Props for the Contact section component
 */
interface ContactProps {
  /** Contact content data */
  content: ContactContent;
  /** Array of social links */
  socialLinks: SocialLink[];
}

/**
 * Form state interface
 * @interface FormState
 */
interface FormState {
  name: string;
  email: string;
  message: string;
}

const initialForm: FormState = { name: '', email: '', message: '' };

/**
 * Contact Section Component
 * @description Displays contact form and social links
 */
const Contact = ({ content, socialLinks }: ContactProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Memoized variants
  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const cardVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.scaleFade),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );

  // Form submission handler
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
        const currentTime = new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        });

        const response = await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            name: form.name,
            email: form.email,
            message: form.message,
            title: 'Portfolio Contact Form',
            time: currentTime,
            from_name: form.name,
            from_email: form.email,
            reply_to: form.email,
          },
          emailjsPublicKey
        );

        if (response.status === 200 || response.text === 'OK') {
          setStatus('success');
          setForm(initialForm);
        } else {
          throw new Error(`Unexpected response: ${response.status} - ${response.text}`);
        }
      } catch (err) {
        let errorMessage = 'Failed to send message. Please try again.';

        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        } else if (typeof err === 'object' && err !== null) {
          const errorObj = err as Record<string, unknown>;
          if (errorObj.text) {
            errorMessage = `Error: ${String(errorObj.text)}`;
          } else if (errorObj.status) {
            errorMessage = `Error ${errorObj.status}: Failed to send message`;
          } else {
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

      setTimeout(() => {
        setStatus('success');
        setForm(initialForm);
      }, 500);
    }
  };

  // Input field classes
  const inputClasses = cn(
    'w-full rounded-xl border border-border bg-background-elevated',
    'px-4 py-3 text-text-primary text-sm sm:text-base',
    'outline-none transition-all duration-200',
    'placeholder:text-text-muted',
    'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
    'hover:border-border-accent/30'
  );

  return (
    <section id="contact" className="section-container relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12 md:mb-14"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Get In Touch
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">{content.title}</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-5 sm:gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8"
        >
          {/* Contact Form Card */}
          <motion.div variants={cardVariants}>
            <Card
              variant="default"
              hoverEffect="none"
              padding="lg"
              interactive={false}
              className="h-full"
            >
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <Send className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary sm:text-xl">
                  Drop a line
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Name
                  </label>
                  <motion.input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={inputClasses}
                    placeholder="Your name"
                    required
                    whileFocus={prefersReducedMotion ? {} : { scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Email
                  </label>
                  <motion.input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className={inputClasses}
                    placeholder="you@example.com"
                    required
                    whileFocus={prefersReducedMotion ? {} : { scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                  />
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-text-secondary"
                  >
                    Message
                  </label>
                  <motion.textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    className={cn(inputClasses, 'min-h-[130px] sm:min-h-[150px] resize-none')}
                    placeholder="Tell me about your project, security needs, or idea."
                    required
                    whileFocus={prefersReducedMotion ? {} : { scale: 1.01 }}
                    transition={{ duration: 0.15 }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-severity-high"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Success Message */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-severity-low"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{content.success}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Social Links Card */}
          <motion.div variants={cardVariants}>
            <Card
              variant="default"
              hoverEffect="none"
              padding="lg"
              interactive={false}
              className="h-full"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Sparkles className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold text-text-primary sm:text-xl">
                  Links
                </h3>
              </div>

              <p className="mb-5 sm:mb-6 text-sm text-text-secondary sm:text-base">
                Prefer async? Reach out via email or socials. Resume is available to preview or download.
              </p>

              <div className="space-y-2.5 sm:space-y-3">
                {socialLinks.map((link, index) => {
                  // Handle resume preview
                  if (link.type === 'resume-preview') {
                    return (
                      <SocialLinkButton
                        key={link.type}
                        label={link.label}
                        type={link.type}
                        index={index}
                        onClick={(e) => {
                          e.preventDefault();
                          previewResume();
                        }}
                        prefersReducedMotion={prefersReducedMotion}
                        viewport={viewport}
                      />
                    );
                  }

                  // Handle resume download
                  if (link.type === 'resume-download') {
                    return (
                      <SocialLinkButton
                        key={link.type}
                        label={link.label}
                        type={link.type}
                        index={index}
                        onClick={async (e) => {
                          e.preventDefault();
                          await downloadResume();
                        }}
                        prefersReducedMotion={prefersReducedMotion}
                        viewport={viewport}
                      />
                    );
                  }

                  // Regular links (email, LinkedIn, GitHub)
                  return (
                    <SocialLinkAnchor
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      type={link.type}
                      index={index}
                      prefersReducedMotion={prefersReducedMotion}
                      viewport={viewport}
                    />
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// Social Link Sub-components
// ============================================

/**
 * Social link button component (for actions like download/preview)
 */
function SocialLinkButton({
  label,
  type,
  index,
  onClick,
  prefersReducedMotion,
  viewport,
}: {
  label: string;
  type: string;
  index: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  prefersReducedMotion: boolean;
  viewport: ReturnType<typeof getViewportSettings>;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between',
        'rounded-xl border border-border bg-background-elevated',
        'px-4 py-3 sm:px-5 sm:py-3.5',
        'text-left text-sm text-text-secondary sm:text-base',
        'transition-all duration-200',
        'hover:border-primary/40 hover:text-text-primary hover:bg-background-card'
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -15 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration: 0.3, delay: index * 0.08, ease: easings.easeOutQuint }}
      whileHover={prefersReducedMotion ? {} : { x: 4 }}
    >
      <span>{label}</span>
      <span className={cn(
        'text-[10px] font-semibold uppercase tracking-wider text-primary',
        'sm:text-xs'
      )}>
        {type.replace('-', ' ')}
      </span>
    </motion.button>
  );
}

/**
 * Social link anchor component (for external links)
 */
function SocialLinkAnchor({
  href,
  label,
  type,
  index,
  prefersReducedMotion,
  viewport,
}: {
  href: string;
  label: string;
  type: string;
  index: number;
  prefersReducedMotion: boolean;
  viewport: ReturnType<typeof getViewportSettings>;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      className={cn(
        'flex items-center justify-between',
        'rounded-xl border border-border bg-background-elevated',
        'px-4 py-3 sm:px-5 sm:py-3.5',
        'text-sm text-text-secondary sm:text-base',
        'transition-all duration-200',
        'hover:border-primary/40 hover:text-text-primary hover:bg-background-card'
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -15 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration: 0.3, delay: index * 0.08, ease: easings.easeOutQuint }}
      whileHover={prefersReducedMotion ? {} : { x: 4 }}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-[10px] font-semibold uppercase tracking-wider text-primary',
          'sm:text-xs'
        )}>
          {type}
        </span>
        {!href.startsWith('mailto:') && (
          <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
        )}
      </div>
    </motion.a>
  );
}

export default memo(Contact);

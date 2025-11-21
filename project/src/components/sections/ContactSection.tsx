'use client';

import { useState, FormEvent } from 'react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Send, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ContactFormData } from '@/types';

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Contact Form Submission:', formData);

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <SectionContainer id="contact" background="default">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">Get In Touch</h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
            <p className="mt-4 text-lg text-text-secondary">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-lg border border-primary bg-primary/10 p-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h3 className="mb-2 text-2xl font-bold text-text-primary">Message Sent!</h3>
              <p className="text-text-secondary">Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-sm text-severity-high">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-severity-high">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your message..."
                />
                {errors.message && <p className="mt-1 text-sm text-severity-high">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-text-muted">
                <Mail className="inline h-4 w-4" /> Or email me directly at{' '}
                <a href="mailto:your.email@example.com" className="text-primary hover:underline">
                  your.email@example.com
                </a>
              </p>
            </form>
          )}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}

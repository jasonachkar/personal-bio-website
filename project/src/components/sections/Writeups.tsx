'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ExternalLink, Globe, Lock, RotateCw } from 'lucide-react';
import Card from '../ui/Card';
import { scrollVariants, staggerContainer, getViewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

const DOCS_URL = 'https://docs.jasonachkardiab.com';

/** How long to wait for the iframe before assuming the docs site can't be embedded. */
const IFRAME_TIMEOUT_MS = 10_000;

const featuredTopics = [
  { title: 'Detection Engineering with Microsoft Sentinel', tag: 'SIEM', readTime: '14 min' },
  { title: 'OWASP API Security Top 10: Practical Mitigations', tag: 'AppSec', readTime: '18 min' },
  { title: 'Building a Secure Azure Landing Zone', tag: 'Cloud Security', readTime: '12 min' },
  { title: 'Implementing Security Gates in CI/CD Pipelines', tag: 'DevSecOps', readTime: '11 min' },
];

type FrameState = 'loading' | 'loaded' | 'error';

const Writeups = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const [frameState, setFrameState] = useState<FrameState>('loading');
  const [shouldLoadFrame, setShouldLoadFrame] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );
  const containerVariants = useMemo(
    () => (prefersReducedMotion ? {} : staggerContainer),
    [prefersReducedMotion]
  );
  const itemVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.cardReveal),
    [prefersReducedMotion]
  );

  // Mount the iframe shortly before the preview scrolls into view.
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadFrame(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadFrame(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  // Start the fallback timer only after the iframe has actually been mounted.
  useEffect(() => {
    if (!shouldLoadFrame || frameState !== 'loading') return;

    const timer = setTimeout(() => {
      setFrameState('error');
    }, IFRAME_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [frameState, shouldLoadFrame]);

  return (
    <section id="writeups" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Technical Writing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            In-depth guides on cloud security, detection engineering, and AppSec — published at{' '}
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary-hover"
            >
              docs.jasonachkardiab.com
            </a>
          </p>
        </motion.div>

        {/* Browser-frame docs preview */}
        {frameState !== 'error' && (
          <motion.div
            ref={previewRef}
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mb-12 overflow-hidden rounded-2xl border border-border bg-background-card shadow-card-elevated"
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-3 border-b border-border bg-background-elevated px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div
                className={cn(
                  'flex flex-1 items-center gap-2',
                  'rounded-lg border border-border bg-background px-3 py-1.5',
                  'font-mono text-xs text-text-secondary'
                )}
              >
                <Lock className="h-3 w-3 flex-shrink-0 text-severity-low" aria-hidden="true" />
                docs.jasonachkardiab.com
              </div>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open docs.jasonachkardiab.com in a new tab"
                className="text-text-muted transition-colors hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Iframe with loading skeleton */}
            <div className="relative h-[480px]">
              {frameState === 'loading' && (
                <div
                  className="absolute inset-0 z-10 flex flex-col gap-4 bg-background-card p-6"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 text-text-muted">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading docs.jasonachkardiab.com…</span>
                  </div>
                  <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-elevated" />
                  <div className="h-4 w-full animate-pulse rounded bg-background-elevated" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-background-elevated" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-background-elevated" />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="h-28 animate-pulse rounded-xl bg-background-elevated" />
                    <div className="h-28 animate-pulse rounded-xl bg-background-elevated" />
                  </div>
                </div>
              )}
              {shouldLoadFrame && (
                <iframe
                  src={DOCS_URL}
                  title="Technical writing at docs.jasonachkardiab.com"
                  className="h-full w-full border-0 bg-white"
                  loading="eager"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  referrerPolicy="no-referrer"
                  onLoad={() => setFrameState('loaded')}
                  onError={() => setFrameState('error')}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Error fallback note */}
        {frameState === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 flex items-center justify-center gap-2 rounded-2xl border border-border bg-background-card px-6 py-8 text-sm text-text-secondary"
          >
            <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
            Live preview unavailable — browse the featured guides below or open the docs site
            directly.
          </motion.div>
        )}

        {/* Featured article topics (2x2 grid) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-5 sm:grid-cols-2"
        >
          {featuredTopics.map((topic) => (
            <motion.div key={topic.title} variants={itemVariants}>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card
                  variant="default"
                  hoverEffect="lift"
                  padding="md"
                  className="group h-full border border-border hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                      {topic.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary transition-colors group-hover:text-primary">
                    {topic.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {topic.readTime} read
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 text-center"
        >
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2',
              'rounded-xl bg-primary px-6 py-3',
              'text-sm font-semibold text-background',
              'shadow-button transition-all duration-200',
              'hover:bg-primary-hover hover:shadow-button-hover'
            )}
          >
            Read all articles →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Writeups);

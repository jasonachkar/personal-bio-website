'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Radar, RefreshCw } from 'lucide-react';
import { scrollVariants, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

const CIRCL_API = 'https://cve.circl.lu/api/last/10';

type CveEntry = {
  id: string;
  description: string;
  score: number | null;
  published: string | null;
};

type FetchState = 'loading' | 'ready' | 'error';

/** Defensively parse CIRCL items (legacy format and CVE JSON 5.x records). */
function parseCveItem(item: unknown): CveEntry | null {
  if (typeof item !== 'object' || item === null) return null;
  const record = item as Record<string, any>;

  const id: string | undefined =
    record.cveMetadata?.cveId ?? (typeof record.id === 'string' ? record.id : undefined);
  if (!id || !/^CVE-\d{4}-\d+$/i.test(id)) return null;

  let description: string | undefined =
    typeof record.summary === 'string' ? record.summary : undefined;
  if (!description) {
    const descriptions = record.containers?.cna?.descriptions;
    if (Array.isArray(descriptions)) {
      const english = descriptions.find(
        (d: any) => typeof d?.value === 'string' && (!d.lang || String(d.lang).startsWith('en'))
      );
      description = english?.value;
    }
  }
  if (!description) return null;

  let score: number | null = typeof record.cvss === 'number' ? record.cvss : null;
  if (score === null) {
    const metrics = record.containers?.cna?.metrics;
    if (Array.isArray(metrics)) {
      for (const metric of metrics) {
        const base =
          metric?.cvssV4_0?.baseScore ?? metric?.cvssV3_1?.baseScore ?? metric?.cvssV3_0?.baseScore;
        if (typeof base === 'number') {
          score = base;
          break;
        }
      }
    }
  }

  const published: string | null =
    record.cveMetadata?.datePublished ??
    (typeof record.Published === 'string' ? record.Published : null) ??
    (typeof record.published === 'string' ? record.published : null);

  return {
    id: id.toUpperCase(),
    description: description.replace(/\s+/g, ' ').trim(),
    score,
    published,
  };
}

function truncate(text: string, max = 120): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function formatDate(value: string | null): string {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function scoreClasses(score: number | null): string {
  if (score === null) return 'border-border text-text-muted';
  if (score >= 7) return 'border-severity-high/40 bg-severity-high/10 text-severity-high';
  if (score >= 4) return 'border-severity-medium/40 bg-severity-medium/10 text-severity-medium';
  return 'border-severity-low/40 bg-severity-low/10 text-severity-low';
}

const ThreatIntel = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  const [state, setState] = useState<FetchState>('loading');
  const [cves, setCves] = useState<CveEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  const loadCves = useCallback(async () => {
    setState('loading');
    try {
      const response = await fetch(CIRCL_API, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error(`CIRCL responded ${response.status}`);
      const data = await response.json();
      const items: unknown[] = Array.isArray(data) ? data : [];
      const parsed = items
        .map(parseCveItem)
        .filter((entry): entry is CveEntry => entry !== null)
        .slice(0, 10);
      if (parsed.length === 0) throw new Error('No parseable CVE entries');
      setCves(parsed);
      setLastUpdated(new Date());
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadCves();
  }, [loadCves]);

  return (
    <section id="threat-intel" className="section-container relative">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Radar className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Open Threat Intel
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">Recent CVE Intelligence</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Live feed of recent Common Vulnerabilities and Exposures — I track this because
            attackers do.
          </p>
        </motion.div>

        {/* Feed */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="overflow-hidden rounded-2xl border border-border bg-background-card"
        >
          {/* Feed header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background-elevated px-4 py-3 sm:px-5">
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              cve-feed --last 10
            </span>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              {lastUpdated && (
                <span>
                  Last updated:{' '}
                  {lastUpdated.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              )}
              <button
                type="button"
                onClick={loadCves}
                disabled={state === 'loading'}
                aria-label="Refresh CVE feed"
                className="rounded-lg border border-border p-1.5 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className={cn('h-3.5 w-3.5', state === 'loading' && 'animate-spin')} />
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {state === 'loading' && (
            <div className="space-y-3 p-4 sm:p-5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-border/50 p-4"
                >
                  <div className="h-5 w-32 flex-shrink-0 animate-pulse rounded bg-background-elevated" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-background-elevated" />
                  <div className="h-6 w-12 flex-shrink-0 animate-pulse rounded-full bg-background-elevated" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <AlertTriangle className="h-8 w-8 text-severity-medium" aria-hidden="true" />
              <p className="text-sm text-text-secondary">
                Could not reach the CIRCL CVE API. The feed may be temporarily unavailable —
                try refreshing in a moment.
              </p>
              <button
                type="button"
                onClick={loadCves}
                className="mt-1 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
              >
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          )}

          {/* CVE list */}
          {state === 'ready' && (
            <ul className="divide-y divide-border/60">
              {cves.map((cve) => (
                <li
                  key={cve.id}
                  className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-background-elevated/40 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                >
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-44 flex-shrink-0 items-center gap-1.5 font-mono text-sm font-semibold text-primary hover:text-primary-hover"
                  >
                    {cve.id}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                  <p className="flex-1 text-sm text-text-secondary">
                    {truncate(cve.description)}
                  </p>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold',
                        scoreClasses(cve.score)
                      )}
                      title="CVSS base score"
                    >
                      {cve.score !== null ? cve.score.toFixed(1) : 'N/A'}
                    </span>
                    <span className="w-24 text-right text-xs text-text-muted">
                      {formatDate(cve.published)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Attribution */}
        <p className="mt-4 text-center text-xs text-text-muted">
          Powered by{' '}
          <a
            href="https://cve.circl.lu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover"
          >
            CIRCL CVE
          </a>{' '}
          · Scores are CVSS base scores · Links open the NVD entry
        </p>
      </div>
    </section>
  );
};

export default memo(ThreatIntel);

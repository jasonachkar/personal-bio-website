'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import SeverityPill from '../ui/SeverityPill';
import type { AlertSeverity } from '../../data/types';
import { scrollVariants, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

type SiemEvent = {
  id: string;
  timestamp: string;
  eventType: string;
  severity: AlertSeverity;
  source: { type: string; name: string };
  actor: { username?: string; hostname?: string; ipAddress?: string };
  details: { action: string; result: string };
};

type PreviewData = {
  total: number;
  bySeverity: Record<AlertSeverity, number>;
  activeRules: number;
  recent: Array<SiemEvent & { displayTime: string }>;
};

type FetchState = 'loading' | 'ready' | 'error';

function relativeTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Builds the preview: severity distribution plus the most recent events.
 * The demo dataset has fixed timestamps, so we shift them relative to "now"
 * to keep the live console feeling live between content updates.
 */
function buildPreview(events: SiemEvent[], activeRules: number): PreviewData {
  const bySeverity: Record<AlertSeverity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const event of events) {
    if (event.severity in bySeverity) bySeverity[event.severity] += 1;
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const now = new Date();
  const newest = sorted.length > 0 ? new Date(sorted[0].timestamp).getTime() : now.getTime();
  const offset = now.getTime() - newest - 4 * 60_000; // newest event reads "4m ago"

  const recent = sorted.slice(0, 6).map((event) => ({
    ...event,
    displayTime: relativeTime(new Date(new Date(event.timestamp).getTime() + offset), now),
  }));

  return { total: events.length, bySeverity, activeRules, recent };
}

const SocLive = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  const [state, setState] = useState<FetchState>('loading');
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [eventsRes, rulesRes] = await Promise.all([
          fetch('/api/siem/events'),
          fetch('/api/siem/rules'),
        ]);
        if (!eventsRes.ok) throw new Error(`events API ${eventsRes.status}`);
        const eventsJson = await eventsRes.json();
        const events: SiemEvent[] = eventsJson?.data?.events ?? eventsJson?.events ?? [];
        let activeRules = 0;
        if (rulesRes.ok) {
          const rulesJson = await rulesRes.json();
          const rules: Array<{ enabled?: boolean }> =
            rulesJson?.data?.rules ?? rulesJson?.rules ?? [];
          activeRules = rules.filter((rule) => rule.enabled !== false).length;
        }
        if (!cancelled) {
          setPreview(buildPreview(events, activeRules));
          setState('ready');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="siem" className="section-container relative">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-8 text-center sm:mb-10"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-severity-low/30 bg-severity-low/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-severity-low opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-severity-low" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-severity-low">
              SOC Live
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">SIEM Detection Console</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            A quick look at the event stream and detections — the full console with the query
            builder, timeline, and MITRE-mapped detection rules lives on its own page.
          </p>
        </motion.div>

        {/* Compact preview */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-background-card"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-severity-low" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                soc preview — most recent events
              </span>
            </div>
          </div>

          {state === 'loading' && (
            <div className="space-y-3 p-4 sm:p-5" aria-hidden="true">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-xl bg-background-elevated" />
                ))}
              </div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 animate-pulse rounded-lg bg-background-elevated" />
              ))}
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <AlertTriangle className="h-8 w-8 text-severity-medium" aria-hidden="true" />
              <p className="text-sm text-text-secondary">
                Couldn&apos;t load the event preview — open the full console instead.
              </p>
            </div>
          )}

          {state === 'ready' && preview && (
            <>
              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
                <div className="rounded-xl border border-border bg-background-elevated/50 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    <Activity className="h-3.5 w-3.5" aria-hidden="true" /> Total events
                  </div>
                  <div className="mt-1 text-2xl font-black text-text-primary">{preview.total}</div>
                </div>
                <div className="rounded-xl border border-severity-critical/30 bg-severity-critical/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    <ShieldAlert className="h-3.5 w-3.5 text-severity-critical" aria-hidden="true" />{' '}
                    Critical
                  </div>
                  <div className="mt-1 text-2xl font-black text-severity-critical">
                    {preview.bySeverity.critical}
                  </div>
                </div>
                <div className="rounded-xl border border-severity-high/30 bg-severity-high/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    <AlertTriangle className="h-3.5 w-3.5 text-severity-high" aria-hidden="true" />{' '}
                    High
                  </div>
                  <div className="mt-1 text-2xl font-black text-severity-high">
                    {preview.bySeverity.high}
                  </div>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Active rules
                  </div>
                  <div className="mt-1 text-2xl font-black text-primary">{preview.activeRules}</div>
                </div>
              </div>

              {/* Recent events */}
              <ul className="divide-y divide-border/60 border-t border-border">
                {preview.recent.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm sm:px-5"
                  >
                    <span className="w-16 flex-shrink-0 font-mono text-xs text-text-muted">
                      {event.displayTime}
                    </span>
                    <SeverityPill
                      severity={event.severity}
                      className="flex-shrink-0 !px-2 !py-0.5 text-[10px]"
                    />
                    <span className="hidden w-40 flex-shrink-0 truncate text-text-primary sm:inline">
                      {event.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="flex-1 truncate text-text-secondary">
                      {event.actor.username ?? event.actor.hostname ?? event.source.name} ·{' '}
                      {event.details.action.replace(/_/g, ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* CTA */}
          <div className="border-t border-border bg-background-elevated/40 p-4 text-center sm:p-5">
            <a
              href="/siem"
              className={cn(
                'inline-flex items-center gap-2',
                'rounded-xl bg-primary px-6 py-3',
                'text-sm font-semibold text-background',
                'shadow-button transition-all duration-200',
                'hover:bg-primary-hover hover:shadow-button-hover'
              )}
            >
              Open the full SOC console
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-2.5 text-xs text-text-muted">
              Query builder · timeline analysis · MITRE-mapped detection rules · event export
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SocLive);

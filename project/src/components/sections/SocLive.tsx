'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Radio,
  ShieldAlert,
  Terminal,
  Zap,
} from 'lucide-react';
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
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/15 bg-background-card/95 shadow-card-elevated backdrop-blur-sm"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Console header */}
          <div className="flex items-center justify-between gap-4 border-b border-border bg-gradient-to-r from-primary/[0.07] via-transparent to-accent/[0.05] px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-severity-low/25 bg-severity-low/10 text-severity-low">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold uppercase tracking-[0.16em] text-text-primary">
                  SOC Detection Stream
                </p>
                <p className="mt-0.5 text-xs text-text-muted">Latest correlated security events</p>
              </div>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-severity-low/25 bg-severity-low/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-severity-low opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-severity-low" />
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-widest text-severity-low sm:inline">
                Monitoring
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-severity-low sm:hidden">
                Live
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
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-6">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background-elevated/40 p-3.5 transition-colors hover:border-text-muted/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background-card text-text-secondary">
                    <Activity className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Events</p>
                    <p className="mt-0.5 text-2xl font-black tabular-nums text-text-primary">{preview.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-severity-critical/25 bg-severity-critical/5 p-3.5 transition-colors hover:border-severity-critical/45">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-severity-critical/25 bg-severity-critical/10 text-severity-critical">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Critical</p>
                    <p className="mt-0.5 text-2xl font-black tabular-nums text-severity-critical">
                      {preview.bySeverity.critical}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-severity-high/25 bg-severity-high/5 p-3.5 transition-colors hover:border-severity-high/45">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-severity-high/25 bg-severity-high/10 text-severity-high">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">High</p>
                    <p className="mt-0.5 text-2xl font-black tabular-nums text-severity-high">
                      {preview.bySeverity.high}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-3.5 transition-colors hover:border-primary/45">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Rules</p>
                    <p className="mt-0.5 text-2xl font-black tabular-nums text-primary">{preview.activeRules}</p>
                  </div>
                </div>
              </div>

              {/* Recent events */}
              <div className="flex items-center justify-between border-y border-border bg-background-elevated/30 px-4 py-2.5 sm:px-6">
                <div className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                    Recent detections
                  </span>
                </div>
                <span className="font-mono text-[10px] text-text-muted">Newest first</span>
              </div>

              <ul className="divide-y divide-border/60">
                {preview.recent.map((event) => (
                  <li
                    key={event.id}
                    className={cn(
                      'group/event grid grid-cols-[58px_minmax(0,1fr)_16px] items-center gap-3 border-l-2 px-4 py-3 transition-colors sm:grid-cols-[68px_88px_170px_minmax(0,1fr)_16px] sm:px-6',
                      'hover:bg-background-elevated/45',
                      event.severity === 'critical' && 'border-l-severity-critical/70',
                      event.severity === 'high' && 'border-l-severity-high/70',
                      event.severity === 'medium' && 'border-l-severity-medium/70',
                      event.severity === 'low' && 'border-l-severity-low/70'
                    )}
                  >
                    <span className="font-mono text-[11px] tabular-nums text-text-muted">
                      {event.displayTime}
                    </span>
                    <SeverityPill
                      severity={event.severity}
                      className="hidden w-fit flex-shrink-0 !px-2 !py-0.5 text-[10px] sm:inline-flex"
                    />
                    <span className="hidden truncate text-sm font-medium capitalize text-text-primary sm:block">
                      {event.eventType.replace(/_/g, ' ')}
                    </span>
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2 sm:hidden">
                        <SeverityPill
                          severity={event.severity}
                          className="!px-1.5 !py-0.5 text-[9px]"
                        />
                        <span className="truncate text-xs font-medium capitalize text-text-primary">
                          {event.eventType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="truncate text-xs text-text-secondary sm:text-sm">
                        <span className="text-text-primary">
                          {event.actor.username ?? event.actor.hostname ?? event.source.name}
                        </span>{' '}
                        <span className="text-text-muted" aria-hidden="true">/</span>{' '}
                        {event.details.action.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-muted transition-transform group-hover/event:translate-x-0.5 group-hover/event:text-primary" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* CTA */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-background-elevated/35 p-4 sm:flex-row sm:px-6 sm:py-5">
            <div className="flex items-center gap-3 text-left">
              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background-card text-primary sm:flex">
                <Terminal className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Investigate the complete dataset</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Query builder · timeline · MITRE rules · export
                </p>
              </div>
            </div>
            <a
              href="/siem"
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 sm:w-auto',
                'rounded-xl bg-primary px-5 py-2.5',
                'text-sm font-semibold text-background',
                'shadow-button transition-all duration-200',
                'hover:bg-primary-hover hover:shadow-button-hover'
              )}
            >
              Open the full SOC console
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SocLive);

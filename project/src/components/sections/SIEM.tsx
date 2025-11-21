import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { baseLogs, intelNotes, siemAlerts } from '../../data/siem';
import type { AlertCategory, AlertSeverity, SiemLog } from '../../data/types';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SeverityPill from '../ui/SeverityPill';
import { Button } from '../ui/Button';
import { severityColors } from '../../utils/severity';

const categories: AlertCategory[] = ['auth', 'network', 'endpoint', 'appsec', 'iam'];
const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];

const randomLog = (): SiemLog => {
  const samples: Array<Omit<SiemLog, 'id' | 'timestamp'>> = [
    {
      severity: 'critical',
      category: 'auth',
      message: 'okta: mfa fatigue attempts detected for admin role',
      source: 'Okta',
    },
    {
      severity: 'medium',
      category: 'network',
      message: 'elastic: beacon interval scored 0.82 entropy on dns egress',
      source: 'Elastic',
    },
    {
      severity: 'high',
      category: 'appsec',
      message: 'waf: serialized payload blocked targeting /api/export',
      source: 'Cloudflare',
    },
    {
      severity: 'low',
      category: 'endpoint',
      message: 'edr: powershell transcript enforced on lab-host-03',
      source: 'CrowdStrike',
    },
    {
      severity: 'medium',
      category: 'iam',
      message: 'azure ad: privilege escalation attempt rejected (PIM)',
      source: 'Azure AD',
    },
  ];
  const pick = samples[Math.floor(Math.random() * samples.length)];
  return {
    id: `live-${Date.now()}`,
    ...pick,
    timestamp: new Date().toISOString(),
  };
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const SIEM = () => {
  const [logs, setLogs] = useState<SiemLog[]>(baseLogs);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | 'all'>('all');
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [randomLog(), ...prev].slice(0, 12));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [severityFilter, categoryFilter]);

  const filteredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          (severityFilter === 'all' || log.severity === severityFilter) &&
          (categoryFilter === 'all' || log.category === categoryFilter),
      ),
    [logs, severityFilter, categoryFilter],
  );

  const openAlerts = siemAlerts.filter((a) => a.status !== 'Closed');

  return (
    <Section id="siem">
      <SectionHeader
        eyebrow="SIEM Simulator"
        title="SOC-grade dashboard with live log stream."
        subtitle="Filters, alerts, and threat intel—styled like a modern security console."
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card glow className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge label={`Open alerts: ${openAlerts.length}`} />
            <Badge label={`Live logs: ${logs.length}`} />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              live stream
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 focus:border-primary/60 focus:outline-none"
            >
              <option value="all">All severities</option>
              {severities.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AlertCategory | 'all')}
              className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 focus:border-primary/60 focus:outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button variant="ghost" onClick={() => setSeverityFilter('all')}>
              Reset filters
            </Button>
          </div>

          <div
            ref={streamRef}
            className="max-h-[420px] space-y-2 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-3"
          >
            <AnimatePresence initial={false}>
              {filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                >
                  <span className={`${severityColors[log.severity]} text-[11px] uppercase`}>
                    {log.severity}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{log.source}</span>
                      <span>{formatTime(log.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-100">{log.message}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
                      {log.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Alerts</p>
                <p className="text-slate-300">Filtered by severity and category.</p>
              </div>
              <Badge label="SOC view" />
            </div>
            <div className="space-y-3">
              {openAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-inner shadow-black/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{alert.title}</p>
                      <p className="text-xs text-slate-400">
                        {alert.source} • {alert.status} • {alert.category}
                      </p>
                    </div>
                    <SeverityPill severity={alert.severity} />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Threat Intel</p>
              <Badge label="Updated daily" />
            </div>
            <div className="space-y-2">
              {intelNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{note.label}</span>
                    <SeverityPill severity={note.risk} />
                  </div>
                  <p className="text-sm text-slate-300">{note.detail}</p>
                  <a
                    href={note.reference}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline underline-offset-4"
                  >
                    Reference
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default SIEM;

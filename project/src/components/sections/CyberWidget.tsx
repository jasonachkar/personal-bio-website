import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

type LogLine = {
  id: number;
  message: string;
  severity: 'info' | 'warn' | 'high';
};

const threatTiles = [
  {
    title: 'Anomalous logins',
    metric: '12 flagged',
    change: '+4 vs 24h',
    status: 'Investigation running',
    severity: 'High',
  },
  {
    title: 'DNS tunneling',
    metric: '3 hosts',
    change: 'stable',
    status: 'Sigma rule tuned',
    severity: 'Medium',
  },
  {
    title: 'Privileged changes',
    metric: '5 events',
    change: '-2 vs 7d',
    status: 'Reviewed',
    severity: 'Low',
  },
];

const severityColor = (severity: LogLine['severity'] | string) => {
  if (severity === 'high') return 'text-danger';
  if (severity === 'warn' || severity === 'Medium') return 'text-accent';
  return 'text-primary';
};

const CyberWidget = () => {
  const baseLogs = useMemo<LogLine[]>(
    () => [
      { id: 0, message: 'elastic rule `auth_geo_mismatch` fired for svc-admin', severity: 'warn' },
      { id: 1, message: 'new sigma push: dns_tunnel_exfiltration.yml', severity: 'info' },
      { id: 2, message: 'playbook executed: isolate host + dispatch slack', severity: 'high' },
    ],
    [],
  );
  const [logs, setLogs] = useState<LogLine[]>(baseLogs);
  const counterRef = useRef(baseLogs.length);

  useEffect(() => {
    const feed = [
      { message: 'crowdstrike event correlated with azure sign-in alert', severity: 'warn' },
      { message: 'okta factor reset from new ASN, user prompt enforced', severity: 'high' },
      { message: 'sigma rule hit: kubernetes_pod_exec with token', severity: 'warn' },
      { message: 'detonation lab finished scanning uploaded attachment', severity: 'info' },
      { message: 'burp suite scan completed on staging-targets', severity: 'info' },
    ];
    const interval = setInterval(() => {
      const next = feed[Math.floor(Math.random() * feed.length)];
      setLogs((prev) => {
        counterRef.current = counterRef.current + 1;
        const id = counterRef.current;
        return [{ id, ...next }, ...prev].slice(0, 6);
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="cyber">
      <SectionHeader
        eyebrow="Threat Lab"
        title="Interactive security HUD"
        subtitle="A lightweight SIEM-inspired widget that streams telemetry, highlights detections, and shows the playbook state."
      />
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Card glow className="h-full">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Detection status</p>
              <p className="text-slate-300">Live view of hunts and playbooks.</p>
            </div>
            <Badge label="Live feed" className="bg-primary/10 text-primary" />
          </div>
          <div className="space-y-4">
            {threatTiles.map((tile) => (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{tile.title}</p>
                    <p className="text-lg text-white">{tile.metric}</p>
                  </div>
                  <span className={`text-xs uppercase ${severityColor(tile.severity)}`}>
                    {tile.severity}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{tile.status}</span>
                  <span className="text-primary">{tile.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="h-full">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Log stream</p>
              <p className="text-slate-300">Recent alerts synthesized from test data.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              2.2s refresh
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-200">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 rounded-lg border border-white/5 bg-black/40 px-3 py-2"
              >
                <span className={`${severityColor(log.severity)} text-[10px] uppercase`}>
                  {log.severity}
                </span>
                <p className="text-slate-200">{log.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
};

export default CyberWidget;

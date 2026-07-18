'use client';

import { useEffect, useState } from 'react';

type TickerSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

type TickerEntry = {
  time: string;
  severity: TickerSeverity;
  message: string;
};

const severityColors: Record<TickerSeverity, string> = {
  CRITICAL: 'text-red-400',
  HIGH: 'text-orange-400',
  MEDIUM: 'text-yellow-400',
  LOW: 'text-emerald-400',
  INFO: 'text-sky-400',
};

/** Synthetic SOC-style log lines used when live feeds are unreachable (CORS/auth). */
const syntheticMessages: Array<{ severity: TickerSeverity; message: string }> = [
  { severity: 'CRITICAL', message: 'Privilege escalation — Azure AD Global Admin assigned outside change window' },
  { severity: 'HIGH', message: 'DNS tunneling detected from lab-host-12 (Sentinel analytics rule)' },
  { severity: 'MEDIUM', message: 'Impossible travel sign-in: Montreal → Singapore in 41 minutes' },
  { severity: 'HIGH', message: 'Brute-force burst: 214 failed logins against /api/auth from single ASN' },
  { severity: 'LOW', message: 'Azure Policy drift remediated: storage account public access disabled' },
  { severity: 'MEDIUM', message: 'Terraform plan flagged: NSG rule allows 0.0.0.0/0 on port 3389' },
  { severity: 'HIGH', message: 'Defender for Cloud: crypto-mining process pattern on aks-node-04' },
  { severity: 'INFO', message: 'Build gate passed: 0 blocking findings across 7 scanners (SecureObs)' },
  { severity: 'MEDIUM', message: 'Anomalous service principal consent grant detected (Entra ID audit)' },
  { severity: 'LOW', message: 'Key Vault access policy change reviewed and approved via PIM' },
];

function formatClock(date: Date): string {
  return date.toTimeString().slice(0, 8);
}

function severityFromScore(score: number | null): TickerSeverity {
  if (score === null || Number.isNaN(score)) return 'INFO';
  if (score >= 9) return 'CRITICAL';
  if (score >= 7) return 'HIGH';
  if (score >= 4) return 'MEDIUM';
  return 'LOW';
}

type ParsedCve = { id: string; summary: string; score: number | null };

/** Defensively parse CIRCL responses (legacy list format and CVE JSON 5.x records). */
function parseCirclItem(item: unknown): ParsedCve | null {
  if (typeof item !== 'object' || item === null) return null;
  const record = item as Record<string, any>;

  const id: string | undefined =
    record.cveMetadata?.cveId ?? (typeof record.id === 'string' ? record.id : undefined);
  if (!id) return null;

  let summary: string | undefined =
    typeof record.summary === 'string' ? record.summary : undefined;
  if (!summary) {
    const descriptions = record.containers?.cna?.descriptions;
    if (Array.isArray(descriptions)) {
      const english = descriptions.find(
        (d: any) => typeof d?.value === 'string' && (!d.lang || String(d.lang).startsWith('en'))
      );
      summary = english?.value;
    }
  }
  if (!summary) return null;

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

  return { id, summary: summary.replace(/\s+/g, ' ').trim(), score };
}

function buildEntries(cves: ParsedCve[]): TickerEntry[] {
  const now = Date.now();
  const cveEntries: TickerEntry[] = cves.slice(0, 5).map((cve, index) => ({
    time: formatClock(new Date(now - index * 17_000)),
    severity: severityFromScore(cve.score),
    message: `${cve.id} — ${cve.summary.slice(0, 110)}${cve.summary.length > 110 ? '…' : ''}`,
  }));

  // Blend in synthetic SOC detections so the ticker always cycles 8-10 entries.
  const fillers = syntheticMessages
    .slice(0, Math.max(0, 9 - cveEntries.length))
    .map((entry, index) => ({
      time: formatClock(new Date(now - (cveEntries.length + index) * 17_000)),
      severity: entry.severity,
      message: entry.message,
    }));

  return [...cveEntries, ...fillers];
}

async function fetchFeed(): Promise<TickerEntry[]> {
  // Primary: AlienVault OTX (requires an API key; expected to fail anonymously).
  try {
    const response = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed?limit=5', {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = await response.json();
      const pulses: any[] = Array.isArray(data?.results) ? data.results : [];
      const entries = pulses
        .filter((pulse) => typeof pulse?.name === 'string')
        .map<ParsedCve>((pulse) => ({ id: 'OTX', summary: pulse.name, score: 7 }));
      if (entries.length > 0) return buildEntries(entries);
    }
  } catch {
    // Fall through to CIRCL.
  }

  // Fallback: CIRCL CVE API (free, no auth, CORS-enabled).
  try {
    const response = await fetch('https://cve.circl.lu/api/last/5', {
      signal: AbortSignal.timeout(6000),
    });
    if (response.ok) {
      const data = await response.json();
      const items: unknown[] = Array.isArray(data) ? data : [];
      const cves = items
        .map(parseCirclItem)
        .filter((cve): cve is ParsedCve => cve !== null);
      if (cves.length > 0) return buildEntries(cves);
    }
  } catch {
    // Fall through to synthetic feed.
  }

  return buildEntries([]);
}

/**
 * Terminal-style scrolling threat feed ticker.
 * Attempts live data (OTX → CIRCL CVE) and falls back to synthetic SOC logs.
 */
export function ThreatFeedTicker() {
  const [entries, setEntries] = useState<TickerEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchFeed().then((feed) => {
      if (!cancelled) setEntries(feed);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex h-10 items-center overflow-hidden rounded-lg border border-emerald-500/20 bg-[#0d1117] px-4 font-mono text-xs text-emerald-400/60">
        Initializing threat feed…
      </div>
    );
  }

  // The list is rendered twice so the -50% keyframe loops seamlessly.
  const loop = [...entries, ...entries];

  return (
    <div
      className="ticker-viewport flex h-10 items-stretch overflow-hidden rounded-lg border border-emerald-500/20 bg-[#0d1117]"
      role="marquee"
      aria-label="Live threat feed"
    >
      <div className="z-10 flex flex-shrink-0 items-center gap-1.5 border-r border-emerald-500/20 bg-[#0d1117] px-3 font-mono text-[10px] font-bold tracking-widest text-emerald-400 sm:text-xs">
        <span aria-hidden="true">🔴</span> LIVE THREAT FEED
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track h-full items-center">
          {loop.map((entry, index) => (
            <span
              key={index}
              className="inline-flex items-center px-6 font-mono text-[11px] text-emerald-300 sm:text-xs"
            >
              <span className="text-emerald-500/80">[{entry.time}]</span>
              <span className={`ml-2 font-bold ${severityColors[entry.severity]}`}>
                {entry.severity}:
              </span>
              <span className="ml-2">{entry.message}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreatFeedTicker;

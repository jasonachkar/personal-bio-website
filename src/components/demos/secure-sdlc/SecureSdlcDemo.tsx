'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, GitBranch, Play, ShieldAlert, XCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { pipelineRuns } from '../../../../content/demos/secure-sdlc';
import type { PipelineFinding, PipelineRun, Severity } from '../../../../content/demos/types';
import { SeverityBadge, WhatThisProves } from '../demoUtils';

const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

function groupFindings(findings: PipelineFinding[]) {
  const groups = new Map<string, PipelineFinding[]>();

  for (const finding of findings) {
    groups.set(finding.canonicalKey, [...(groups.get(finding.canonicalKey) ?? []), finding]);
  }

  return [...groups.entries()].map(([canonicalKey, items]) => ({
    canonicalKey,
    findings: items,
    representative: items.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity))[0],
    scanners: [...new Set(items.map((item) => item.scanner))],
  }));
}

function getRun(id: string): PipelineRun {
  return pipelineRuns.find((run) => run.id === id) ?? pipelineRuns[0];
}

export function SecureSdlcDemo() {
  const [runId, setRunId] = useState('vulnerable-run');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const [blockingSeverities, setBlockingSeverities] = useState<Severity[]>(['critical', 'high']);

  const run = getRun(runId);
  const storyStageIndex = Math.min(run.stages.length - 1, activeStageIndex);
  const visibleStageCount = running ? storyStageIndex + 1 : run.stages.length;
  const visibleStages = run.stages.slice(0, visibleStageCount);
  const visibleFindingIds = new Set(visibleStages.flatMap((stage) => stage.findingIds));
  const visibleFindings = run.findings.filter((finding) => visibleFindingIds.has(finding.id));
  const groups = groupFindings(visibleFindings);
  const blockingFindings = groups.filter((group) => blockingSeverities.includes(group.representative.severity));
  const gateBlocked = blockingFindings.length > 0;

  const terminalLines = visibleStages.flatMap((stage) =>
    stage.logs.map((line) => `[${stage.name.toLowerCase()}] ${line}`),
  );

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setActiveStageIndex((current) => {
        if (current >= run.stages.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [run.stages.length, running, runId]);

  function replay(nextRunId = run.id) {
    setRunId(nextRunId);
    setActiveStageIndex(0);
    setRunning(true);
  }

  function toggleSeverity(severity: Severity) {
    setBlockingSeverities((current) =>
      current.includes(severity) ? current.filter((item) => item !== severity) : [...current, severity],
    );
  }

  return (
    <section id="demo-sdlc" className="py-8 md:py-10">
      <div className="content-container">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <Card variant="glass" hoverEffect="none" interactive={false} padding="none">
            <div className="relative z-10 border-b border-white/10 p-5 md:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-secondary">Mega-demo 2 / DevSecOps</p>
                  <h3 className="mt-2 text-2xl font-semibold text-text-primary">Secure SDLC Pipeline Command Center</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{run.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pipelineRuns.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => replay(item.id)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                        item.id === run.id
                          ? 'border-secondary/50 bg-secondary/15 text-secondary'
                          : 'border-white/10 bg-white/[0.03] text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => replay()}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Run pipeline
                  </button>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-6 p-5 md:p-6">
              <div className="grid gap-3 md:grid-cols-7">
                {run.stages.map((stage, index) => {
                  const reached = index < visibleStageCount;
                  const failed = reached && stage.status === 'fail';
                  const current = index === storyStageIndex;

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        'min-h-28 rounded-3xl border p-3 transition-all duration-300',
                        current && 'scale-[1.02]',
                        reached ? 'border-white/15 bg-white/[0.04]' : 'border-white/5 bg-white/[0.02] opacity-60',
                        failed && 'border-orange-400/35 bg-orange-500/10',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-text-primary">{stage.name}</p>
                        {reached ? (
                          failed ? (
                            <XCircle className="h-4 w-4 text-orange-300" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          )
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-white/20" />
                        )}
                      </div>
                      <p className="mt-8 text-xs text-text-muted">{reached ? `${stage.findingIds.length} finding(s)` : 'queued'}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
                <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 font-mono text-xs leading-6 text-slate-300">
                  <div className="mb-3 flex items-center gap-2 text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2">secureobs-ci / sample replay</span>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {terminalLines.map((line, index) => (
                      <p key={`${line}-${index}`} className="border-b border-white/5 py-1">
                        <span className="text-primary">$</span> {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <h4 className="text-sm font-semibold text-text-primary">Blocking policy</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {severityOrder.slice(0, 4).map((severity) => (
                        <label
                          key={severity}
                          className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-text-secondary"
                        >
                          <input
                            type="checkbox"
                            checked={blockingSeverities.includes(severity)}
                            onChange={() => toggleSeverity(severity)}
                            className="h-3.5 w-3.5 accent-[var(--primary)]"
                          />
                          {severity}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'rounded-3xl border p-5',
                      gateBlocked ? 'border-red-400/40 bg-red-500/10' : 'border-emerald-400/40 bg-emerald-500/10',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {gateBlocked ? (
                        <ShieldAlert className="h-6 w-6 text-red-200" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-emerald-200" />
                      )}
                      <div>
                        <p className="text-lg font-bold text-text-primary">{gateBlocked ? 'BLOCKED (exit 3)' : 'PASS'}</p>
                        <p className="text-sm text-text-secondary">
                          {gateBlocked
                            ? `${blockingFindings.length} canonical group(s) match policy.`
                            : 'No current findings match the blocking policy.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {groups.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-text-secondary">
                    No findings are visible in the current stage window.
                  </div>
                ) : (
                  groups.map((group) => (
                    <div key={group.canonicalKey} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={group.representative.severity} />
                        <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {group.scanners.length} scanner{group.scanners.length === 1 ? '' : 's'} agree
                        </span>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-text-secondary">
                          CVSS {group.representative.cvss.toFixed(1)}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-semibold text-text-primary">{group.canonicalKey}</h4>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">{group.representative.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
                        <span>{group.representative.owasp}</span>
                        <span>{group.representative.cwe}</span>
                      </div>
                      <ul className="mt-4 grid gap-2 text-xs leading-5 text-text-secondary">
                        {group.findings.map((finding) => (
                          <li key={finding.id}>
                            <span className="font-semibold text-text-primary">{finding.scanner}</span>: {finding.rule} at{' '}
                            <span className="font-mono">{finding.location}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          <aside className="grid gap-4 xl:sticky xl:top-24">
            <WhatThisProves
              items={[
                'Secure CI/CD gates with severity policy and exit-code behavior',
                'Multi-scanner integration across SAST, secrets, SCA, container, and IaC stages',
                'Cross-tool deduplication with CVSS, OWASP, and CWE triage language',
              ]}
            />
            <div className="liquid-glass p-5">
              <div className="relative z-10">
                <h4 className="text-sm font-semibold text-text-primary">SecureObs anchor</h4>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Interactive simulation on committed sample data. No repository is scanned and no pipeline is triggered.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="https://secureobs.com" target="_blank" rel="noreferrer" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                    Live product
                  </Button>
                  <Button
                    href="https://github.com/jasonachkar/secure-obs"
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    size="sm"
                    icon={<GitBranch className="h-4 w-4" />}
                  >
                    Source
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

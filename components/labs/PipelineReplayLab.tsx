'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, ShieldAlert, SlidersHorizontal, XCircle } from 'lucide-react';
import { pipelineRuns } from '@/content/labs/pipeline-runs';
import type { Finding, PipelineRun, Severity, Stage } from '@/content/types';
import { Card } from '@/components/ui/Card';
import { SeverityPill } from '@/components/ui/SeverityPill';
import { cn } from '@/lib/cn';

const severities: Severity[] = ['critical', 'high', 'medium', 'low'];

function getRun(id: string): PipelineRun {
  return pipelineRuns.find((run) => run.id === id) ?? pipelineRuns[0];
}

function groupFindings(findings: Finding[]) {
  const groups = new Map<string, Finding[]>();

  for (const finding of findings) {
    const existing = groups.get(finding.canonicalKey) ?? [];
    groups.set(finding.canonicalKey, [...existing, finding]);
  }

  return [...groups.entries()].map(([canonicalKey, items]) => ({
    canonicalKey,
    findings: items,
    representative: items[0],
    scanners: [...new Set(items.map((item) => item.scanner))],
  }));
}

function statusIcon(stage: Stage) {
  if (stage.status === 'fail') {
    return <XCircle aria-hidden="true" className="h-4 w-4 text-severity-high" />;
  }

  if (stage.status === 'skipped') {
    return <Circle aria-hidden="true" className="h-4 w-4 text-text-muted" />;
  }

  return <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-severity-low" />;
}

export function PipelineReplayLab() {
  const [runId, setRunId] = useState(pipelineRuns[0].id);
  const [selectedStageId, setSelectedStageId] = useState('build');
  const [deduped, setDeduped] = useState(true);
  const [blockingSeverities, setBlockingSeverities] = useState<Severity[]>(['critical', 'high']);

  const run = getRun(runId);
  const selectedStage = run.stages.find((stage) => stage.id === selectedStageId) ?? run.stages[0];
  const stageFindings = selectedStage.findingIds
    .map((id) => run.findings.find((finding) => finding.id === id))
    .filter((finding): finding is Finding => Boolean(finding));
  const groupedStageFindings = groupFindings(stageFindings);
  const blockingFindings = run.findings.filter((finding) => blockingSeverities.includes(finding.severity));
  const gateBlocked = blockingFindings.length > 0;

  function toggleSeverity(severity: Severity) {
    setBlockingSeverities((current) =>
      current.includes(severity)
        ? current.filter((item) => item !== severity)
        : [...current, severity],
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            Replay
            <select
              value={run.id}
              onChange={(event) => {
                const nextRun = getRun(event.target.value);
                setRunId(nextRun.id);
                setSelectedStageId(nextRun.stages[0].id);
              }}
              className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
            >
              {pipelineRuns.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Finding view</p>
              <p className="text-xs text-text-muted">Raw scanner output or canonical groups.</p>
            </div>
            <button
              type="button"
              onClick={() => setDeduped((value) => !value)}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-text-secondary hover:border-accent hover:text-accent-strong"
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              {deduped ? 'Deduped' : 'Raw'}
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
            Gate policy
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {severities.map((severity) => (
              <label
                key={severity}
                className="flex min-h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-text-secondary"
              >
                <input
                  type="checkbox"
                  checked={blockingSeverities.includes(severity)}
                  onChange={() => toggleSeverity(severity)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {severity}
              </label>
            ))}
          </div>

          <div
            className={cn(
              'mt-5 rounded-lg border p-4',
              gateBlocked
                ? 'border-severity-high/30 bg-severity-high/10'
                : 'border-severity-low/30 bg-severity-low/10',
            )}
          >
            <div className="flex items-center gap-2">
              {gateBlocked ? (
                <ShieldAlert aria-hidden="true" className="h-4 w-4 text-severity-high" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-severity-low" />
              )}
              <p className="font-semibold text-text-primary">
                {gateBlocked ? 'Blocked - exit 3' : 'Passed'}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {gateBlocked
                ? `${blockingFindings.length} finding(s) match the current blocking severity policy.`
                : 'No findings match the current blocking severity policy.'}
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
            Stage timeline
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-7">
            {run.stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={cn(
                  'flex min-h-24 flex-col justify-between rounded-lg border p-3 text-left transition-colors',
                  selectedStage.id === stage.id
                    ? 'border-accent bg-accent-subtle/50'
                    : 'border-border bg-background hover:border-accent',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-text-primary">{stage.name}</span>
                  {statusIcon(stage)}
                </span>
                <span className="text-xs text-text-muted">{stage.findingIds.length} finding(s)</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{selectedStage.name}</h2>
              <p className="text-sm text-text-muted">
                {deduped ? 'Canonical finding groups' : 'Raw scanner findings'}
              </p>
            </div>
            <span className="rounded-md border border-border bg-elevated px-2 py-1 text-xs font-medium text-text-secondary">
              {selectedStage.status}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {stageFindings.length === 0 ? (
              <p className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
                No findings in this stage.
              </p>
            ) : deduped ? (
              groupedStageFindings.map((group) => (
                <div key={group.canonicalKey} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityPill severity={group.representative.severity} />
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold text-text-secondary">
                      {group.scanners.length} scanner{group.scanners.length === 1 ? '' : 's'} agree
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-text-primary">{group.canonicalKey}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{group.representative.location}</p>
                  <ul className="mt-3 space-y-2 text-sm text-text-muted">
                    {group.findings.map((finding) => (
                      <li key={finding.id}>
                        {finding.scanner}: {finding.rule}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              stageFindings.map((finding) => (
                <div key={finding.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityPill severity={finding.severity} />
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold text-text-secondary">
                      {finding.scanner}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-text-primary">{finding.rule}</h3>
                  <p className="mt-2 font-mono text-xs text-text-secondary">{finding.location}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

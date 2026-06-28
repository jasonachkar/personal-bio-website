'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Database,
  ExternalLink,
  GitBranch,
  Globe2,
  KeyRound,
  Network,
  Server,
  ShieldCheck,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TerraformIcon, AzureIcon } from '@/components/icons/CloudProviderIcons';
import { cn } from '@/lib/cn';
import { iacScenarios } from '../../../../content/demos/cloud-attack-surface';
import type { GraphNode, IacScenario } from '../../../../content/demos/types';
import { SeverityBadge, WhatThisProves } from '../demoUtils';

const beats = ['Environment', 'Exposure', 'Attack path', 'Mitigation'];

const nodeTone: Record<GraphNode['type'], string> = {
  Internet: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
  Network: 'border-teal-400/30 bg-teal-400/10 text-teal-100',
  Compute: 'border-blue-400/30 bg-blue-400/10 text-blue-100',
  Identity: 'border-violet-400/30 bg-violet-400/10 text-violet-100',
  SecretStore: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  Storage: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
  Database: 'border-purple-400/30 bg-purple-400/10 text-purple-100',
  SecurityControl: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  SensitiveTarget: 'border-red-400/30 bg-red-400/10 text-red-100',
};

function getScenario(id: string): IacScenario {
  return iacScenarios.find((scenario) => scenario.id === id) ?? iacScenarios[0];
}

function ResourceIcon({ node }: { node: GraphNode }) {
  if (node.type === 'Internet') return <Globe2 className="h-5 w-5" aria-hidden="true" />;
  if (node.type === 'SecurityControl' || node.type === 'Network') {
    return <Network className="h-5 w-5" aria-hidden="true" />;
  }
  if (node.type === 'Compute') return <Server className="h-5 w-5" aria-hidden="true" />;
  if (node.type === 'SecretStore' || node.type === 'SensitiveTarget') {
    return <KeyRound className="h-5 w-5" aria-hidden="true" />;
  }
  if (node.type === 'Storage' || node.type === 'Database') {
    return <Database className="h-5 w-5" aria-hidden="true" />;
  }

  return <AzureIcon className="h-5 w-5" />;
}

export function CloudAttackSurfaceDemo() {
  const [scenarioId, setScenarioId] = useState(iacScenarios[0].id);
  const [manualMitigation, setManualMitigation] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(2);

  const scenario = getScenario(scenarioId);
  const activePath = scenario.paths[0];
  const mitigated = manualMitigation || activeStep >= 3;

  const pathGraphNodes = useMemo(
    () =>
      activePath.nodeIds
        .map((nodeId) => scenario.graph.nodes.find((node) => node.id === nodeId))
        .filter((node): node is GraphNode => Boolean(node)),
    [activePath.nodeIds, scenario.graph.nodes],
  );

  const activeNode =
    scenario.graph.nodes.find((node) => node.id === activeNodeId) ??
    scenario.graph.nodes.find((node) => node.misconfig) ??
    scenario.graph.nodes[0];

  return (
    <section id="demo-cloud" className="py-8 md:py-10">
      <div className="content-container">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <Card variant="glass" hoverEffect="none" interactive={false} padding="none">
            <div className="relative z-10 border-b border-white/10 p-5 md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Mega-demo 1 / Cloud Security
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-text-primary">
                    Azure Cloud Attack Surface
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">{scenario.description}</p>
                </div>
                <select
                  value={scenario.id}
                  onChange={(event) => {
                    setScenarioId(event.target.value);
                    setActiveNodeId(null);
                    setManualMitigation(false);
                    setActiveStep(2);
                  }}
                  className="min-h-11 rounded-2xl border border-white/10 bg-background/70 px-4 text-sm text-text-primary"
                  aria-label="Choose attack surface scenario"
                >
                  {iacScenarios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                {beats.map((beat, index) => (
                  <button
                    key={beat}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      'rounded-2xl border p-3 text-left transition-colors',
                      activeStep === index
                        ? 'border-primary/50 bg-primary/15 text-text-primary'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:text-text-primary',
                    )}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">{beat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-6 p-5 md:p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-5">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">Terraform to Azure resource flow</h4>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Labeled infrastructure nodes replace the old anonymous graph circles.
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                      <TerraformIcon className="h-4 w-4" />
                      Terraform plan
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="flex items-center gap-3 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-violet-100">
                      <TerraformIcon className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">Terraform root module</p>
                        <p className="truncate text-xs text-violet-100/70">{scenario.ruleId}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-violet-100/60" aria-hidden="true" />
                    </div>

                    {pathGraphNodes.map((node) => {
                      const selected = node.id === activeNode.id;
                      const exposed = activeStep >= 1 && Boolean(node.misconfig);
                      const inPath = activeStep >= 2;

                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setActiveNodeId(node.id)}
                          className={cn(
                            'flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-colors',
                            nodeTone[node.type],
                            selected && 'ring-2 ring-primary/60',
                            exposed && 'border-orange-300/50 bg-orange-500/10',
                            inPath && 'shadow-[0_0_28px_rgba(34,211,238,0.10)]',
                            mitigated && 'border-emerald-300/40 bg-emerald-500/10 text-emerald-50',
                          )}
                        >
                          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
                            {node.type === 'Internet' ? <ResourceIcon node={node} /> : <AzureIcon className="h-5 w-5" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold leading-snug">{node.label}</span>
                            <span className="mt-0.5 block text-xs uppercase tracking-wide opacity-70">{node.type}</span>
                          </span>
                          {mitigated ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-200" aria-hidden="true" />
                          ) : (
                            <ResourceIcon node={node} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <pre className="max-h-72 overflow-auto rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-xs leading-5 text-slate-300">
                  <code>{scenario.terraformSnippet}</code>
                </pre>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-xs text-text-secondary">
                      {scenario.ruleId}
                    </span>
                    <SeverityBadge severity={activePath.severity} />
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-text-secondary">
                      {activePath.confidence} confidence
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">{activePath.explanation}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-text-primary">Selected evidence</h4>
                    <button
                      type="button"
                      onClick={() => setManualMitigation((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-2 text-xs font-semibold text-primary"
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      {mitigated ? 'Mitigated' : 'Show fixes'}
                    </button>
                  </div>
                  <p className="mt-4 font-semibold text-text-primary">{activeNode.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">{activeNode.type}</p>
                  {activeNode.misconfig ? (
                    <p className="mt-3 text-sm leading-6 text-text-secondary">{activeNode.misconfig}</p>
                  ) : null}
                  {mitigated && activeNode.mitigation ? (
                    <p className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-100">
                      {activeNode.mitigation}
                    </p>
                  ) : null}
                  {activeNode.benchmark ? (
                    <p className="mt-3 text-xs font-semibold uppercase text-primary">{activeNode.benchmark}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>

          <aside className="grid gap-4 xl:sticky xl:top-24">
            <WhatThisProves
              items={[
                'Credential-free IaC analysis from Terraform sample data',
                'Azure network, identity, Key Vault, and storage hardening reasoning',
                'CIS/Azure Security Benchmark posture mapped to concrete mitigations',
              ]}
            />
            <div className="liquid-glass p-5">
              <div className="relative z-10">
                <h4 className="text-sm font-semibold text-text-primary">SecureObs anchor</h4>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  This is an interactive simulation on sample data inspired by SecureObs's Terraform to typed graph to
                  ranked path workflow.
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

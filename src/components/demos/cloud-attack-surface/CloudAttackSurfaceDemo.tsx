'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Core, ElementDefinition } from 'cytoscape';
import { ExternalLink, GitBranch, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { iacScenarios } from '../../../../content/demos/cloud-attack-surface';
import type { AttackPath, GraphNode, IacScenario } from '../../../../content/demos/types';
import { SeverityBadge, WhatThisProves } from '../demoUtils';
import { useStoryProgress } from '../useStoryProgress';

const nodeTypeColor: Record<GraphNode['type'], string> = {
  Internet: '#64748b',
  Network: '#0f766e',
  Compute: '#2563eb',
  Identity: '#7c3aed',
  SecretStore: '#b45309',
  Storage: '#0e7490',
  Database: '#9333ea',
  SecurityControl: '#475569',
  SensitiveTarget: '#dc2626',
};

const beats = ['Environment', 'Exposure', 'Attack path', 'Mitigation'];

function getScenario(id: string): IacScenario {
  return iacScenarios.find((scenario) => scenario.id === id) ?? iacScenarios[0];
}

export function CloudAttackSurfaceDemo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const { progress, activeStep } = useStoryProgress(sectionRef, visualRef, beats.length);
  const [scenarioId, setScenarioId] = useState(iacScenarios[0].id);
  const [manualMitigation, setManualMitigation] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const scenario = getScenario(scenarioId);
  const activePath = scenario.paths[0];
  const mitigated = manualMitigation || activeStep >= 3;

  const pathNodes = useMemo(() => new Set(activePath.nodeIds), [activePath.nodeIds]);
  const pathEdges = useMemo(
    () =>
      new Set(
        scenario.graph.edges
          .filter((edge) => pathNodes.has(edge.source) && pathNodes.has(edge.target))
          .map((edge) => edge.id),
      ),
    [pathNodes, scenario.graph.edges],
  );

  const activeNode =
    scenario.graph.nodes.find((node) => node.id === activeNodeId) ??
    scenario.graph.nodes.find((node) => node.misconfig) ??
    scenario.graph.nodes[0];

  useEffect(() => {
    let cy: Core | undefined;
    let cancelled = false;

    async function renderGraph() {
      const cytoscapeModule = await import('cytoscape');
      if (cancelled || !graphRef.current) return;

      const elements: ElementDefinition[] = [
        ...scenario.graph.nodes.map((node) => ({
          data: { id: node.id, label: node.label, type: node.type },
          classes: cn(
            activeStep >= 1 && node.misconfig && 'misconfigured',
            activeStep >= 2 && pathNodes.has(node.id) && 'path-node',
            mitigated && pathNodes.has(node.id) && 'secured-node',
            node.id === activeNodeId && 'selected-node',
          ),
        })),
        ...scenario.graph.edges.map((edge) => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.type,
          },
          classes: cn(activeStep >= 2 && pathEdges.has(edge.id) && 'path-edge', mitigated && 'secured-edge'),
        })),
      ];

      cy = cytoscapeModule.default({
        container: graphRef.current,
        elements,
        autoungrabify: true,
        wheelSensitivity: 0.16,
        minZoom: 0.55,
        maxZoom: 1.7,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (element) =>
                nodeTypeColor[element.data('type') as GraphNode['type']] ?? '#475569',
              label: 'data(label)',
              color: '#e2e8f0',
              'font-size': '11px',
              'font-weight': 700,
              'text-wrap': 'wrap',
              'text-max-width': '90px',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-outline-width': '3px',
              'text-outline-color': '#020617',
              width: '82px',
              height: '82px',
              'border-width': '2px',
              'border-color': 'rgba(255,255,255,0.32)',
            },
          },
          {
            selector: 'edge',
            style: {
              width: '2px',
              'line-color': 'rgba(148,163,184,0.6)',
              'target-arrow-color': 'rgba(148,163,184,0.6)',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '9px',
              color: '#cbd5e1',
              'text-background-color': '#020617',
              'text-background-opacity': 0.7,
              'text-background-padding': '3px',
            },
          },
          {
            selector: '.misconfigured',
            style: {
              'border-style': 'double',
              'border-color': '#fb923c',
            },
          },
          {
            selector: '.path-node',
            style: {
              'border-color': '#22d3ee',
              'border-width': '5px',
            },
          },
          {
            selector: '.path-edge',
            style: {
              width: '6px',
              'line-color': '#22d3ee',
              'target-arrow-color': '#22d3ee',
            },
          },
          {
            selector: '.secured-node',
            style: {
              'border-color': '#34d399',
              'background-color': '#0f766e',
            },
          },
          {
            selector: '.secured-edge',
            style: {
              width: '2px',
              'line-color': 'rgba(52,211,153,0.5)',
              'target-arrow-color': 'rgba(52,211,153,0.5)',
              'line-style': 'dashed',
            },
          },
          {
            selector: '.selected-node',
            style: {
              'border-color': '#f8fafc',
              'border-width': '6px',
            },
          },
        ],
        layout: {
          name: 'breadthfirst',
          directed: true,
          spacingFactor: 1.25,
          padding: 28,
        },
      });

      cy.on('tap', 'node', (event) => setActiveNodeId(event.target.id()));
      cy.fit(undefined, 28);
    }

    renderGraph();

    return () => {
      cancelled = true;
      cy?.destroy();
    };
  }, [activeNodeId, activeStep, mitigated, pathEdges, pathNodes, scenario]);

  return (
    <section ref={sectionRef} id="demo-cloud" className="relative min-h-[220vh] py-16">
      <div className="content-container">
        <div ref={visualRef} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <Card variant="glass" hoverEffect="none" interactive={false} padding="none" className="min-h-[720px]">
            <div className="relative z-10 border-b border-white/10 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">Mega-demo 1 / Cloud Security</p>
                  <h3 className="mt-2 text-2xl font-semibold text-text-primary">Azure Cloud Attack Surface</h3>
                </div>
                <select
                  value={scenario.id}
                  onChange={(event) => {
                    setScenarioId(event.target.value);
                    setActiveNodeId(null);
                    setManualMitigation(false);
                  }}
                  className="min-h-11 rounded-2xl border border-white/10 bg-background/70 px-4 text-sm text-text-primary"
                >
                  {iacScenarios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-5 grid gap-2 md:grid-cols-4">
                {beats.map((beat, index) => (
                  <div key={beat} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="h-1 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: activeStep >= index ? '100%' : `${Math.max(0, progress * beats.length - index) * 100}%` }}
                      />
                    </div>
                    <p className={cn('mt-2 text-xs font-semibold', activeStep >= index ? 'text-text-primary' : 'text-text-muted')}>
                      {beat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-5 p-5 xl:grid-cols-[1fr_340px]">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <div ref={graphRef} role="img" aria-label={`Azure resource graph for ${scenario.title}`} className="h-[540px] w-full" />
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
                  <p className="mt-4 text-sm leading-6 text-text-secondary">{scenario.description}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-text-primary">Graph evidence</h4>
                    <button
                      type="button"
                      onClick={() => setManualMitigation((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-2 text-xs font-semibold text-primary"
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      {mitigated ? 'Mitigated' : 'Show mitigations'}
                    </button>
                  </div>
                  <p className="mt-4 font-semibold text-text-primary">{activeNode.label}</p>
                  <p className="mt-1 text-xs text-text-muted">{activeNode.type}</p>
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

                <pre className="max-h-52 overflow-auto rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-xs leading-5 text-slate-300">
                  <code>{scenario.terraformSnippet}</code>
                </pre>
              </div>
            </div>
          </Card>

          <aside className="grid gap-4 lg:sticky lg:top-24">
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
                  This is an interactive simulation on sample data inspired by SecureObs's Terraform to typed graph to ranked path workflow.
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

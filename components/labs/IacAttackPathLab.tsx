'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Core, ElementDefinition } from 'cytoscape';
import { Eye, ShieldCheck } from 'lucide-react';
import { iacScenarios } from '@/content/labs/iac-scenarios';
import type { AttackPath, GraphNode, IacScenario } from '@/content/types';
import { Card } from '@/components/ui/Card';
import { SeverityPill } from '@/components/ui/SeverityPill';
import { cn } from '@/lib/cn';

const nodeTypeColor: Record<GraphNode['type'], string> = {
  Internet: '#475569',
  Network: '#0f766e',
  Compute: '#2563eb',
  Identity: '#7c3aed',
  SecretStore: '#b45309',
  Storage: '#0e7490',
  Database: '#9333ea',
  SecurityControl: '#64748b',
  SensitiveTarget: '#dc2626',
  ResourceGroup: '#334155',
};

function selectedScenario(id: string): IacScenario {
  return iacScenarios.find((scenario) => scenario.id === id) ?? iacScenarios[0];
}

export function IacAttackPathLab() {
  const [scenarioId, setScenarioId] = useState(iacScenarios[0].id);
  const [pathId, setPathId] = useState(iacScenarios[0].paths[0].id);
  const [showMitigations, setShowMitigations] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scenario = selectedScenario(scenarioId);
  const activePath = useMemo<AttackPath>(() => {
    return scenario.paths.find((path) => path.id === pathId) ?? scenario.paths[0];
  }, [pathId, scenario]);
  const activeNode = activeNodeId
    ? scenario.graph.nodes.find((node) => node.id === activeNodeId)
    : scenario.graph.nodes.find((node) => activePath.nodeIds.includes(node.id) && node.misconfig);

  useEffect(() => {
    if (!scenario.paths.some((path) => path.id === pathId)) {
      setPathId(scenario.paths[0].id);
    }
    setActiveNodeId(null);
  }, [pathId, scenario]);

  useEffect(() => {
    let cy: Core | undefined;
    let cancelled = false;
    const highlightedNodes = new Set(activePath.nodeIds);
    const highlightedEdges = new Set(
      scenario.graph.edges
        .filter((edge) => highlightedNodes.has(edge.source) && highlightedNodes.has(edge.target))
        .map((edge) => edge.id),
    );

    async function renderGraph() {
      const cytoscapeModule = await import('cytoscape');

      if (cancelled || !containerRef.current) {
        return;
      }

      const elements: ElementDefinition[] = [
        ...scenario.graph.nodes.map((node) => ({
          data: { id: node.id, label: node.label, type: node.type },
          classes: cn(
            highlightedNodes.has(node.id) && 'path-node',
            node.misconfig && 'misconfigured',
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
          classes: highlightedEdges.has(edge.id) ? 'path-edge' : '',
        })),
      ];

      cy = cytoscapeModule.default({
        container: containerRef.current,
        elements,
        wheelSensitivity: 0.2,
        minZoom: 0.6,
        maxZoom: 1.8,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (element) =>
                nodeTypeColor[element.data('type') as GraphNode['type']] ?? '#475569',
              label: 'data(label)',
              color: '#102027',
              'font-size': '12px',
              'font-weight': 'bold',
              'text-wrap': 'wrap',
              'text-max-width': '96px',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-outline-width': '3px',
              'text-outline-color': '#ffffff',
              width: '86px',
              height: '86px',
              'border-width': '2px',
              'border-color': '#dbe4e8',
            },
          },
          {
            selector: 'edge',
            style: {
              width: '2px',
              'line-color': '#94a3b8',
              'target-arrow-color': '#94a3b8',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '9px',
              color: '#425466',
              'text-background-color': '#ffffff',
              'text-background-opacity': 0.9,
              'text-background-padding': '3px',
            },
          },
          {
            selector: '.path-node',
            style: {
              'border-color': '#0f766e',
              'border-width': '4px',
            },
          },
          {
            selector: '.path-edge',
            style: {
              width: '4px',
              'line-color': '#0f766e',
              'target-arrow-color': '#0f766e',
            },
          },
          {
            selector: '.misconfigured',
            style: {
              'border-style': 'double',
            },
          },
          {
            selector: '.selected-node',
            style: {
              'border-color': '#dc2626',
              'border-width': '5px',
            },
          },
        ],
        layout: {
          name: 'breadthfirst',
          directed: true,
          spacingFactor: 1.25,
          padding: 24,
        },
      });

      cy.on('tap', 'node', (event) => {
        setActiveNodeId(event.target.id());
      });
    }

    renderGraph();

    return () => {
      cancelled = true;
      cy?.destroy();
    };
  }, [activeNodeId, activePath, scenario]);

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            Scenario
            <select
              value={scenario.id}
              onChange={(event) => setScenarioId(event.target.value)}
              className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
            >
              {iacScenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-elevated px-2 py-1 font-mono text-xs text-text-secondary">
              {scenario.ruleId}
            </span>
            <SeverityPill severity={activePath.severity} />
            <span className="rounded-md border border-border bg-elevated px-2 py-1 text-xs font-medium text-text-secondary">
              {activePath.confidence} confidence
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-text-secondary">{scenario.description}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
              Terraform sample
            </h2>
            <button
              type="button"
              onClick={() => setShowMitigations((value) => !value)}
              className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent-strong"
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              {showMitigations ? 'Hide mitigations' : 'Show mitigations'}
            </button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg border border-border bg-background p-4 text-xs leading-5 text-text-secondary">
            <code>{scenario.terraformSnippet}</code>
          </pre>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
              Typed Azure graph
            </h2>
          </div>
          <div
            ref={containerRef}
            role="img"
            aria-label={`Resource graph for ${scenario.title}`}
            className="h-[520px] w-full bg-surface"
          />
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
              Ranked path
            </h2>
            <div className="mt-4 space-y-3">
              {scenario.paths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setPathId(path.id)}
                  className={cn(
                    'w-full rounded-lg border p-4 text-left transition-colors',
                    path.id === activePath.id
                      ? 'border-accent bg-accent-subtle/50'
                      : 'border-border bg-background hover:border-accent',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityPill severity={path.severity} />
                    <span className="text-xs font-medium text-text-muted">{path.confidence} confidence</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">{path.explanation}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Eye aria-hidden="true" className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Node evidence
              </h2>
            </div>
            {activeNode ? (
              <div className="mt-4 space-y-3">
                <p className="font-semibold text-text-primary">{activeNode.label}</p>
                <p className="text-sm text-text-muted">{activeNode.type}</p>
                {activeNode.misconfig ? (
                  <p className="text-sm leading-6 text-text-secondary">{activeNode.misconfig}</p>
                ) : null}
                {showMitigations && activeNode.mitigation ? (
                  <p className="rounded-lg border border-accent/30 bg-accent-subtle/40 p-3 text-sm leading-6 text-text-secondary">
                    {activeNode.mitigation}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                Select a graph node to inspect its evidence and mitigation.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

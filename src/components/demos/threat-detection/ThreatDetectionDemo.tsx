'use client';

import { useMemo, useRef, useState } from 'react';
import { Activity, ExternalLink, GitBranch, Radio } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { detectionEvents, dfdNodes, strideThreats } from '../../../../content/demos/threat-detection';
import { SeverityBadge, WhatThisProves } from '../demoUtils';
import { useStoryProgress } from '../useStoryProgress';

const beats = ['Model', 'Threat', 'Signal', 'Detection'];

export function ThreatDetectionDemo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const { activeStep } = useStoryProgress(sectionRef, visualRef, beats.length);
  const [selectedThreatId, setSelectedThreatId] = useState(strideThreats[0].id);

  const selectedThreat = strideThreats.find((threat) => threat.id === selectedThreatId) ?? strideThreats[0];
  const linkedEvents = useMemo(
    () => detectionEvents.filter((event) => event.linkedThreatId === selectedThreat.id),
    [selectedThreat.id],
  );
  const visibleEvents = activeStep >= 2 ? detectionEvents : linkedEvents;

  return (
    <section ref={sectionRef} id="demo-threat" className="relative min-h-[180vh] py-16">
      <div className="content-container">
        <div ref={visualRef} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <Card variant="glass" hoverEffect="none" interactive={false} padding="none" className="min-h-[680px]">
            <div className="relative z-10 border-b border-white/10 p-5">
              <p className="text-xs font-semibold uppercase text-accent">Mega-demo 3 / AppSec + Detection</p>
              <h3 className="mt-2 text-2xl font-semibold text-text-primary">Threat to Detection</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                A STRIDE model feeds a detection console so design-time risks become runtime monitoring logic.
              </p>
            </div>

            <div className="relative z-10 grid gap-5 p-5 xl:grid-cols-[1fr_420px]">
              <div className="grid gap-5">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-primary">Data-flow model</h4>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted">
                      STRIDE sample
                    </span>
                  </div>
                  <div className="relative grid min-h-[320px] grid-cols-2 gap-4 md:grid-cols-3">
                    {dfdNodes.map((node) => {
                      const selected = node.id === selectedThreat.componentId;
                      return (
                        <div
                          key={node.id}
                          className={cn(
                            'grid min-h-28 place-items-center rounded-3xl border p-4 text-center transition-all duration-300',
                            selected
                              ? 'border-accent/60 bg-accent/15 text-text-primary shadow-glow-purple'
                              : 'border-white/10 bg-white/[0.04] text-text-secondary',
                            node.kind === 'boundary' && 'border-dashed',
                          )}
                        >
                          <div>
                            <p className="text-sm font-semibold">{node.label}</p>
                            <p className="mt-1 text-xs uppercase text-text-muted">{node.kind}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {strideThreats.map((threat) => (
                    <button
                      key={threat.id}
                      type="button"
                      onClick={() => setSelectedThreatId(threat.id)}
                      className={cn(
                        'rounded-3xl border p-4 text-left transition-all duration-300',
                        threat.id === selectedThreat.id
                          ? 'border-accent/50 bg-accent/15'
                          : 'border-white/10 bg-white/[0.03] hover:border-accent/30',
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={threat.risk} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-text-primary">{threat.title}</p>
                      <p className="mt-2 text-xs text-text-muted">{threat.stride}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h4 className="text-sm font-semibold text-text-primary">Selected threat</h4>
                  </div>
                  <p className="mt-4 text-base font-semibold text-text-primary">{selectedThreat.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{selectedThreat.mitigation}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Radio className="h-4 w-4 text-primary" aria-hidden="true" />
                    Detection stream
                  </div>
                  <div className="grid max-h-[420px] gap-3 overflow-auto">
                    {visibleEvents.map((event) => {
                      const linked = event.linkedThreatId === selectedThreat.id;
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            'rounded-2xl border p-4 transition-all duration-300',
                            linked ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-white/[0.03]',
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-text-muted">{event.timestamp}</span>
                            <SeverityBadge severity={event.severity} />
                            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-text-muted">
                              {event.source}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-text-secondary">{event.message}</p>
                          <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-3 text-xs leading-5 text-slate-300">
                            <code>{event.query}</code>
                          </pre>
                          <p className="mt-2 text-xs font-semibold uppercase text-primary">{event.mitre}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <WhatThisProves
              items={[
                'STRIDE threat modeling tied to system components and trust boundaries',
                'KQL-like detection thinking mapped to modeled risks',
                'MITRE ATT&CK fluency without claiming live monitoring',
              ]}
            />
            <div className="liquid-glass p-5">
              <div className="relative z-10">
                <h4 className="text-sm font-semibold text-text-primary">Honest scope</h4>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Static simulation on sample events. It does not connect to Sentinel, SecureObs, or a live tenant.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="https://secureobs.com" target="_blank" rel="noreferrer" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                    SecureObs
                  </Button>
                  <Button
                    href="https://github.com/jasonachkar"
                    target="_blank"
                    rel="noreferrer"
                    variant="ghost"
                    size="sm"
                    icon={<GitBranch className="h-4 w-4" />}
                  >
                    GitHub
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

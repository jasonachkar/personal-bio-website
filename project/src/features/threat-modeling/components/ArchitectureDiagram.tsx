'use client';

import { Server, Database, Users, Cloud, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ThreatModelComponent, DataFlow, TrustBoundary } from '../types';

interface ArchitectureDiagramProps {
  components: ThreatModelComponent[];
  dataFlows: DataFlow[];
  trustBoundaries: TrustBoundary[];
  onComponentClick?: (component: ThreatModelComponent) => void;
  className?: string;
}

const componentIcons = {
  process: Server,
  datastore: Database,
  'external-entity': Users,
  'data-flow': ArrowRight,
};

const componentColors = {
  process: 'bg-primary/10 border-primary/30 text-primary',
  datastore: 'bg-secondary/10 border-secondary/30 text-secondary',
  'external-entity': 'bg-accent/10 border-accent/30 text-accent',
  'data-flow': 'bg-text-secondary/10 border-border text-text-secondary',
};

export function ArchitectureDiagram({
  components,
  dataFlows,
  trustBoundaries,
  onComponentClick,
  className,
}: ArchitectureDiagramProps) {
  const getComponentById = (id: string) => components.find((c) => c.id === id);

  return (
    <div className={cn('rounded-lg border border-border bg-background-card p-6', className)}>
      <h3 className="text-lg font-semibold text-text-primary mb-6">Architecture Overview</h3>

      {/* Simple flowchart-style diagram */}
      <div className="space-y-8">
        {/* Trust Boundaries */}
        {trustBoundaries.map((boundary, index) => (
          <div key={boundary.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-0.5 flex-1',
                  boundary.level === 'high'
                    ? 'bg-severity-low'
                    : boundary.level === 'medium'
                    ? 'bg-severity-medium'
                    : 'bg-severity-high'
                )}
              />
              <span className="text-sm font-medium text-text-secondary">{boundary.name}</span>
              <div
                className={cn(
                  'h-0.5 flex-1',
                  boundary.level === 'high'
                    ? 'bg-severity-low'
                    : boundary.level === 'medium'
                    ? 'bg-severity-medium'
                    : 'bg-severity-high'
                )}
              />
            </div>

            {/* Components in this boundary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-border/50">
              {boundary.components.map((compId) => {
                const component = getComponentById(compId);
                if (!component) return null;

                const Icon = componentIcons[component.type];

                return (
                  <motion.button
                    key={component.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onComponentClick?.(component)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all text-left',
                      componentColors[component.type],
                      'hover:shadow-lg'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{component.name}</h4>
                        <p className="text-xs opacity-75 line-clamp-2">{component.description}</p>
                        {component.metadata?.technology && (
                          <p className="text-xs opacity-60 mt-1">
                            {component.metadata.technology}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Security indicators */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {component.metadata?.encrypted && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-severity-low/20 text-severity-low">
                          Encrypted
                        </span>
                      )}
                      {component.metadata?.authentication && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/20 text-current">
                          Auth
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Components not in any boundary */}
        {components.filter(
          (c) => !trustBoundaries.some((b) => b.components.includes(c.id))
        ).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {components
              .filter((c) => !trustBoundaries.some((b) => b.components.includes(c.id)))
              .map((component) => {
                const Icon = componentIcons[component.type];

                return (
                  <motion.button
                    key={component.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onComponentClick?.(component)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all text-left',
                      componentColors[component.type],
                      'hover:shadow-lg'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{component.name}</h4>
                        <p className="text-xs opacity-75 line-clamp-2">{component.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
          </div>
        )}

        {/* Data Flows */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-primary">Data Flows</h4>
          <div className="space-y-2">
            {dataFlows.map((flow) => {
              const fromComp = getComponentById(flow.from);
              const toComp = getComponentById(flow.to);

              if (!fromComp || !toComp) return null;

              return (
                <div
                  key={flow.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                >
                  <span className="text-sm text-text-primary font-medium min-w-[120px]">
                    {fromComp.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-text-secondary flex-shrink-0" />
                  <span className="text-sm text-text-primary font-medium min-w-[120px]">
                    {toComp.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary">{flow.label}</p>
                    {flow.protocol && (
                      <p className="text-xs text-text-secondary opacity-75">{flow.protocol}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {flow.encrypted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-severity-low/20 text-severity-low">
                        Encrypted
                      </span>
                    )}
                    {flow.authenticated && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                        Authenticated
                      </span>
                    )}
                    {!flow.encrypted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-severity-high/20 text-severity-high">
                        Unencrypted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Shield, Network, Loader2, AlertTriangle, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Tabs } from '@/components/ui/Tabs';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ThreatList } from './ThreatList';
import type { ThreatModelTemplate } from '../types';

type TabId = 'architecture' | 'threats' | 'summary';

export function ThreatModelingPlayground({ className }: { className?: string }) {
  const [template, setTemplate] = useState<ThreatModelTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('architecture');

  useEffect(() => {
    async function loadTemplate() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/threat-models');
        if (!response.ok) throw new Error('Failed to load threat model template');
        const data = await response.json();
        setTemplate(data.data.template);
      } catch (error) {
        console.error('Error loading threat model:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, []);

  const handleExportMarkdown = () => {
    if (!template) return;

    const markdown = `# Threat Model: ${template.name}

${template.description}

## Architecture
${template.architecture}

## Components
${template.components.map((c) => `- **${c.name}** (${c.type}): ${c.description}`).join('\n')}

## Trust Boundaries
${template.trustBoundaries.map((b) => `- **${b.name}** (${b.level} trust): ${b.components.length} components`).join('\n')}

## Identified Threats

${template.threats.map((t) => `### ${t.title} [${t.severity.toUpperCase()}]
**Category:** ${t.category.replace(/-/g, ' ').toUpperCase()}
**Description:** ${t.description}
**Likelihood:** ${t.likelihood} | **Impact:** ${t.impact}
${t.mitreTactics ? `**MITRE Tactics:** ${t.mitreTactics.join(', ')}` : ''}
${t.mitreTechniques ? `**MITRE Techniques:** ${t.mitreTechniques.join(', ')}` : ''}
`).join('\n')}

## Mitigations

${template.mitigations.map((m) => `### ${m.title} ${m.implemented ? '✅' : '⏳'}
**Threat:** ${template.threats.find((t) => t.id === m.threatId)?.title}
**Description:** ${m.description}
**Priority:** ${m.priority} | **Effort:** ${m.effort} | **Effectiveness:** ${m.effectiveness}
`).join('\n')}

---
Generated on ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-model-${template.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-text-primary">Loading Threat Model...</p>
          <p className="text-sm text-text-secondary mt-2">Analyzing architecture and threats</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-severity-critical mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Data</h3>
        <p className="text-sm text-text-secondary">{error || 'Failed to load threat model'}</p>
      </div>
    );
  }

  const stats = {
    totalThreats: template.threats.length,
    criticalThreats: template.threats.filter((t) => t.severity === 'critical').length,
    highThreats: template.threats.filter((t) => t.severity === 'high').length,
    implementedMitigations: template.mitigations.filter((m) => m.implemented).length,
    totalMitigations: template.mitigations.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('container mx-auto px-4 py-8', className)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Network className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">Threat Modeling Playground</h1>
            </div>
            <p className="text-text-secondary">
              STRIDE-based threat analysis for {template.name}
            </p>
          </div>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            aria-label="Export threat model"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Components</p>
            <p className="text-3xl font-bold text-text-primary">{template.components.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Total Threats</p>
            <p className="text-3xl font-bold text-text-primary">{stats.totalThreats}</p>
          </div>
          <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Critical</p>
            <p className="text-3xl font-bold text-severity-critical">{stats.criticalThreats}</p>
          </div>
          <div className="rounded-lg border border-severity-high/30 bg-severity-high/5 p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">High</p>
            <p className="text-3xl font-bold text-severity-high">{stats.highThreats}</p>
          </div>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Mitigations</p>
            <p className="text-3xl font-bold text-text-primary">
              {stats.implementedMitigations}/{stats.totalMitigations}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-lg border border-border bg-background-card p-6">
          <Tabs
            tabs={[
              { id: 'architecture', label: 'Architecture' },
              { id: 'threats', label: 'Threats & Mitigations' },
              { id: 'summary', label: 'Summary' },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabId)}
            variant="underline"
            className="mb-6"
          />

          {activeTab === 'architecture' && (
            <ArchitectureDiagram
              components={template.components}
              dataFlows={template.dataFlows}
              trustBoundaries={template.trustBoundaries}
            />
          )}

          {activeTab === 'threats' && (
            <ThreatList threats={template.threats} mitigations={template.mitigations} />
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Threat Model Summary</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-secondary">{template.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* STRIDE Coverage */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    STRIDE Coverage
                  </h4>
                  <div className="space-y-2">
                    {[
                      'spoofing',
                      'tampering',
                      'repudiation',
                      'information-disclosure',
                      'denial-of-service',
                      'elevation-of-privilege',
                    ].map((category) => {
                      const count = template.threats.filter((t) => t.category === category).length;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary capitalize">
                            {category.replace(/-/g, ' ')}
                          </span>
                          <span className="text-sm font-medium text-text-primary">
                            {count} threat{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mitigation Status */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    Mitigation Status
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text-secondary">Implementation Progress</span>
                        <span className="text-sm font-medium text-text-primary">
                          {Math.round((stats.implementedMitigations / stats.totalMitigations) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-background-card overflow-hidden">
                        <div
                          className="h-full bg-severity-low transition-all"
                          style={{
                            width: `${(stats.implementedMitigations / stats.totalMitigations) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Implemented</span>
                        <span className="font-medium text-severity-low">{stats.implementedMitigations}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Pending</span>
                        <span className="font-medium text-severity-medium">
                          {stats.totalMitigations - stats.implementedMitigations}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Recommendations */}
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Top Priority Mitigations
                </h4>
                <div className="space-y-2">
                  {template.mitigations
                    .filter((m) => !m.implemented && m.priority === 'critical')
                    .map((mitigation) => {
                      const threat = template.threats.find((t) => t.id === mitigation.threatId);
                      return (
                        <div
                          key={mitigation.id}
                          className="p-3 rounded-lg bg-background-card border border-border"
                        >
                          <p className="text-sm font-medium text-text-primary mb-1">
                            {mitigation.title}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Addresses: {threat?.title} ({threat?.severity})
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

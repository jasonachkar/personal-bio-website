'use client';

import { useEffect, useState } from 'react';
import { Cloud, Shield, AlertTriangle, Loader2, CheckCircle2, XCircle, Download, FolderTree, FileCode, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Tabs } from '@/components/ui/Tabs';
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';
import { Button } from '@/components/ui/Button';
import { EvidencePackGenerator } from '@/components/ui/EvidencePackGenerator';
import { ManagementGroupHierarchy } from '@/features/azure/components/ManagementGroupHierarchy';

type TabId = 'components' | 'misconfigurations' | 'checklist' | 'hierarchy';

interface SecurityControl {
  title: string;
  description?: string;
}

interface Misconfiguration {
  issue: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  fix: string;
}

interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  securityControls: string[];
  commonMisconfigurations: Misconfiguration[];
  bestPractices: string[];
}

interface Architecture {
  components: Component[];
  cisControls?: Array<{
    id: string;
    title: string;
    implementation: string;
  }>;
}

const riskColors = {
  Critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  High: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  Medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  Low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
};

export default function AzureBlueprintPage() {
  const [architecture, setArchitecture] = useState<Architecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('hierarchy');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadArchitecture() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/azure');
        if (!response.ok) throw new Error('Failed to load Azure architecture');
        const data = await response.json();
        setArchitecture(data.data.architecture);
        if (data.data.architecture.components.length > 0) {
          setSelectedComponent(data.data.architecture.components[0].id);
        }
      } catch (error) {
        console.error('Error loading Azure architecture:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadArchitecture();
  }, []);

  const toggleChecklistItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-text-primary">Loading Azure Architecture...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !architecture) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-severity-critical mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Data</h3>
            <p className="text-sm text-text-secondary">{error || 'Failed to load architecture'}</p>
          </div>
        </div>
      </main>
    );
  }

  const selectedComp = architecture.components.find((c) => c.id === selectedComponent);

  // Generate evidence pack data
  const evidenceData = {
    projectName: 'Azure Security Blueprint',
    executiveSummary: `Azure Security Blueprint assessment covering ${architecture.components.length} components, ${architecture.components.reduce((sum, c) => sum + c.securityControls.length, 0)} security controls, and ${architecture.components.reduce((sum, c) => sum + c.commonMisconfigurations.length, 0)} identified misconfigurations.`,
    technicalFindings: architecture.components.map(c => 
      `## ${c.name}\n\n${c.description}\n\n### Security Controls\n${c.securityControls.map(s => `- ${s}`).join('\n')}`
    ).join('\n\n'),
    backlog: architecture.components.flatMap(c =>
      c.commonMisconfigurations.map(m => ({
        id: `${c.id}-${m.issue.slice(0, 20)}`,
        title: `${c.name}: ${m.issue}`,
        priority: m.risk.toLowerCase() as 'critical' | 'high' | 'medium' | 'low',
        effort: 'medium',
      }))
    ),
    rawData: { architecture, checkedItems: Array.from(checkedItems) },
    generatedAt: new Date().toLocaleString(),
  };

  return (
    <main className="min-h-screen bg-background">
      <ShowcaseHeader
        title="Azure Security Blueprint"
        description="Comprehensive security reference for Microsoft Azure cloud infrastructure"
        actions={
          <EvidencePackGenerator data={evidenceData} />
        }
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="content-container py-6 sm:py-8"
      >
        <div className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-background-card p-4">
              <p className="text-sm font-medium text-text-secondary mb-1">Components</p>
              <p className="text-3xl font-bold text-text-primary">{architecture.components.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-background-card p-4">
              <p className="text-sm font-medium text-text-secondary mb-1">Security Controls</p>
              <p className="text-3xl font-bold text-text-primary">
                {architecture.components.reduce((sum, c) => sum + c.securityControls.length, 0)}
              </p>
            </div>
            <div className="rounded-lg border border-severity-high/30 bg-severity-high/5 p-4">
              <p className="text-sm font-medium text-text-secondary mb-1">Misconfigurations</p>
              <p className="text-3xl font-bold text-severity-high">
                {architecture.components.reduce((sum, c) => sum + c.commonMisconfigurations.length, 0)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background-card p-4">
              <p className="text-sm font-medium text-text-secondary mb-1">Checklist Progress</p>
              <p className="text-3xl font-bold text-text-primary">
                {checkedItems.size}/{architecture.cisControls?.length || 0}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-lg border border-border bg-background-card p-6">
            <Tabs
              tabs={[
                { id: 'hierarchy', label: 'Management Groups' },
                { id: 'components', label: 'Azure Components' },
                { id: 'misconfigurations', label: 'Misconfigurations' },
                { id: 'checklist', label: 'Security Checklist' },
              ]}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as TabId)}
              variant="underline"
              className="mb-6"
            />

            {/* Management Group Hierarchy Tab */}
            {activeTab === 'hierarchy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-primary" />
                    Azure Landing Zone Hierarchy
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    Cloud Adoption Framework aligned management group structure with policy inheritance and RBAC.
                  </p>
                </div>
                <ManagementGroupHierarchy />
              </div>
            )}

            {/* Components Tab */}
            {activeTab === 'components' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Component List */}
                <div className="space-y-2">
                  {architecture.components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedComponent(component.id)}
                      className={cn(
                        'w-full p-4 rounded-lg border text-left transition-all',
                        selectedComponent === component.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <h3 className="font-semibold text-text-primary mb-1">{component.name}</h3>
                      <p className="text-xs text-text-secondary">{component.category}</p>
                    </button>
                  ))}
                </div>

                {/* Component Details */}
                {selectedComp && (
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedComp.name}</h2>
                      <p className="text-text-secondary mb-4">{selectedComp.description}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-primary/10 text-primary border border-primary/30">
                        {selectedComp.category}
                      </span>
                    </div>

                    {/* Security Controls */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-severity-low" />
                        Security Controls
                      </h3>
                      <ul className="space-y-2">
                        {selectedComp.securityControls.map((control, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle2 className="h-4 w-4 text-severity-low flex-shrink-0 mt-0.5" />
                            <span>{control}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Best Practices */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3">Best Practices</h3>
                      <ul className="space-y-2">
                        {selectedComp.bestPractices.map((practice, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Misconfigurations Tab */}
            {activeTab === 'misconfigurations' && (
              <div className="space-y-6">
                {architecture.components.map((component) => (
                  <div key={component.id}>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">{component.name}</h3>
                    <div className="space-y-3">
                      {component.commonMisconfigurations.map((misc, index) => (
                        <div
                          key={index}
                          className={cn('p-4 rounded-lg border', riskColors[misc.risk])}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-text-primary flex-1">{misc.issue}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase">
                              {misc.risk} Risk
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">
                            <strong>Fix:</strong> {misc.fix}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Checklist Tab */}
            {activeTab === 'checklist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">CIS Azure Foundations Benchmark</h3>
                  <span className="text-sm text-text-secondary">
                    {checkedItems.size} of {architecture.cisControls?.length || 0} completed
                  </span>
                </div>
                <div className="space-y-2">
                  {architecture.cisControls?.map((control) => (
                    <button
                      key={control.id}
                      onClick={() => toggleChecklistItem(control.id)}
                      className="w-full p-4 rounded-lg border border-border hover:border-primary/50 transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {checkedItems.has(control.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-severity-low" />
                          ) : (
                            <XCircle className="h-5 w-5 text-text-secondary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-text-secondary">{control.id}</span>
                            <h4 className="font-medium text-text-primary">{control.title}</h4>
                          </div>
                          <p className="text-sm text-text-secondary">{control.implementation}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}

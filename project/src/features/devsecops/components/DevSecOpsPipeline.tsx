'use client';

import { useEffect, useState } from 'react';
import { GitBranch, Loader2, AlertTriangle, Download, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Tabs } from '@/components/ui/Tabs';
import { PipelineVisualization } from './PipelineVisualization';
import { FindingsList } from './FindingsList';
import type { PipelineRun, PipelineStage, SecurityThresholds } from '../types';

type TabId = 'overview' | 'sast' | 'sca' | 'secrets' | 'iac' | 'container' | 'thresholds';

export function DevSecOpsPipeline({ className }: { className?: string }) {
  const [pipelineRun, setPipelineRun] = useState<PipelineRun | null>(null);
  const [thresholds, setThresholds] = useState<SecurityThresholds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  useEffect(() => {
    async function loadPipelineData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/devsecops');
        if (!response.ok) throw new Error('Failed to load pipeline data');
        const data = await response.json();
        setPipelineRun(data.pipelineRun);
        setThresholds(data.securityThresholds);
      } catch (error) {
        console.error('Error loading pipeline data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadPipelineData();
  }, []);

  const handleStageClick = (stage: PipelineStage) => {
    setSelectedStage(stage);
    if (stage.scanResult) {
      const tabMap: Record<string, TabId> = {
        sast: 'sast',
        sca: 'sca',
        secrets: 'secrets',
        iac: 'iac',
        container: 'container',
      };
      setActiveTab(tabMap[stage.scanResult.scanType] || 'overview');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-text-primary">Loading Pipeline Data...</p>
        </div>
      </div>
    );
  }

  if (error || !pipelineRun || !thresholds) {
    return (
      <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-severity-critical mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Data</h3>
        <p className="text-sm text-text-secondary">{error || 'Failed to load pipeline data'}</p>
      </div>
    );
  }

  const scanStages = pipelineRun.stages.filter((s) => s.scanResult);
  const totalFindings = scanStages.reduce((sum, s) => {
    if (!s.scanResult) return sum;
    return sum + Object.values(s.scanResult.summary).reduce((a, b) => a + b, 0);
  }, 0);

  const criticalFindings = scanStages.reduce((sum, s) => sum + (s.scanResult?.summary.critical || 0), 0);
  const highFindings = scanStages.reduce((sum, s) => sum + (s.scanResult?.summary.high || 0), 0);

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
              <GitBranch className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">DevSecOps Pipeline</h1>
            </div>
            <p className="text-text-secondary">
              Security scanning results for {pipelineRun.branch} ({pipelineRun.commit})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'inline-flex items-center px-3 py-1 rounded-md text-sm font-bold uppercase',
              pipelineRun.overallStatus === 'passed'
                ? 'bg-severity-low/20 text-severity-low border border-severity-low/30'
                : pipelineRun.overallStatus === 'failed'
                ? 'bg-severity-critical/20 text-severity-critical border border-severity-critical/30'
                : 'bg-primary/20 text-primary border border-primary/30'
            )}>
              {pipelineRun.overallStatus}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Total Findings</p>
            <p className="text-3xl font-bold text-text-primary">{totalFindings}</p>
          </div>
          <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Critical</p>
            <p className="text-3xl font-bold text-severity-critical">{criticalFindings}</p>
          </div>
          <div className="rounded-lg border border-severity-high/30 bg-severity-high/5 p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">High</p>
            <p className="text-3xl font-bold text-severity-high">{highFindings}</p>
          </div>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Security Gates</p>
            <p className="text-3xl font-bold text-text-primary">
              {Object.values(pipelineRun.securityGates).filter(Boolean).length}/5
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Duration</p>
            <p className="text-3xl font-bold text-text-primary">
              {pipelineRun.stages.reduce((sum, s) => sum + (s.duration || 0), 0)}s
            </p>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="rounded-lg border border-border bg-background-card p-6">
          <PipelineVisualization stages={pipelineRun.stages} onStageClick={handleStageClick} />
        </div>

        {/* Scan Results Tabs */}
        <div className="rounded-lg border border-border bg-background-card p-6">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'sast', label: 'SAST' },
              { id: 'sca', label: 'SCA' },
              { id: 'secrets', label: 'Secrets' },
              { id: 'iac', label: 'IaC' },
              { id: 'container', label: 'Container' },
              { id: 'thresholds', label: 'Thresholds' },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabId)}
            variant="underline"
            className="mb-6"
          />

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Security Gates Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {Object.entries(pipelineRun.securityGates).map(([gate, passed]) => (
                    <div
                      key={gate}
                      className={cn(
                        'p-4 rounded-lg border text-center',
                        passed
                          ? 'border-severity-low/30 bg-severity-low/5'
                          : 'border-severity-critical/30 bg-severity-critical/5'
                      )}
                    >
                      <p className="text-xs text-text-secondary mb-1 uppercase">
                        {gate.replace('Passed', '')}
                      </p>
                      <p className={cn(
                        'text-lg font-bold',
                        passed ? 'text-severity-low' : 'text-severity-critical'
                      )}>
                        {passed ? 'PASS' : 'FAIL'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Scan Summary</h3>
                <div className="space-y-3">
                  {scanStages.map((stage) => {
                    if (!stage.scanResult) return null;
                    const { summary } = stage.scanResult;
                    const total = Object.values(summary).reduce((a, b) => a + b, 0);

                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleStageClick(stage)}
                        className="w-full p-4 rounded-lg border border-border hover:border-primary/50 bg-background transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-primary">{stage.name}</h4>
                          <span className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded uppercase',
                            stage.scanResult.status === 'passed'
                              ? 'bg-severity-low/20 text-severity-low'
                              : stage.scanResult.status === 'failed'
                              ? 'bg-severity-critical/20 text-severity-critical'
                              : 'bg-severity-medium/20 text-severity-medium'
                          )}>
                            {stage.scanResult.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-secondary">{total} findings:</span>
                          {summary.critical > 0 && (
                            <span className="text-severity-critical">{summary.critical} Critical</span>
                          )}
                          {summary.high > 0 && (
                            <span className="text-severity-high">{summary.high} High</span>
                          )}
                          {summary.medium > 0 && (
                            <span className="text-severity-medium">{summary.medium} Medium</span>
                          )}
                          {summary.low > 0 && (
                            <span className="text-severity-low">{summary.low} Low</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sast' && (
            <FindingsList
              findings={pipelineRun.stages.find((s) => s.scanResult?.scanType === 'sast')?.scanResult?.findings || []}
              scanType="sast"
            />
          )}

          {activeTab === 'sca' && (
            <FindingsList
              findings={pipelineRun.stages.find((s) => s.scanResult?.scanType === 'sca')?.scanResult?.findings || []}
              scanType="sca"
            />
          )}

          {activeTab === 'secrets' && (
            <FindingsList
              findings={pipelineRun.stages.find((s) => s.scanResult?.scanType === 'secrets')?.scanResult?.findings || []}
              scanType="secrets"
            />
          )}

          {activeTab === 'iac' && (
            <FindingsList
              findings={pipelineRun.stages.find((s) => s.scanResult?.scanType === 'iac')?.scanResult?.findings || []}
              scanType="iac"
            />
          )}

          {activeTab === 'container' && (
            <FindingsList
              findings={pipelineRun.stages.find((s) => s.scanResult?.scanType === 'container')?.scanResult?.findings || []}
              scanType="container"
            />
          )}

          {activeTab === 'thresholds' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security Thresholds
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Pipeline will fail if findings exceed these thresholds. Adjust thresholds based on your risk appetite.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(thresholds).map(([severity, threshold]) => {
                  const current = scanStages.reduce((sum, s) => {
                    return sum + (s.scanResult?.summary[severity as keyof typeof s.scanResult.summary] || 0);
                  }, 0);
                  const exceeded = current > threshold;

                  return (
                    <div
                      key={severity}
                      className={cn(
                        'p-4 rounded-lg border',
                        exceeded
                          ? 'border-severity-critical/30 bg-severity-critical/5'
                          : 'border-severity-low/30 bg-severity-low/5'
                      )}
                    >
                      <p className="text-xs text-text-secondary mb-2 uppercase">{severity}</p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={cn(
                          'text-2xl font-bold',
                          exceeded ? 'text-severity-critical' : 'text-severity-low'
                        )}>
                          {current}
                        </span>
                        <span className="text-text-secondary">/ {threshold}</span>
                      </div>
                      <div className="h-2 rounded-full bg-background overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all',
                            exceeded ? 'bg-severity-critical' : 'bg-severity-low'
                          )}
                          style={{ width: `${Math.min((current / threshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-2">What-If Analysis</h4>
                <p className="text-sm text-text-secondary">
                  Current configuration: Pipeline <strong className={pipelineRun.overallStatus === 'passed' ? 'text-severity-low' : 'text-severity-critical'}>
                    {pipelineRun.overallStatus.toUpperCase()}
                  </strong> due to threshold violations.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-text-secondary">
                  <li>• Critical threshold: {criticalFindings} findings (threshold: {thresholds.critical}) - {criticalFindings > thresholds.critical ? '❌ EXCEEDED' : '✅ PASS'}</li>
                  <li>• High threshold: {highFindings} findings (threshold: {thresholds.high}) - {highFindings > thresholds.high ? '❌ EXCEEDED' : '✅ PASS'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

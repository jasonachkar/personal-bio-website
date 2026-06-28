'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Download,
  ExternalLink,
  CheckCircle2,
  Loader2,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import type { Threat } from '../types';

// ============================================
// MITRE ATT&CK Navigator Export Component
// ============================================

/**
 * ATT&CK Navigator Layer Format (v4.5)
 * @see https://github.com/mitre-attack/attack-navigator/blob/master/layers/spec/v4.5/layerformat.md
 */
interface NavigatorLayer {
  name: string;
  versions: {
    attack: string;
    navigator: string;
    layer: string;
  };
  domain: string;
  description: string;
  filters: {
    platforms: string[];
  };
  sorting: number;
  layout: {
    layout: string;
    aggregateFunction: string;
    showID: boolean;
    showName: boolean;
    showAggregateScores: boolean;
    countUnscored: boolean;
  };
  hideDisabled: boolean;
  techniques: Array<{
    techniqueID: string;
    tactic: string;
    color: string;
    comment: string;
    enabled: boolean;
    metadata: Array<{ name: string; value: string }>;
    score: number;
  }>;
  gradient: {
    colors: string[];
    minValue: number;
    maxValue: number;
  };
  legendItems: Array<{
    label: string;
    color: string;
  }>;
  metadata: Array<{ name: string; value: string }>;
  showTacticRowBackground: boolean;
  tacticRowBackground: string;
  selectTechniquesAcrossTactics: boolean;
  selectSubtechniquesWithParent: boolean;
}

interface MitreNavigatorExportProps {
  /** Threats with MITRE mappings */
  threats: Threat[];
  /** Project name for the layer */
  projectName: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Severity to color mapping
 */
const severityColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

/**
 * MitreNavigatorExport Component
 * @description Exports threat mappings as ATT&CK Navigator layers
 */
export function MitreNavigatorExport({
  threats,
  projectName,
  className,
}: MitreNavigatorExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract unique techniques from threats
  const techniques = threats.flatMap(threat => {
    if (!threat.mitreTechniques) return [];
    return threat.mitreTechniques.map(tech => ({
      techniqueID: tech,
      threat,
    }));
  });

  // Count techniques by ID
  const techniqueCounts = techniques.reduce((acc, { techniqueID, threat }) => {
    if (!acc[techniqueID]) {
      acc[techniqueID] = { count: 0, maxSeverity: 'low', threats: [] };
    }
    acc[techniqueID].count++;
    acc[techniqueID].threats.push(threat.title);
    
    // Track max severity
    const severityOrder = ['low', 'medium', 'high', 'critical'];
    if (severityOrder.indexOf(threat.severity) > severityOrder.indexOf(acc[techniqueID].maxSeverity)) {
      acc[techniqueID].maxSeverity = threat.severity;
    }
    
    return acc;
  }, {} as Record<string, { count: number; maxSeverity: string; threats: string[] }>);

  /**
   * Generate ATT&CK Navigator Layer
   */
  const generateLayer = (): NavigatorLayer => {
    const layer: NavigatorLayer = {
      name: `${projectName} - Threat Coverage`,
      versions: {
        attack: '14',
        navigator: '4.9.1',
        layer: '4.5',
      },
      domain: 'enterprise-attack',
      description: `Threat model coverage for ${projectName}. Generated from ${threats.length} identified threats.`,
      filters: {
        platforms: ['Windows', 'Linux', 'macOS', 'Azure AD', 'Office 365', 'SaaS', 'IaaS'],
      },
      sorting: 0,
      layout: {
        layout: 'side',
        aggregateFunction: 'average',
        showID: true,
        showName: true,
        showAggregateScores: true,
        countUnscored: false,
      },
      hideDisabled: false,
      techniques: Object.entries(techniqueCounts).map(([techId, data]) => ({
        techniqueID: techId,
        tactic: '',
        color: severityColors[data.maxSeverity] || '#3b82f6',
        comment: `Threats: ${data.threats.join(', ')}`,
        enabled: true,
        metadata: [
          { name: 'threat_count', value: data.count.toString() },
          { name: 'max_severity', value: data.maxSeverity },
        ],
        score: data.count,
      })),
      gradient: {
        colors: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
        minValue: 0,
        maxValue: 5,
      },
      legendItems: [
        { label: 'Critical', color: '#dc2626' },
        { label: 'High', color: '#ef4444' },
        { label: 'Medium', color: '#f59e0b' },
        { label: 'Low', color: '#10b981' },
      ],
      metadata: [
        { name: 'project', value: projectName },
        { name: 'generated', value: new Date().toISOString() },
        { name: 'total_threats', value: threats.length.toString() },
      ],
      showTacticRowBackground: true,
      tacticRowBackground: '#1a1a2e',
      selectTechniquesAcrossTactics: true,
      selectSubtechniquesWithParent: false,
    };

    return layer;
  };

  /**
   * Download layer as JSON
   */
  const handleDownload = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const layer = generateLayer();
    const json = JSON.stringify(layer, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-attack-layer.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setGenerating(false);
    setIsOpen(false);
  };

  /**
   * Copy layer JSON to clipboard
   */
  const handleCopy = async () => {
    const layer = generateLayer();
    const json = JSON.stringify(layer, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const uniqueTechniques = Object.keys(techniqueCounts).length;
  const coveragePercent = Math.min(Math.round((uniqueTechniques / 200) * 100), 100);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Shield className="h-4 w-4 mr-1.5" />
        ATT&CK Export
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                'relative w-full max-w-lg',
                'rounded-2xl border border-border bg-background-card',
                'shadow-2xl overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      MITRE ATT&CK Navigator
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Export layer for visualization
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Coverage Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-background-elevated text-center">
                    <p className="text-2xl font-bold text-primary">{threats.length}</p>
                    <p className="text-xs text-text-secondary">Threats</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-elevated text-center">
                    <p className="text-2xl font-bold text-accent">{uniqueTechniques}</p>
                    <p className="text-xs text-text-secondary">Techniques</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-elevated text-center">
                    <p className="text-2xl font-bold text-secondary">{coveragePercent}%</p>
                    <p className="text-xs text-text-secondary">Coverage</p>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div className="p-4 rounded-lg bg-background-elevated">
                  <p className="text-sm font-medium text-text-primary mb-3">Severity Distribution</p>
                  <div className="space-y-2">
                    {['critical', 'high', 'medium', 'low'].map(severity => {
                      const count = threats.filter(t => t.severity === severity).length;
                      const percent = threats.length > 0 ? (count / threats.length) * 100 : 0;
                      return (
                        <div key={severity} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: severityColors[severity] }}
                          />
                          <span className="text-xs text-text-secondary capitalize flex-1">
                            {severity}
                          </span>
                          <span className="text-xs font-medium text-text-primary">{count}</span>
                          <div className="w-20 h-1.5 rounded-full bg-background overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: severityColors[severity],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-text-secondary">
                    Import the generated JSON into the{' '}
                    <a
                      href="https://mitre-attack.github.io/attack-navigator/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      ATT&CK Navigator
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {' '}to visualize your threat coverage.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 p-5 border-t border-border bg-background-elevated/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1.5 text-severity-low" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy JSON
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1.5" />
                        Download Layer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MitreNavigatorExport;

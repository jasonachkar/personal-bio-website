'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, FileCode, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ScanFinding, Severity } from '../types';

interface FindingsListProps {
  findings: ScanFinding[];
  scanType: string;
  className?: string;
}

const severityColors = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
  info: 'text-text-secondary bg-background border-border',
};

const scanTypeLabels = {
  sast: 'Static Application Security Testing',
  sca: 'Software Composition Analysis',
  secrets: 'Secrets Detection',
  iac: 'Infrastructure as Code Security',
  container: 'Container Security Scan',
};

function FindingCard({ finding }: { finding: ScanFinding }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-lg border overflow-hidden', severityColors[finding.severity])}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-4 hover:bg-background/20 transition-colors text-left"
      >
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-current" />
          ) : (
            <ChevronRight className="h-5 w-5 text-current" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-text-primary">{finding.title}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border uppercase flex-shrink-0">
              {finding.severity}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-2">{finding.description}</p>

          {finding.file && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <FileCode className="h-3 w-3" />
              <span>{finding.file}</span>
              {finding.line && <span>Line {finding.line}</span>}
            </div>
          )}

          {finding.cvss && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-text-secondary">CVSS Score:</span>
              <span className={cn(
                'text-xs font-bold px-2 py-0.5 rounded',
                finding.cvss >= 9 ? 'bg-severity-critical/20 text-severity-critical' :
                finding.cvss >= 7 ? 'bg-severity-high/20 text-severity-high' :
                finding.cvss >= 4 ? 'bg-severity-medium/20 text-severity-medium' :
                'bg-severity-low/20 text-severity-low'
              )}>
                {finding.cvss.toFixed(1)}
              </span>
              {finding.cwe && (
                <span className="text-xs text-text-secondary ml-2">{finding.cwe}</span>
              )}
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-current/20"
          >
            <div className="p-4 space-y-4 bg-background/10">
              {finding.code && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Vulnerable Code
                  </h4>
                  <pre className="p-3 rounded-lg bg-background border border-border text-xs text-text-secondary overflow-x-auto">
                    <code>{finding.code}</code>
                  </pre>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Recommendation
                </h4>
                <p className="text-sm text-text-secondary">{finding.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FindingsList({ findings, scanType, className }: FindingsListProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredFindings = findings.filter((finding) => {
    if (filterSeverity !== 'all' && finding.severity !== filterSeverity) return false;
    return true;
  });

  const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {scanTypeLabels[scanType as keyof typeof scanTypeLabels]} Results
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {filteredFindings.length} finding{filteredFindings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Severities</option>
          {severities.map((sev) => (
            <option key={sev} value={sev}>
              {sev.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="rounded-lg border border-border bg-background-card p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No findings found with current filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
}

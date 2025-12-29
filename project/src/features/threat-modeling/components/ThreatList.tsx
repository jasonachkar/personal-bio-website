'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { Threat, Mitigation } from '../types';

interface ThreatListProps {
  threats: Threat[];
  mitigations: Mitigation[];
  onThreatClick?: (threat: Threat) => void;
  className?: string;
}

const categoryColors = {
  spoofing: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  tampering: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  repudiation: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  'information-disclosure': 'text-severity-high bg-severity-high/10 border-severity-high/30',
  'denial-of-service': 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  'elevation-of-privilege': 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
};

const severityColors = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
};

function ThreatCard({ threat, mitigations }: { threat: Threat; mitigations: Mitigation[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const threatMitigations = mitigations.filter((m) => m.threatId === threat.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-lg border overflow-hidden', categoryColors[threat.category])}
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
            <h3 className="font-semibold text-text-primary">{threat.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border uppercase',
                  severityColors[threat.severity]
                )}
              >
                {threat.severity}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-background/50 text-text-secondary border border-border uppercase">
                {threat.category.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          <p className="text-sm text-text-secondary mb-3">{threat.description}</p>

          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>Likelihood: {threat.likelihood}</span>
            <span>Impact: {threat.impact}</span>
            <span>{threatMitigations.length} mitigation{threatMitigations.length !== 1 ? 's' : ''}</span>
          </div>
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
              {/* MITRE ATT&CK */}
              {(threat.mitreTactics || threat.mitreTechniques) && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    MITRE ATT&CK Framework
                  </h4>
                  <div className="space-y-2">
                    {threat.mitreTactics && threat.mitreTactics.length > 0 && (
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Tactics:</p>
                        <div className="flex flex-wrap gap-2">
                          {threat.mitreTactics.map((tactic) => (
                            <span
                              key={tactic}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                            >
                              {tactic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {threat.mitreTechniques && threat.mitreTechniques.length > 0 && (
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Techniques:</p>
                        <div className="flex flex-wrap gap-2">
                          {threat.mitreTechniques.map((technique) => (
                            <span
                              key={technique}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30"
                            >
                              {technique}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mitigations */}
              {threatMitigations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Mitigations</h4>
                  <div className="space-y-2">
                    {threatMitigations.map((mitigation) => (
                      <div
                        key={mitigation.id}
                        className="p-3 rounded-lg bg-background-card border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-sm font-medium text-text-primary flex items-center gap-2">
                            {mitigation.implemented && (
                              <span className="text-severity-low">✓</span>
                            )}
                            {mitigation.title}
                          </h5>
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                              mitigation.implemented
                                ? 'bg-severity-low/20 text-severity-low'
                                : 'bg-text-secondary/20 text-text-secondary'
                            )}
                          >
                            {mitigation.implemented ? 'Implemented' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mb-2">{mitigation.description}</p>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span>Priority: {mitigation.priority}</span>
                          <span>Effort: {mitigation.effort}</span>
                          <span>Effectiveness: {mitigation.effectiveness}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ThreatList({ threats, mitigations, className }: ThreatListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredThreats = threats.filter((threat) => {
    if (filterCategory !== 'all' && threat.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && threat.severity !== filterSeverity) return false;
    return true;
  });

  const categories = Array.from(new Set(threats.map((t) => t.category)));
  const severities = ['critical', 'high', 'medium', 'low'];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">
          Identified Threats ({filteredThreats.length})
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Severities</option>
            {severities.map((sev) => (
              <option key={sev} value={sev}>
                {sev.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredThreats.length === 0 ? (
        <div className="rounded-lg border border-border bg-background-card p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No threats found with current filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} mitigations={mitigations} />
          ))}
        </div>
      )}
    </div>
  );
}

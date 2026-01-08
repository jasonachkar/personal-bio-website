'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { Threat, MitreTechniqueDetails, CVE } from '../types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants } from '@/utils/animations';

interface ThreatDetailsViewerProps {
  threat: Threat;
  className?: string;
}

export function ThreatDetailsViewer({ threat, className }: ThreatDetailsViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mitreDetails, setMitreDetails] = useState<MitreTechniqueDetails[]>([]);
  const [cves, setCves] = useState<CVE[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!threat.mitreTechniques || threat.mitreTechniques.length === 0) return;

      setLoading(true);
      try {
        // Load MITRE technique details
        const techniquePromises = threat.mitreTechniques.map(techId =>
          fetch(`/api/threat-modeling/mitre?techniqueId=${techId}`)
            .then(res => res.json())
            .then(data => data.technique)
            .catch(() => null)
        );
        const techniques = await Promise.all(techniquePromises);
        setMitreDetails(techniques.filter(Boolean));

        // Load related CVEs (simplified - would need component technology)
        // For now, we'll skip CVE loading as it requires component context
      } catch (error) {
        console.error('Error loading threat details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [threat]);

  const severityColors = {
    critical: 'text-severity-critical bg-severity-critical/20 border-severity-critical/30',
    high: 'text-severity-high bg-severity-high/20 border-severity-high/30',
    medium: 'text-severity-medium bg-severity-medium/20 border-severity-medium/30',
    low: 'text-severity-low bg-severity-low/20 border-severity-low/30',
  };

  return (
    <Card className={cn('p-6', className)}>
      <motion.div
        variants={prefersReducedMotion ? {} : scrollVariants.fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Threat Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary mb-2">{threat.title}</h3>
            <p className="text-sm text-text-secondary mb-4">{threat.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn('px-3 py-1 rounded-lg text-xs font-bold border', severityColors[threat.severity])}>
                {threat.severity.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-background-elevated border border-border text-text-secondary">
                {threat.category.replace(/-/g, ' ').toUpperCase()}
              </span>
              <span className="text-xs text-text-secondary">
                Likelihood: {threat.likelihood} | Impact: {threat.impact}
              </span>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Details */}
        {threat.mitreTactics && threat.mitreTactics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              MITRE ATT&CK Framework
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary mb-2">Tactics:</p>
                <div className="flex flex-wrap gap-2">
                  {threat.mitreTactics.map((tactic) => (
                    <span
                      key={tactic}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                    >
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
              {threat.mitreTechniques && threat.mitreTechniques.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2">Techniques:</p>
                  <div className="flex flex-wrap gap-2">
                    {threat.mitreTechniques.map((technique) => (
                      <a
                        key={technique}
                        href={`https://attack.mitre.org/techniques/${technique}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30 transition-colors"
                      >
                        {technique}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MITRE Technique Details */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-text-secondary">Loading technique details...</p>
          </div>
        )}

        {mitreDetails.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Technique Details</h4>
            <div className="space-y-3">
              {mitreDetails.map((technique) => (
                <div
                  key={technique.id}
                  className="p-4 rounded-lg border border-border bg-background-elevated"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-semibold text-text-primary">{technique.name}</h5>
                    <a
                      href={technique.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View on MITRE
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">{technique.description}</p>
                  {technique.detection && technique.detection.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-text-secondary mb-1">Detection:</p>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {technique.detection.map((det, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{det.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {technique.mitigation && technique.mitigation.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-text-secondary mb-1">Mitigation:</p>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {technique.mitigation.map((mit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Shield className="h-3 w-3 mt-0.5 flex-shrink-0 text-severity-low" />
                            <span>{mit.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related CVEs */}
        {cves.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-severity-high" />
              Related CVEs
            </h4>
            <div className="space-y-2">
              {cves.map((cve) => (
                <div
                  key={cve.id}
                  className="p-3 rounded-lg border border-border bg-background-elevated"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold text-text-primary">{cve.id}</span>
                    {cve.cvssScore && (
                      <span className="text-xs font-medium text-text-secondary">
                        CVSS: {cve.cvssScore}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{cve.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Card>
  );
}


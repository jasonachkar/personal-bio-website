'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { ThreatModelComponent, MitreTechnique, CVE } from '../types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants } from '@/utils/animations';

interface ThreatIntelligencePanelProps {
  component?: ThreatModelComponent;
  className?: string;
}

export function ThreatIntelligencePanel({ component, className }: ThreatIntelligencePanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [recentCVEs, setRecentCVEs] = useState<CVE[]>([]);
  const [mitreTechniques, setMitreTechniques] = useState<MitreTechnique[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (component) {
      loadIntelligence();
    }
  }, [component]);

  async function loadIntelligence() {
    if (!component) return;

    setLoading(true);
    try {
      // Load MITRE techniques
      const mitreResponse = await fetch('/api/threat-modeling/mitre?platform=enterprise');
      if (mitreResponse.ok) {
        const mitreData = await mitreResponse.json();
        setMitreTechniques(mitreData.techniques?.slice(0, 5) || []);
      }

      // Load CVEs for component technology
      if (component.metadata?.technology) {
        const cveResponse = await fetch(
          `/api/threat-modeling/cve?technology=${encodeURIComponent(component.metadata.technology)}`
        );
        if (cveResponse.ok) {
          const cveData = await cveResponse.json();
          setRecentCVEs(cveData.cves?.slice(0, 5) || []);
        }
      }
    } catch (error) {
      console.error('Error loading threat intelligence:', error);
    } finally {
      setLoading(false);
    }
  }

  const variants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  return (
    <Card className={cn('p-6', className)}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Threat Intelligence</h3>
          </div>
          <button
            onClick={loadIntelligence}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-background-elevated transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={cn('h-4 w-4 text-text-secondary', loading && 'animate-spin')} />
          </button>
        </div>

        {component && (
          <div className="text-sm text-text-secondary">
            Intelligence for: <span className="text-text-primary font-medium">{component.name}</span>
          </div>
        )}

        {/* Recent CVEs */}
        {recentCVEs.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-severity-high" />
              Recent CVEs
            </h4>
            <div className="space-y-2">
              {recentCVEs.map((cve) => (
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
                  <p className="text-xs text-text-secondary line-clamp-2">{cve.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MITRE Techniques */}
        {mitreTechniques.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Active MITRE ATT&CK Techniques
            </h4>
            <div className="space-y-2">
              {mitreTechniques.map((technique) => (
                <a
                  key={technique.id}
                  href={technique.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background-elevated hover:bg-background-card transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary mb-1">
                      {technique.id}: {technique.name}
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-1">{technique.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {!loading && recentCVEs.length === 0 && mitreTechniques.length === 0 && (
          <div className="text-center py-8 text-sm text-text-secondary">
            No threat intelligence available
          </div>
        )}
      </motion.div>
    </Card>
  );
}


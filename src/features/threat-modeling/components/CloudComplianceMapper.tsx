'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { CloudProvider, ComplianceStatus } from '../types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants } from '@/utils/animations';

interface CloudComplianceMapperProps {
  provider: CloudProvider;
  threats: Array<{ id: string; severity: string; category: string }>;
  className?: string;
}

export function CloudComplianceMapper({ provider, threats, className }: CloudComplianceMapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const [compliance, setCompliance] = useState<ComplianceStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompliance();
  }, [provider]);

  async function loadCompliance() {
    setLoading(true);
    try {
      const response = await fetch(`/api/threat-modeling/cloud-security?provider=${provider}&compliance=true`);
      if (response.ok) {
        const data = await response.json();
        setCompliance(data.compliance || []);
      }
    } catch (error) {
      console.error('Error loading compliance:', error);
    } finally {
      setLoading(false);
    }
  }

  const variants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-severity-low';
    if (score >= 70) return 'text-severity-medium';
    if (score >= 50) return 'text-severity-high';
    return 'text-severity-critical';
  };

  return (
    <Card className={cn('p-6', className)}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Compliance Mapping</h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-sm text-text-secondary">Loading compliance status...</div>
        ) : compliance.length > 0 ? (
          <div className="space-y-4">
            {compliance.map((status) => (
              <div
                key={status.framework}
                className="p-4 rounded-lg border border-border bg-background-elevated"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-text-primary">{status.framework}</h4>
                  <div className={cn('text-2xl font-bold', getScoreColor(status.score))}>
                    {status.score}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Passed</span>
                    <span className="text-severity-low font-medium">{status.passed}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Failed</span>
                    <span className="text-severity-high font-medium">{status.failed}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background-card overflow-hidden">
                    <div
                      className="h-full bg-severity-low transition-all"
                      style={{ width: `${(status.passed / status.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-text-secondary">
            No compliance data available
          </div>
        )}
      </motion.div>
    </Card>
  );
}


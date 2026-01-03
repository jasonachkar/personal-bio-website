'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ImpactMetrics as ImpactMetricsType } from '../types';

interface ImpactMetricsProps {
  metrics: ImpactMetricsType;
}

export function ImpactMetrics({ metrics }: ImpactMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Before/After Comparison */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-text-muted mb-3">Before</h4>
          <div className="space-y-2 rounded-lg border border-border bg-background-elevated p-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Incidents/Month</span>
              <span className="font-semibold text-text-primary">{metrics.before.incidentsPerMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Compliance Score</span>
              <span className="font-semibold text-text-primary">{metrics.before.complianceScore}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Avg Response Time</span>
              <span className="font-semibold text-text-primary">{metrics.before.avgResponseTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Vulnerabilities</span>
              <span className="font-semibold text-text-primary">{metrics.before.vulnerabilities}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-muted mb-3">After</h4>
          <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Incidents/Month</span>
              <span className="font-semibold text-severity-low">{metrics.after.incidentsPerMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Compliance Score</span>
              <span className="font-semibold text-severity-low">{metrics.after.complianceScore}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Avg Response Time</span>
              <span className="font-semibold text-severity-low">{metrics.after.avgResponseTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Vulnerabilities</span>
              <span className="font-semibold text-severity-low">{metrics.after.vulnerabilities}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div>
        <h4 className="text-sm font-semibold text-text-muted mb-3">Improvements</h4>
        <div className="space-y-3">
          {Object.entries(metrics.improvement).map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between rounded-lg border border-border bg-background-elevated p-4"
            >
              <span className="text-sm text-text-secondary capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-severity-low" />
                <span className="text-lg font-bold text-severity-low">{value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


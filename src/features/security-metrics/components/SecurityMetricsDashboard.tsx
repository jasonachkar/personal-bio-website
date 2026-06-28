'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Search, CheckCircle2, Clock, Target } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { mockSecurityMetrics } from '../data';
import { scrollVariants, staggerContainer, viewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export function SecurityMetricsDashboard({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const metrics = mockSecurityMetrics;

  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);

  const mitrePercentage = Math.round(
    (metrics.mitreCoverage.tactics / metrics.mitreCoverage.totalTactics) * 100
  );

  const metricsCards = [
    {
      label: 'Incidents Blocked',
      value: metrics.incidentsBlocked.toLocaleString(),
      trend: 'up' as const,
      trendValue: '+12%',
      icon: <Shield className="h-5 w-5" />,
      description: 'Security incidents prevented',
    },
    {
      label: 'Vulnerabilities Found',
      value: metrics.vulnerabilitiesFound,
      trend: 'down' as const,
      trendValue: '-8%',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'Issues identified and remediated',
    },
    {
      label: 'Detection Rules',
      value: metrics.detectionsCreated,
      trend: 'up' as const,
      trendValue: '+5',
      icon: <Search className="h-5 w-5" />,
      description: 'Custom KQL detection rules',
    },
    {
      label: 'Compliance Score',
      value: `${metrics.complianceScore}%`,
      trend: 'up' as const,
      trendValue: '+4%',
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: 'CIS Benchmark compliance',
    },
    {
      label: 'Avg Response Time',
      value: metrics.avgResponseTime,
      trend: 'down' as const,
      trendValue: '-0.5 min',
      icon: <Clock className="h-5 w-5" />,
      description: 'Mean time to respond',
    },
    {
      label: 'MITRE Coverage',
      value: `${mitrePercentage}%`,
      trend: 'up' as const,
      trendValue: `${metrics.mitreCoverage.tactics}/${metrics.mitreCoverage.totalTactics} tactics`,
      icon: <Target className="h-5 w-5" />,
      description: `${metrics.mitreCoverage.techniques} techniques covered`,
    },
  ];

  return (
    <div className={cn('py-20', className)}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="text-center mb-12"
        >
          <h2 className="text-headline font-bold text-text-primary mb-4">
            Security Impact Metrics
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Quantifiable results demonstrating real-world security expertise and measurable impact
            on organizational security posture.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {metricsCards.map((card, index) => (
            <MetricsCard key={card.label} {...card} />
          ))}
        </motion.div>

        {/* MITRE ATT&CK Coverage Visualization */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          className="rounded-xl border border-border bg-background-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-text-primary">MITRE ATT&CK Coverage</h3>
            <span className="text-sm text-text-secondary">
              {metrics.mitreCoverage.tactics} of {metrics.mitreCoverage.totalTactics} Tactics
            </span>
          </div>
          <div className="w-full bg-background-elevated rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${mitrePercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-3 bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <p className="text-sm text-text-secondary">
            Coverage across {metrics.mitreCoverage.techniques} attack techniques with custom detection rules
          </p>
        </motion.div>
      </div>
    </div>
  );
}


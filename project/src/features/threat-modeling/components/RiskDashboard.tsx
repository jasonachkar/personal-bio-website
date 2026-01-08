'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, AlertTriangle, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { Threat, RiskScore } from '../types';
import { calculateRiskScore } from '../utils/threatAnalyzer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants } from '@/utils/animations';

interface RiskDashboardProps {
  threats: Threat[];
  className?: string;
}

export function RiskDashboard({ threats, className }: RiskDashboardProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  const riskScores = useMemo(() => {
    return threats.map(threat => calculateRiskScore(threat));
  }, [threats]);

  const overallRisk = useMemo(() => {
    if (riskScores.length === 0) return 0;
    const avg = riskScores.reduce((sum, score) => sum + score.overall, 0) / riskScores.length;
    return Math.round(avg * 10) / 10;
  }, [riskScores]);

  const ciaScores = useMemo(() => {
    if (riskScores.length === 0) return { confidentiality: 0, integrity: 0, availability: 0 };
    return {
      confidentiality: Math.round(
        (riskScores.reduce((sum, score) => sum + score.confidentiality, 0) / riskScores.length) * 10
      ) / 10,
      integrity: Math.round(
        (riskScores.reduce((sum, score) => sum + score.integrity, 0) / riskScores.length) * 10
      ) / 10,
      availability: Math.round(
        (riskScores.reduce((sum, score) => sum + score.availability, 0) / riskScores.length) * 10
      ) / 10,
    };
  }, [riskScores]);

  const threatDistribution = useMemo(() => {
    const distribution = {
      critical: threats.filter(t => t.severity === 'critical').length,
      high: threats.filter(t => t.severity === 'high').length,
      medium: threats.filter(t => t.severity === 'medium').length,
      low: threats.filter(t => t.severity === 'low').length,
    };
    return distribution;
  }, [threats]);

  const getRiskColor = (score: number) => {
    if (score >= 7.5) return 'text-severity-critical';
    if (score >= 5) return 'text-severity-high';
    if (score >= 2.5) return 'text-severity-medium';
    return 'text-severity-low';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 7.5) return 'bg-severity-critical/20 border-severity-critical/30';
    if (score >= 5) return 'bg-severity-high/20 border-severity-high/30';
    if (score >= 2.5) return 'bg-severity-medium/20 border-severity-medium/30';
    return 'bg-severity-low/20 border-severity-low/30';
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
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Risk Dashboard</h3>
        </div>

        {/* Overall Risk Score */}
        <div className={cn('p-6 rounded-lg border-2 text-center', getRiskBgColor(overallRisk))}>
          <div className="text-sm text-text-secondary mb-2">Overall Risk Score</div>
          <div className={cn('text-4xl font-bold mb-2', getRiskColor(overallRisk))}>
            {overallRisk.toFixed(1)}/10
          </div>
          <div className="text-xs text-text-secondary">
            Based on {threats.length} identified threats
          </div>
        </div>

        {/* CIA Triad Scores */}
        <div className="grid grid-cols-3 gap-4">
          {(['confidentiality', 'integrity', 'availability'] as const).map((metric) => {
            const score = ciaScores[metric];
            return (
              <div
                key={metric}
                className={cn('p-4 rounded-lg border text-center', getRiskBgColor(score))}
              >
                <div className="text-xs text-text-secondary mb-1 capitalize">{metric}</div>
                <div className={cn('text-2xl font-bold', getRiskColor(score))}>
                  {score.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Threat Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Threat Distribution</h4>
          <div className="space-y-2">
            {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
              const count = threatDistribution[severity];
              const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0;
              return (
                <div key={severity} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary capitalize">{severity}</span>
                    <span className="text-text-primary font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background-card overflow-hidden">
                    <motion.div
                      className={cn('h-full', {
                        'bg-severity-critical': severity === 'critical',
                        'bg-severity-high': severity === 'high',
                        'bg-severity-medium': severity === 'medium',
                        'bg-severity-low': severity === 'low',
                      })}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Card>
  );
}


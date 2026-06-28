'use client';

import { Shield, AlertTriangle, Activity, FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { SecurityEvent, DetectionResult } from '../types';

interface StatsOverviewProps {
  events: SecurityEvent[];
  detections: DetectionResult[];
  className?: string;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low';
  className?: string;
}

const variantStyles = {
  default: 'border-border bg-background-card',
  critical: 'border-severity-critical/30 bg-severity-critical/5',
  high: 'border-severity-high/30 bg-severity-high/5',
  medium: 'border-severity-medium/30 bg-severity-medium/5',
  low: 'border-severity-low/30 bg-severity-low/5',
};

const iconColors = {
  default: 'text-text-secondary',
  critical: 'text-severity-critical',
  high: 'text-severity-high',
  medium: 'text-severity-medium',
  low: 'text-severity-low',
};

function StatCard({ icon: Icon, label, value, variant = 'default', className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-lg border p-6',
        'transition-all duration-200 hover:shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg bg-background', iconColors[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export function StatsOverview({ events, detections, className }: StatsOverviewProps) {
  const stats = {
    totalEvents: events.length,
    totalDetections: detections.length,
    criticalDetections: detections.filter((d) => d.severity === 'critical').length,
    highDetections: detections.filter((d) => d.severity === 'high').length,
    mediumDetections: detections.filter((d) => d.severity === 'medium').length,
    lowDetections: detections.filter((d) => d.severity === 'low').length,
    criticalEvents: events.filter((e) => e.severity === 'critical').length,
    highEvents: events.filter((e) => e.severity === 'high').length,
    mediumEvents: events.filter((e) => e.severity === 'medium').length,
    lowEvents: events.filter((e) => e.severity === 'low').length,
    totalMatchedEvents: detections.reduce((sum, d) => sum + d.matchedEvents.length, 0),
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      <StatCard
        icon={Activity}
        label="Total Events"
        value={stats.totalEvents}
        variant="default"
      />

      <StatCard
        icon={FileSearch}
        label="Detections Triggered"
        value={stats.totalDetections}
        variant={stats.totalDetections > 0 ? 'high' : 'default'}
      />

      <StatCard
        icon={AlertTriangle}
        label="Critical Detections"
        value={stats.criticalDetections}
        variant={stats.criticalDetections > 0 ? 'critical' : 'default'}
      />

      <StatCard
        icon={Shield}
        label="Events Matched"
        value={stats.totalMatchedEvents}
        variant={stats.totalMatchedEvents > 0 ? 'medium' : 'default'}
      />

      {/* Severity Breakdown */}
      <div className="col-span-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border border-border bg-background-card p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Event Severity Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-severity-critical">{stats.criticalEvents}</p>
              <p className="text-sm text-text-secondary mt-1">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-severity-high">{stats.highEvents}</p>
              <p className="text-sm text-text-secondary mt-1">High</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-severity-medium">{stats.mediumEvents}</p>
              <p className="text-sm text-text-secondary mt-1">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-severity-low">{stats.lowEvents}</p>
              <p className="text-sm text-text-secondary mt-1">Low</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

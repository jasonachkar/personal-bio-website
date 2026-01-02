'use client';

import { CheckCircle2, XCircle, Clock, Circle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { PipelineStage } from '../types';

interface PipelineVisualizationProps {
  stages: PipelineStage[];
  onStageClick?: (stage: PipelineStage) => void;
  className?: string;
}

const statusIcons = {
  passed: CheckCircle2,
  failed: XCircle,
  running: Clock,
  pending: Circle,
  skipped: Circle,
};

const statusColors = {
  passed: 'text-severity-low bg-severity-low/10 border-severity-low/30',
  failed: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  running: 'text-primary bg-primary/10 border-primary/30',
  pending: 'text-text-secondary bg-background border-border',
  skipped: 'text-text-secondary bg-background border-border opacity-50',
};

export function PipelineVisualization({ stages, onStageClick, className }: PipelineVisualizationProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <h3 className="text-lg font-semibold text-text-primary">Pipeline Flow</h3>

      <div className="relative">
        {/* Desktop horizontal view */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2">
          {stages.map((stage, index) => {
            const StatusIcon = statusIcons[stage.status];

            return (
              <div key={stage.id} className="flex items-center flex-shrink-0" style={{ minWidth: '140px', maxWidth: '180px' }}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onStageClick?.(stage)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 transition-all text-left',
                    statusColors[stage.status],
                    'hover:scale-105 cursor-pointer'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', stage.status === 'running' && 'animate-spin')} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 break-words">{stage.name}</h4>
                      {stage.duration !== undefined && stage.duration > 0 && (
                        <p className="text-xs opacity-75">{stage.duration}s</p>
                      )}
                    </div>
                  </div>

                  {stage.scanResult && (
                    <div className="mt-2 flex items-center gap-1 text-xs flex-wrap">
                      {stage.scanResult.summary.critical > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-severity-critical/20 text-severity-critical">
                          {stage.scanResult.summary.critical} Critical
                        </span>
                      )}
                      {stage.scanResult.summary.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-severity-high/20 text-severity-high">
                          {stage.scanResult.summary.high} High
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>

                {index < stages.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-text-secondary mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile vertical view */}
        <div className="md:hidden space-y-3">
          {stages.map((stage, index) => {
            const StatusIcon = statusIcons[stage.status];

            return (
              <motion.button
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onStageClick?.(stage)}
                className={cn(
                  'w-full p-4 rounded-lg border-2 transition-all text-left',
                  statusColors[stage.status]
                )}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', stage.status === 'running' && 'animate-spin')} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{stage.name}</h4>
                    {stage.duration !== undefined && stage.duration > 0 && (
                      <p className="text-xs opacity-75">{stage.duration}s</p>
                    )}
                    {stage.scanResult && (
                      <div className="mt-2 flex items-center gap-1 text-xs flex-wrap">
                        {stage.scanResult.summary.critical > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-severity-critical/20 text-severity-critical">
                            {stage.scanResult.summary.critical} Critical
                          </span>
                        )}
                        {stage.scanResult.summary.high > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-severity-high/20 text-severity-high">
                            {stage.scanResult.summary.high} High
                          </span>
                        )}
                        {stage.scanResult.summary.medium > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-severity-medium/20 text-severity-medium">
                            {stage.scanResult.summary.medium} Medium
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

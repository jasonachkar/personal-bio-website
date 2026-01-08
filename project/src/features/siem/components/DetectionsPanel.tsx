'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Shield, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { DetectionResult } from '../types';

interface DetectionsPanelProps {
  detections: DetectionResult[];
  onEventClick: (eventId: string) => void;
  className?: string;
}

const severityColors = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
};

const severityIcons = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Shield,
  low: Shield,
};

function DetectionCard({ detection, onEventClick }: { detection: DetectionResult; onEventClick: (eventId: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const SeverityIcon = severityIcons[detection.severity];

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border overflow-hidden',
        severityColors[detection.severity]
      )}
    >
      {/* Header */}
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
            <div className="flex items-center gap-2">
              <SeverityIcon className="h-5 w-5 flex-shrink-0" />
              <h3 className="font-semibold text-text-primary">{detection.ruleName}</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-background/50 whitespace-nowrap">
              {detection.severity.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-3">{detection.description}</p>

          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {detection.matchedEvents.length} event{detection.matchedEvents.length !== 1 ? 's' : ''}
            </span>
            <span>Triggered: {formatTimestamp(detection.triggeredAt)}</span>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
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
              {/* MITRE ATT&CK Mapping */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  MITRE ATT&CK Framework
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Tactics:</p>
                    <div className="flex flex-wrap gap-2">
                      {detection.mitre.tactics.map((tactic) => (
                        <span
                          key={tactic}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                        >
                          {tactic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Techniques:</p>
                    <div className="flex flex-wrap gap-2">
                      {detection.mitre.techniques.map((technique) => (
                        <span
                          key={technique}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {detection.recommendations && detection.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-1">
                    {detection.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Matched Events */}
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  Matched Events ({detection.matchedEvents.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {detection.matchedEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event.id)}
                      className="w-full p-3 rounded-lg bg-background-card border border-border hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text-primary">
                          {event.eventType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {event.actor.username || event.actor.hostname} → {event.target?.resource || event.details.action}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DetectionsPanel({ detections, onEventClick, className }: DetectionsPanelProps) {
  if (detections.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-background-card p-12 text-center', className)}>
        <Shield className="h-12 w-12 text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Detections</h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          No detection rules have been triggered by the current events. This could indicate normal
          activity or that detection rules need to be adjusted.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text-primary">
          Active Detections ({detections.length})
        </h2>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <AlertTriangle className="h-4 w-4" />
          <span>Sorted by severity</span>
        </div>
      </div>

      <div className="space-y-3">
        {detections.map((detection) => (
          <DetectionCard
            key={detection.ruleId}
            detection={detection}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { X, Shield, User, Server, FileText, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { SecurityEvent } from '../types';

interface EventDetailModalProps {
  event: SecurityEvent | null;
  onClose: () => void;
}

const severityColors = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/30',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/30',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/30',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/30',
};

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="pl-7 space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-text-secondary">{label}</dt>
      <dd className="col-span-2 text-sm text-text-primary font-mono break-all">{value}</dd>
    </div>
  );
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-background-card shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background-card/95 backdrop-blur-sm p-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-text-primary">Event Details</h2>
                <span
                  className={cn(
                    'inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border uppercase',
                    severityColors[event.severity]
                  )}
                >
                  {event.severity}
                </span>
              </div>
              <p className="text-sm text-text-secondary">Event ID: {event.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <DetailSection icon={FileText} title="Basic Information">
              <dl className="space-y-2">
                <DetailRow label="Timestamp" value={formatTimestamp(event.timestamp)} />
                <DetailRow label="Event Type" value={event.eventType.replace(/_/g, ' ')} />
                <DetailRow label="Event ID" value={event.id} />
              </dl>
            </DetailSection>

            {/* Source Information */}
            <DetailSection icon={Server} title="Source Information">
              <dl className="space-y-2">
                <DetailRow label="Source Type" value={event.source.type} />
                <DetailRow label="Source Name" value={event.source.name} />
                <DetailRow label="Agent" value={event.source.agent} />
              </dl>
            </DetailSection>

            {/* Actor Information */}
            <DetailSection icon={User} title="Actor Information">
              <dl className="space-y-2">
                <DetailRow label="Username" value={event.actor.username} />
                <DetailRow label="Hostname" value={event.actor.hostname} />
                <DetailRow label="IP Address" value={event.actor.ipAddress} />
                <DetailRow label="Process Name" value={event.actor.processName} />
                <DetailRow label="Process ID" value={event.actor.processId} />
                <DetailRow label="User ID" value={event.actor.userId} />
              </dl>
            </DetailSection>

            {/* Target Information */}
            {event.target && (
              <DetailSection icon={Shield} title="Target Information">
                <dl className="space-y-2">
                  <DetailRow label="Resource" value={event.target.resource} />
                  <DetailRow label="Hostname" value={event.target.hostname} />
                  <DetailRow label="IP Address" value={event.target.ipAddress} />
                  <DetailRow label="Port" value={event.target.port} />
                  <DetailRow label="Protocol" value={event.target.protocol} />
                </dl>
              </DetailSection>
            )}

            {/* Event Details */}
            <DetailSection icon={AlertCircle} title="Event Details">
              <dl className="space-y-2">
                <DetailRow label="Action" value={event.details.action} />
                <DetailRow label="Result" value={event.details.result} />
                <DetailRow label="Status Code" value={event.details.statusCode} />
                <DetailRow label="Command Line" value={event.details.commandLine} />
                <DetailRow label="Location" value={event.details.location} />
                <DetailRow label="Protocol" value={event.details.protocol} />
                <DetailRow label="Port" value={event.details.port} />
                <DetailRow label="Bytes Sent" value={event.details.bytesSent} />
                <DetailRow label="Bytes Received" value={event.details.bytesReceived} />
                <DetailRow label="Parent Process" value={event.details.parentProcess} />
                <DetailRow label="File Hash" value={event.details.fileHash} />
              </dl>
            </DetailSection>

            {/* Enrichment */}
            {event.enrichment && (
              <DetailSection icon={Tag} title="Threat Intelligence">
                <dl className="space-y-3">
                  {event.enrichment.mitreTactics && event.enrichment.mitreTactics.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-2">
                        MITRE ATT&CK Tactics
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {event.enrichment.mitreTactics.map((tactic) => (
                          <span
                            key={tactic}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {tactic}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {event.enrichment.mitreTechniques && event.enrichment.mitreTechniques.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-2">
                        MITRE ATT&CK Techniques
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {event.enrichment.mitreTechniques.map((technique) => (
                          <span
                            key={technique}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                          >
                            {technique}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {event.enrichment.riskScore !== undefined && (
                    <DetailRow label="Risk Score" value={`${event.enrichment.riskScore} / 100`} />
                  )}
                  {event.enrichment.tags && event.enrichment.tags.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-2">Tags</dt>
                      <dd className="flex flex-wrap gap-2">
                        {event.enrichment.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-background text-text-secondary border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </DetailSection>
            )}

            {/* Raw Log */}
            {event.rawLog && (
              <DetailSection icon={FileText} title="Raw Log">
                <pre className="p-4 rounded-lg bg-background border border-border text-xs text-text-secondary overflow-x-auto">
                  {event.rawLog}
                </pre>
              </DetailSection>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-border bg-background-card/95 backdrop-blur-sm p-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

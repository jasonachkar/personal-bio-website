'use client';

import type { SiemAlert } from './types';
import { cn } from '@/lib/cn';

interface AlertListProps {
  alerts: SiemAlert[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const severityColor: Record<SiemAlert['severity'], string> = {
  Info: 'text-primary',
  Low: 'text-primary',
  Medium: 'text-amber-200',
  High: 'text-orange-300',
  Critical: 'text-danger',
};

const timeAgo = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function AlertList({ alerts, selectedId, onSelect }: AlertListProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <button
          key={alert.id}
          onClick={() => onSelect(alert.id)}
          className={cn(
            'w-full rounded-xl border bg-background-card text-left transition hover:border-primary hover:shadow-card-hover',
            selectedId === alert.id ? 'border-primary shadow-glow' : 'border-border'
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_0_5px_rgba(124,255,228,0.15)]" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-primary">{alert.title}</h4>
                <span className={cn('text-xs font-semibold uppercase', severityColor[alert.severity])}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{alert.category}</p>
              <p className="text-xs text-text-muted">
                {timeAgo(alert.timestamp)} · Rule {alert.rule_id}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

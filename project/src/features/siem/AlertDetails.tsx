'use client';

import type { SiemAlert } from './types';
import { cn } from '@/lib/cn';

interface AlertDetailsProps {
  alert?: SiemAlert;
}

const badge = 'inline-flex items-center rounded-full border px-3 py-1 text-xs';

export function AlertDetails({ alert }: AlertDetailsProps) {
  if (!alert) {
    return (
      <div className="rounded-xl border border-border bg-background-card p-6 text-center text-text-secondary">
        Select an alert to view details.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background-card p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={cn(badge, 'border-primary/40 bg-primary/10 text-primary')}>{alert.severity}</span>
        <span className={cn(badge, 'border-border text-text-secondary')}>{alert.category}</span>
        <span className={cn(badge, 'border-border text-text-secondary')}>Rule {alert.rule_id}</span>
        <span className={cn(badge, 'border-border text-text-secondary')}>{alert.user ?? 'No user'}</span>
      </div>

      <h3 className="text-xl font-semibold text-text-primary">{alert.title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{alert.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Indicators</h4>
          <ul className="space-y-1 text-sm text-text-secondary">
            {alert.indicators.map((ind) => (
              <li key={ind}>• {ind}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Mitre Tactics</h4>
          <div className="flex flex-wrap gap-2">
            {(alert.mitre_tactics ?? []).map((t) => (
              <span key={t} className={cn(badge, 'border-border bg-background-elevated text-text-secondary')}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background p-4">
        <h4 className="mb-2 text-sm font-semibold text-text-primary">Recommended actions</h4>
        <ol className="space-y-1 text-sm text-text-secondary">
          {alert.recommended_actions.map((action) => (
            <li key={action}>• {action}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background p-4">
        <h4 className="mb-2 text-sm font-semibold text-text-primary">Affected assets</h4>
        <div className="flex flex-wrap gap-2">
          {alert.affected_assets.map((asset) => (
            <span key={asset} className={cn(badge, 'border-border bg-background-elevated text-text-secondary')}>
              {asset}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

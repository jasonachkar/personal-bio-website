import type { Severity } from '../../../content/demos/types';

export const severityClasses: Record<Severity, string> = {
  critical: 'border-red-400/40 bg-red-500/12 text-red-200',
  high: 'border-orange-400/40 bg-orange-500/12 text-orange-100',
  medium: 'border-amber-400/40 bg-amber-500/12 text-amber-100',
  low: 'border-emerald-400/40 bg-emerald-500/12 text-emerald-100',
  info: 'border-sky-400/40 bg-sky-500/12 text-sky-100',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${severityClasses[severity]}`}>
      {severity}
    </span>
  );
}

export function WhatThisProves({ items }: { items: string[] }) {
  return (
    <div className="liquid-glass p-5">
      <h4 className="relative z-10 text-sm font-semibold uppercase text-text-muted">What this proves</h4>
      <ul className="relative z-10 mt-3 grid gap-2 text-sm leading-6 text-text-secondary">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

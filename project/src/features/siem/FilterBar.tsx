'use client';

import { AlertCategory, AlertSeverity, FilterState, severityOrder } from './types';
import { cn } from '@/lib/cn';

type Option<T> = { value: T; label: string };

const severityOptions: Option<AlertSeverity>[] = severityOrder.map((sev) => ({
  value: sev,
  label: sev,
}));

const categoryOptions: Option<AlertCategory>[] = [
  'Malware Detection',
  'Network Anomaly',
  'Authentication Failure',
  'Data Exfiltration',
  'Privilege Escalation',
  'Suspicious Activity',
  'Policy Violation',
].map((c) => ({ value: c, label: c }));

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const toggleSeverity = (value: AlertSeverity) => {
    const exists = filters.severity.includes(value);
    onChange({
      ...filters,
      severity: exists
        ? filters.severity.filter((s) => s !== value)
        : [...filters.severity, value],
    });
  };

  const toggleCategory = (value: AlertCategory) => {
    const exists = filters.category.includes(value);
    onChange({
      ...filters,
      category: exists
        ? filters.category.filter((c) => c !== value)
        : [...filters.category, value],
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-text-muted">Severity</span>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleSeverity(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                filters.severity.includes(opt.value)
                  ? 'border-primary bg-primary/15 text-primary shadow-glow'
                  : 'border-border bg-background text-text-secondary hover:border-primary hover:text-primary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-text-muted">Category</span>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleCategory(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                filters.category.includes(opt.value)
                  ? 'border-primary bg-primary/15 text-primary shadow-glow'
                  : 'border-border bg-background text-text-secondary hover:border-primary hover:text-primary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search alerts..."
          value={filters.searchQuery}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none ring-0 transition focus:border-primary/70 focus:bg-background-elevated"
        />
        <button
          onClick={onReset}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-secondary transition hover:border-primary hover:text-primary"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

import type { AlertSeverity } from '../data/types';

export const severityColors: Record<AlertSeverity, string> = {
  low: 'text-primary',
  medium: 'text-accent',
  high: 'text-orange-300',
  critical: 'text-danger',
};

export const severityBg: Record<AlertSeverity, string> = {
  low: 'bg-primary/10 border-primary/30',
  medium: 'bg-accent/10 border-accent/30',
  high: 'bg-orange-500/10 border-orange-400/40',
  critical: 'bg-danger/15 border-danger/40',
};

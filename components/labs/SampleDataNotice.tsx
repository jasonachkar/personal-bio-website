import { ExternalLink } from 'lucide-react';
import { profile } from '@/content/profile';

export function SampleDataNotice() {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent-subtle/40 p-4 text-sm leading-6 text-text-secondary">
      <span className="font-semibold text-text-primary">Interactive simulation on sample data.</span>{' '}
      See the real implementation at{' '}
      <a
        href={profile.links.secureObs}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-strong"
      >
        SecureObs
        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
      </a>
      .
    </div>
  );
}

import { Metadata } from 'next';
import { ThreatModelingPlayground } from '@/features/threat-modeling/components/ThreatModelingPlayground';
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';

export const metadata: Metadata = {
  title: 'Threat Modeling Playground - Interactive STRIDE Analysis',
  description:
    'STRIDE-based threat modeling for web applications. Visualize architecture, identify threats, and map mitigations with MITRE ATT&CK framework integration.',
};

export default function ThreatModelingPage() {
  return (
    <main className="min-h-screen bg-background">
      <ShowcaseHeader
        title="Threat Modeling Playground"
        description="STRIDE-based threat modeling with MITRE ATT&CK integration"
      />
      <ThreatModelingPlayground />
    </main>
  );
}

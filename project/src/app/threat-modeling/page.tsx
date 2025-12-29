import { Metadata } from 'next';
import { ThreatModelingPlayground } from '@/features/threat-modeling/components/ThreatModelingPlayground';

export const metadata: Metadata = {
  title: 'Threat Modeling Playground - Interactive STRIDE Analysis',
  description:
    'STRIDE-based threat modeling for web applications. Visualize architecture, identify threats, and map mitigations with MITRE ATT&CK framework integration.',
};

export default function ThreatModelingPage() {
  return (
    <main className="min-h-screen bg-background">
      <ThreatModelingPlayground />
    </main>
  );
}

import type { Metadata } from 'next';
import { ThreatDetectionDemo } from '@/components/demos/threat-detection/ThreatDetectionDemo';
import { DemoPageIntro } from '@/components/demos/DemoPageIntro';

export const metadata: Metadata = {
  title: 'Threat to Detection Demo | Jason Achkar Diab',
  description:
    'Interactive STRIDE-to-detection demo connecting threat model components, sample signals, KQL-like detection logic, and MITRE ATT&CK mappings.',
};

export default function ThreatToDetectionPage() {
  return (
    <>
      <DemoPageIntro
        eyebrow="AppSec + Detection Demo"
        title="Threat to Detection"
        description="A structured walkthrough from a STRIDE model to detection thinking, showing how design-time risks become monitoring logic and incident-ready context."
        proof={[
          'Threat modeling tied to components and trust boundaries',
          'Detection logic connected to modeled risks and sample telemetry',
          'MITRE ATT&CK language used without claiming live tenant monitoring',
        ]}
      />
      <ThreatDetectionDemo />
    </>
  );
}

import type { Metadata } from 'next';
import { SecureSdlcDemo } from '@/components/demos/secure-sdlc/SecureSdlcDemo';
import { DemoPageIntro } from '@/components/demos/DemoPageIntro';

export const metadata: Metadata = {
  title: 'Secure SDLC Demo | Jason Achkar Diab',
  description:
    'Interactive secure CI/CD command center demo with scanner replay, finding deduplication, and gate policy behavior.',
};

export default function SecureSdlcPage() {
  return (
    <>
      <DemoPageIntro
        eyebrow="DevSecOps Demo"
        title="Secure SDLC Pipeline Command Center"
        description="A client-side simulation of a secure pipeline run, showing scanner output, canonical grouping, severity policy, and gate verdicts without triggering a real build."
        proof={[
          'CI/CD gate behavior with severity policy and exit-code framing',
          'Multi-scanner triage across SAST, secrets, SCA, container, and IaC stages',
          'Deduplicated finding language with CVSS, OWASP, and CWE context',
        ]}
      />
      <SecureSdlcDemo />
    </>
  );
}

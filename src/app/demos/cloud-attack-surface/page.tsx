import type { Metadata } from 'next';
import { CloudAttackSurfaceDemo } from '@/components/demos/cloud-attack-surface/CloudAttackSurfaceDemo';
import { DemoPageIntro } from '@/components/demos/DemoPageIntro';

export const metadata: Metadata = {
  title: 'Azure Cloud Attack Surface Demo | Jason Achkar Diab',
  description:
    'Interactive Terraform-to-Azure attack surface demo with exposure, path, evidence, and mitigation states.',
};

export default function CloudAttackSurfacePage() {
  return (
    <>
      <DemoPageIntro
        eyebrow="Cloud Security Demo"
        title="Azure Cloud Attack Surface"
        description="A focused IaC security walkthrough that turns Terraform sample data into a readable Azure exposure path, with concrete evidence and mitigation notes."
        proof={[
          'Terraform review tied to Azure resource relationships',
          'Attack path reasoning from exposure to sensitive target',
          'Readable remediation language mapped to benchmark-style controls',
        ]}
      />
      <CloudAttackSurfaceDemo />
    </>
  );
}

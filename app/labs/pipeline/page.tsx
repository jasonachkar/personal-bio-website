import type { Metadata } from 'next';
import { LabShell } from '@/components/labs/LabShell';
import { PipelineReplayLab } from '@/components/labs/PipelineReplayLab';

export const metadata: Metadata = {
  title: 'Secure CI/CD Pipeline',
  description:
    'Client-side replay of secure CI/CD pipeline runs with scanner findings, deduplication, and blocking gates.',
};

export default function PipelinePage() {
  return (
    <LabShell
      title="Secure CI/CD Pipeline"
      intro="Replay scanner stages, switch between raw and canonical findings, and adjust gate policy to see why a build passes or fails."
      demonstrates="Secure CI/CD with SAST, secrets, SCA, and IaC stages, cross-tool deduplication, and a build gate that blocks promotion on policy. Maps to resume: secure CI/CD with build gates (SecureObs, SES); cross-tool canonical dedup."
    >
      <PipelineReplayLab />
    </LabShell>
  );
}

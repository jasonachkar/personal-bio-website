import type { Metadata } from 'next';
import { LabShell } from '@/components/labs/LabShell';
import { IacAttackPathLab } from '@/components/labs/IacAttackPathLab';

export const metadata: Metadata = {
  title: 'Terraform Attack-Path Explorer',
  description:
    'Client-side simulation of credential-free Terraform attack-path analysis using typed Azure graph sample data.',
};

export default function IacAttackPathsPage() {
  return (
    <LabShell
      title="Terraform Attack-Path Explorer"
      intro="Pick a Terraform misconfiguration pattern, inspect the typed Azure resource graph, and review the ranked path from entry point to sensitive target."
      demonstrates="Credential-free static Terraform analysis: parse IaC, build a typed Azure resource graph, and chain misconfigurations into ranked attack paths - the engine I built into SecureObs. Maps to resume: credential-free IaC attack-path engine; Azure network/identity hardening."
    >
      <IacAttackPathLab />
    </LabShell>
  );
}

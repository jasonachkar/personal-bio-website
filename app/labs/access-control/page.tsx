import type { Metadata } from 'next';
import { AccessControlLab } from '@/components/labs/AccessControlLab';
import { LabShell } from '@/components/labs/LabShell';

export const metadata: Metadata = {
  title: 'Multi-Tenant Access Control',
  description:
    'Client-side simulation of RBAC and tenant isolation with app-layer authorization and row-level security.',
};

export default function AccessControlPage() {
  return (
    <LabShell
      title="Multi-Tenant Access Control"
      intro="Choose an acting user, inspect effective permissions, and test how two isolation layers handle cross-tenant access."
      demonstrates="RBAC/IAM and multi-tenant isolation with two enforcement layers (application authorization + PostgreSQL row-level security). Maps to resume: RBAC/IAM from scratch (SES); defense-in-depth tenant isolation with FORCE RLS (SecureObs)."
    >
      <AccessControlLab />
    </LabShell>
  );
}

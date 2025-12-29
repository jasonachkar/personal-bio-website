import { Metadata } from 'next';
import { DevSecOpsPipeline } from '@/features/devsecops/components/DevSecOpsPipeline';
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';

export const metadata: Metadata = {
  title: 'DevSecOps Pipeline Simulator - Security Scan Results',
  description:
    'Interactive DevSecOps pipeline with SAST, SCA, secrets detection, IaC security, and container scanning. Demonstrates security gate implementation and threshold management.',
};

export default function DevSecOpsPage() {
  return (
    <main className="min-h-screen bg-background">
      <ShowcaseHeader
        title="DevSecOps Pipeline Simulator"
        description="Security scanning with SAST, SCA, secrets detection, and IaC"
      />
      <DevSecOpsPipeline />
    </main>
  );
}

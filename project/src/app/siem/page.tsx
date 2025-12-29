import { Metadata } from 'next';
import { SiemDetectionConsole } from '@/features/siem/components/SiemDetectionConsole';

export const metadata: Metadata = {
  title: 'SIEM Detection Console - Interactive Security Demo',
  description:
    'Real-time security event monitoring and threat detection powered by custom detection rules. Demonstrates detection engineering and MITRE ATT&CK framework knowledge.',
};

export default function SiemPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiemDetectionConsole />
    </main>
  );
}

import type { Metadata } from 'next';
import { MegaDemos } from '@/components/sections/MegaDemos';

export const metadata: Metadata = {
  title: 'Security Demos | Jason Achkar Diab',
  description:
    'Three focused security demos covering Azure attack surface analysis, secure SDLC gates, and threat-to-detection workflows.',
};

export default function DemosPage() {
  return <MegaDemos />;
}

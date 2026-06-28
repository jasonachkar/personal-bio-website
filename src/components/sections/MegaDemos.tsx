'use client';

import { motion } from 'framer-motion';
import { Cloud, GitBranch, Radar } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CloudAttackSurfaceDemo } from '@/components/demos/cloud-attack-surface/CloudAttackSurfaceDemo';
import { SecureSdlcDemo } from '@/components/demos/secure-sdlc/SecureSdlcDemo';
import { ThreatDetectionDemo } from '@/components/demos/threat-detection/ThreatDetectionDemo';

const demoCards = [
  {
    id: 'demo-cloud',
    icon: Cloud,
    title: 'Azure Cloud Attack Surface',
    text: 'Typed Azure graph, animated attack path, CIS/ASB findings, and mitigation state.',
  },
  {
    id: 'demo-sdlc',
    icon: GitBranch,
    title: 'Secure SDLC Pipeline Command Center',
    text: 'Multi-scanner replay, canonical deduplication, CVSS/OWASP/CWE triage, and gate verdict.',
  },
  {
    id: 'demo-threat',
    icon: Radar,
    title: 'Threat to Detection',
    text: 'STRIDE threats connected to KQL-like detections and MITRE ATT&CK mappings.',
  },
];

export function MegaDemos() {
  return (
    <section id="demos" className="relative">
      <div className="section-container">
        <div className="content-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-xs font-semibold uppercase text-primary">Interactive simulations on sample data</p>
            <h2 className="mt-4 text-headline text-text-primary">Three security demos, not five scattered tools</h2>
            <p className="mx-auto mt-4 max-w-3xl text-body-lg text-text-secondary">
              The strongest portfolio material is consolidated into three cinematic client-side experiences. Each one is static, honest, and mapped to what the work proves.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {demoCards.map((demo) => {
              const Icon = demo.icon;
              return (
                <a key={demo.id} href={`#${demo.id}`} className="block h-full">
                  <Card variant="glass" padding="lg" className="h-full">
                    <Icon className="relative z-10 h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="relative z-10 mt-4 text-lg font-semibold text-text-primary">{demo.title}</h3>
                    <p className="relative z-10 mt-2 text-sm leading-6 text-text-secondary">{demo.text}</p>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <CloudAttackSurfaceDemo />
      <SecureSdlcDemo />
      <ThreatDetectionDemo />
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Cloud, GitBranch, Radar } from 'lucide-react';
import Card from '@/components/ui/Card';

const demoCards = [
  {
    href: '/demos/cloud-attack-surface',
    icon: Cloud,
    title: 'Azure Cloud Attack Surface',
    text: 'Typed Azure graph, animated attack path, CIS/ASB findings, and mitigation state.',
  },
  {
    href: '/demos/secure-sdlc',
    icon: GitBranch,
    title: 'Secure SDLC Pipeline Command Center',
    text: 'Multi-scanner replay, canonical deduplication, CVSS/OWASP/CWE triage, and gate verdict.',
  },
  {
    href: '/demos/threat-to-detection',
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

          <div className="mt-10 grid items-stretch gap-8 md:grid-cols-3">
            {demoCards.map((demo) => {
              const Icon = demo.icon;
              return (
                <Link key={demo.href} href={demo.href} className="block h-full">
                  <Card variant="glass" padding="lg" className="h-full">
                    <div className="relative z-10 flex h-full flex-col">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-semibold leading-snug text-text-primary">{demo.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-text-secondary">{demo.text}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Open demo
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

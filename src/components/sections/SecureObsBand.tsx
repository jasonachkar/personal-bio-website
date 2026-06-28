'use client';

import { ExternalLink, Github, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const scanners = ['Semgrep', 'Gitleaks', 'Trivy', 'Bandit', 'ESLint-security', 'OSV-Scanner', 'Checkov'];
const differentiators = [
  'Credential-free Terraform attack-path engine with a typed Azure graph and ranked paths.',
  'Defense-in-depth tenant isolation with app authorization plus PostgreSQL FORCE RLS.',
  'Ephemeral sandboxed scanners in Azure Container Instances with short-lived tokens.',
  'Entra ID OAuth 2.1 PKCE, hashed API keys, Key Vault, managed identity, and private database access.',
];

export function SecureObsBand() {
  return (
    <section id="secureobs" className="section-container relative">
      <div className="absolute inset-0 bg-mesh-gradient opacity-35" aria-hidden="true" />
      <div className="content-container relative">
        <Card variant="glass" hoverEffect="none" interactive={false} padding="none">
          <div className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_430px] lg:p-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase text-primary"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Flagship project
              </motion.div>
              <h2 className="mt-5 text-3xl font-semibold text-text-primary md:text-4xl">SecureObs</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                Solo-built, production-deployed, multi-tenant security SaaS that unifies seven open-source scanners into one triage dashboard, deduplicates findings across tools, gates CI/CD on unresolved issues, and performs credential-free Terraform attack-path analysis for Azure.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {scanners.map((scanner) => (
                  <Badge key={scanner} label={scanner} variant="cyber" size="xs" />
                ))}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {differentiators.map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-text-secondary">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="https://secureobs.com" target="_blank" rel="noreferrer" icon={<ExternalLink className="h-4 w-4" />}>
                  Live product
                </Button>
                <Button
                  href="https://github.com/jasonachkar/secure-obs"
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                  icon={<Github className="h-4 w-4" />}
                >
                  Source & architecture
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <Image
                src="/secureobs-architecture.svg"
                alt="SecureObs architecture diagram"
                width={840}
                height={720}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

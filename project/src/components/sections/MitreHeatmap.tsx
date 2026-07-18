'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { scrollVariants, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

const repoUrls = {
  sentinel: 'https://github.com/jasonachkar/microsoft-sentinel-siem-detection',
  landingZone: 'https://github.com/jasonachkar/azure-secure-landing-zone-baseline',
  apiGateway: 'https://github.com/jasonachkar/secure-api-gateway',
} as const;

type TechniqueLink =
  | { kind: 'section'; sectionId: string }
  | { kind: 'repo'; url: string };

type Technique = {
  id: string;
  name: string;
  covered: boolean;
  link?: TechniqueLink;
};

type Tactic = {
  name: string;
  techniques: Technique[];
};

/**
 * Coverage is hardcoded to what the detection rules, tooling, and cloud
 * controls in this portfolio actually implement — no aspirational claims.
 */
const tactics: Tactic[] = [
  {
    name: 'Initial Access',
    techniques: [
      { id: 'T1566', name: 'Phishing', covered: true, link: { kind: 'repo', url: repoUrls.sentinel } },
      { id: 'T1078', name: 'Valid Accounts', covered: true, link: { kind: 'section', sectionId: 'siem' } },
      { id: 'T1190', name: 'Exploit Public-Facing App', covered: false },
    ],
  },
  {
    name: 'Execution',
    techniques: [
      { id: 'T1059.001', name: 'PowerShell', covered: true, link: { kind: 'section', sectionId: 'siem' } },
      { id: 'T1204', name: 'User Execution', covered: false },
      { id: 'T1053', name: 'Scheduled Task/Job', covered: false },
    ],
  },
  {
    name: 'Persistence',
    techniques: [
      { id: 'T1098', name: 'Account Manipulation', covered: true, link: { kind: 'repo', url: repoUrls.sentinel } },
      { id: 'T1136', name: 'Create Account', covered: false },
      { id: 'T1543', name: 'Modify System Process', covered: false },
    ],
  },
  {
    name: 'Privilege Escalation',
    techniques: [
      { id: 'T1548', name: 'Abuse Elevation Control', covered: true, link: { kind: 'repo', url: repoUrls.sentinel } },
      { id: 'T1068', name: 'Exploitation for PrivEsc', covered: false },
      { id: 'T1078.004', name: 'Cloud Accounts', covered: false },
    ],
  },
  {
    name: 'Defense Evasion',
    techniques: [
      { id: 'T1562', name: 'Impair Defenses', covered: true, link: { kind: 'repo', url: repoUrls.landingZone } },
      { id: 'T1070', name: 'Indicator Removal', covered: false },
      { id: 'T1036', name: 'Masquerading', covered: false },
    ],
  },
  {
    name: 'Credential Access',
    techniques: [
      { id: 'T1110', name: 'Brute Force', covered: true, link: { kind: 'repo', url: repoUrls.apiGateway } },
      { id: 'T1552', name: 'Unsecured Credentials', covered: false },
      { id: 'T1621', name: 'MFA Request Generation', covered: false },
    ],
  },
  {
    name: 'Discovery',
    techniques: [
      { id: 'T1526', name: 'Cloud Service Discovery', covered: true, link: { kind: 'repo', url: repoUrls.landingZone } },
      { id: 'T1087', name: 'Account Discovery', covered: false },
      { id: 'T1046', name: 'Network Service Discovery', covered: false },
    ],
  },
  {
    name: 'Lateral Movement',
    techniques: [
      { id: 'T1534', name: 'Internal Spearphishing', covered: true, link: { kind: 'repo', url: repoUrls.sentinel } },
      { id: 'T1021', name: 'Remote Services', covered: false },
      { id: 'T1550', name: 'Alternate Auth Material', covered: false },
    ],
  },
  {
    name: 'Collection',
    techniques: [
      { id: 'T1530', name: 'Data from Cloud Storage', covered: true, link: { kind: 'repo', url: repoUrls.landingZone } },
      { id: 'T1114', name: 'Email Collection', covered: false },
      { id: 'T1005', name: 'Data from Local System', covered: false },
    ],
  },
  {
    name: 'Exfiltration',
    techniques: [
      { id: 'T1567', name: 'Exfil Over Web Service', covered: true, link: { kind: 'repo', url: repoUrls.sentinel } },
      { id: 'T1048', name: 'Exfil Over Alt Protocol', covered: false },
      { id: 'T1041', name: 'Exfil Over C2 Channel', covered: false },
    ],
  },
  {
    name: 'Command & Control',
    techniques: [
      { id: 'T1071.004', name: 'DNS Tunneling', covered: true, link: { kind: 'section', sectionId: 'siem' } },
      { id: 'T1090', name: 'Proxy', covered: false },
      { id: 'T1573', name: 'Encrypted Channel', covered: false },
    ],
  },
];

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function TechniqueTile({ technique }: { technique: Technique }) {
  const tileClasses = cn(
    'flex min-h-[64px] w-full flex-col justify-center gap-0.5 rounded-lg border p-2 text-left',
    'transition-all duration-200',
    technique.covered
      ? 'border-primary/40 bg-primary/10 hover:border-primary hover:bg-primary/20 cursor-pointer'
      : 'border-border/50 bg-background-elevated/30 opacity-45'
  );

  const content = (
    <>
      <span
        className={cn(
          'font-mono text-[10px] font-bold',
          technique.covered ? 'text-primary' : 'text-text-muted'
        )}
      >
        {technique.id}
      </span>
      <span
        className={cn(
          'text-[11px] leading-tight',
          technique.covered ? 'text-text-primary' : 'text-text-muted'
        )}
      >
        {technique.name}
      </span>
    </>
  );

  if (technique.covered && technique.link?.kind === 'repo') {
    return (
      <a
        href={technique.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={tileClasses}
        title={`${technique.id} ${technique.name} — view the project implementing this detection`}
      >
        {content}
      </a>
    );
  }

  if (technique.covered && technique.link?.kind === 'section') {
    const sectionId = technique.link.sectionId;
    return (
      <button
        type="button"
        onClick={() => scrollToSection(sectionId)}
        className={tileClasses}
        title={`${technique.id} ${technique.name} — jump to the live SOC dashboard`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={tileClasses} aria-label={`${technique.id} ${technique.name} — not yet covered`}>
      {content}
    </div>
  );
}

const MitreHeatmap = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  return (
    <section id="mitre" className="section-container relative">
      <div className="absolute inset-0 bg-radial-accent opacity-20 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <Crosshair className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Adversary Coverage
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">MITRE ATT&amp;CK Coverage</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Techniques covered across detection rules, tooling, and cloud controls
          </p>
        </motion.div>

        {/* Heatmap grid (horizontally scrollable on small screens) */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="overflow-x-auto rounded-2xl border border-border bg-background-card p-4 sm:p-5"
        >
          <div className="flex min-w-max gap-2.5">
            {tactics.map((tactic) => (
              <div key={tactic.name} className="flex w-[140px] flex-shrink-0 flex-col gap-2">
                <div className="flex min-h-[40px] items-center justify-center rounded-lg bg-background-elevated px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-text-secondary">
                  {tactic.name}
                </div>
                {tactic.techniques.map((technique) => (
                  <TechniqueTile key={technique.id} technique={technique} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <span className="text-primary">●</span> Detected &amp; Mapped
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-text-muted">○</span> Not yet covered
          </span>
        </div>
      </div>
    </section>
  );
};

export default memo(MitreHeatmap);

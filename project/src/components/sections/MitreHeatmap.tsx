'use client';

import { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Circle, Crosshair, ExternalLink } from 'lucide-react';
import { scrollVariants, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/cn';

const repoUrls = {
  sentinel: 'https://github.com/jasonachkar/microsoft-sentinel-siem-detection',
  landingZone: 'https://github.com/jasonachkar/azure-secure-landing-zone-baseline',
  apiGateway: 'https://github.com/jasonachkar/secure-api-gateway',
} as const;

type CoveredBy = {
  label: string;
  /** External repo URL, or undefined when covered by the on-page SOC console */
  url?: string;
  /** Section id to scroll to when the coverage lives on this page */
  sectionId?: string;
};

type Technique = {
  id: string;
  name: string;
  description: string;
  covered: boolean;
  coveredBy?: CoveredBy;
};

type Tactic = {
  name: string;
  techniques: Technique[];
};

const coveredBySentinel: CoveredBy = {
  label: 'SIEM Detection Pack (Microsoft Sentinel) — KQL analytics rules',
  url: repoUrls.sentinel,
};
const coveredByLandingZone: CoveredBy = {
  label: 'Azure Secure Landing Zone Baseline — policy, logging & guardrails',
  url: repoUrls.landingZone,
};
const coveredByApiGateway: CoveredBy = {
  label: 'Secure API Gateway Pattern — auth hardening & rate limiting',
  url: repoUrls.apiGateway,
};
const coveredBySocConsole: CoveredBy = {
  label: 'Live SOC console — detection rules running on this site',
  sectionId: 'siem',
};

/**
 * Coverage is hardcoded to what the detection rules, tooling, and cloud
 * controls in this portfolio actually implement — no aspirational claims.
 */
const tactics: Tactic[] = [
  {
    name: 'Initial Access',
    techniques: [
      { id: 'T1566', name: 'Phishing', covered: true, coveredBy: coveredBySentinel, description: 'Adversaries send phishing messages to gain access to victim systems.' },
      { id: 'T1078', name: 'Valid Accounts', covered: true, coveredBy: coveredBySocConsole, description: 'Use of legitimate but compromised credentials to gain and maintain access.' },
      { id: 'T1190', name: 'Exploit Public-Facing App', covered: false, description: 'Exploitation of internet-facing applications for initial access.' },
    ],
  },
  {
    name: 'Execution',
    techniques: [
      { id: 'T1059.001', name: 'PowerShell', covered: true, coveredBy: coveredBySocConsole, description: 'Abuse of PowerShell to execute malicious commands and payloads.' },
      { id: 'T1204', name: 'User Execution', covered: false, description: 'Relying on a user to open or run malicious content.' },
      { id: 'T1053', name: 'Scheduled Task/Job', covered: false, description: 'Abuse of task scheduling to execute or persist code.' },
    ],
  },
  {
    name: 'Persistence',
    techniques: [
      { id: 'T1098', name: 'Account Manipulation', covered: true, coveredBy: coveredBySentinel, description: 'Modifying accounts or their permissions to maintain access.' },
      { id: 'T1136', name: 'Create Account', covered: false, description: 'Creating new accounts to maintain access to victim systems.' },
      { id: 'T1543', name: 'Modify System Process', covered: false, description: 'Creating or modifying system services and processes to persist.' },
    ],
  },
  {
    name: 'Privilege Escalation',
    techniques: [
      { id: 'T1548', name: 'Abuse Elevation Control', covered: true, coveredBy: coveredBySentinel, description: 'Circumventing elevation-control mechanisms to gain higher privileges.' },
      { id: 'T1068', name: 'Exploitation for PrivEsc', covered: false, description: 'Exploiting software vulnerabilities to elevate privileges.' },
      { id: 'T1078.004', name: 'Cloud Accounts', covered: false, description: 'Using compromised cloud accounts for access and escalation.' },
    ],
  },
  {
    name: 'Defense Evasion',
    techniques: [
      { id: 'T1562', name: 'Impair Defenses', covered: true, coveredBy: coveredByLandingZone, description: 'Disabling or tampering with security tooling, policies, and logging.' },
      { id: 'T1070', name: 'Indicator Removal', covered: false, description: 'Deleting or altering artifacts to hide malicious activity.' },
      { id: 'T1036', name: 'Masquerading', covered: false, description: 'Disguising malicious artifacts as legitimate ones.' },
    ],
  },
  {
    name: 'Credential Access',
    techniques: [
      { id: 'T1110', name: 'Brute Force', covered: true, coveredBy: coveredByApiGateway, description: 'Repeated credential guessing against accounts or services.' },
      { id: 'T1552', name: 'Unsecured Credentials', covered: false, description: 'Harvesting credentials stored insecurely on systems.' },
      { id: 'T1621', name: 'MFA Request Generation', covered: false, description: 'Bombarding users with MFA prompts until one is approved.' },
    ],
  },
  {
    name: 'Discovery',
    techniques: [
      { id: 'T1526', name: 'Cloud Service Discovery', covered: true, coveredBy: coveredByLandingZone, description: 'Enumerating cloud services and resources in a compromised environment.' },
      { id: 'T1087', name: 'Account Discovery', covered: false, description: 'Enumerating accounts to inform follow-on activity.' },
      { id: 'T1046', name: 'Network Service Discovery', covered: false, description: 'Scanning for services running on remote hosts.' },
    ],
  },
  {
    name: 'Lateral Movement',
    techniques: [
      { id: 'T1534', name: 'Internal Spearphishing', covered: true, coveredBy: coveredBySentinel, description: 'Phishing from a compromised internal account to move laterally.' },
      { id: 'T1021', name: 'Remote Services', covered: false, description: 'Using remote services such as RDP or SSH to move laterally.' },
      { id: 'T1550', name: 'Alternate Auth Material', covered: false, description: 'Using stolen tokens or tickets to authenticate without passwords.' },
    ],
  },
  {
    name: 'Collection',
    techniques: [
      { id: 'T1530', name: 'Data from Cloud Storage', covered: true, coveredBy: coveredByLandingZone, description: 'Accessing data from improperly secured cloud storage.' },
      { id: 'T1114', name: 'Email Collection', covered: false, description: 'Collecting emails from mailboxes of interest.' },
      { id: 'T1005', name: 'Data from Local System', covered: false, description: 'Collecting files and data from local system sources.' },
    ],
  },
  {
    name: 'Exfiltration',
    techniques: [
      { id: 'T1567', name: 'Exfil Over Web Service', covered: true, coveredBy: coveredBySentinel, description: 'Exfiltrating data to external web and cloud services.' },
      { id: 'T1048', name: 'Exfil Over Alt Protocol', covered: false, description: 'Exfiltration over a different protocol than the C2 channel.' },
      { id: 'T1041', name: 'Exfil Over C2 Channel', covered: false, description: 'Exfiltrating data over the existing command-and-control channel.' },
    ],
  },
  {
    name: 'Command & Control',
    techniques: [
      { id: 'T1071.004', name: 'DNS Tunneling', covered: true, coveredBy: coveredBySocConsole, description: 'Using the DNS application-layer protocol to tunnel C2 traffic.' },
      { id: 'T1090', name: 'Proxy', covered: false, description: 'Using proxies to obscure the source of C2 traffic.' },
      { id: 'T1573', name: 'Encrypted Channel', covered: false, description: 'Encrypting C2 traffic to evade inspection.' },
    ],
  },
];

const allTechniques = tactics.flatMap((tactic) =>
  tactic.techniques.map((technique) => ({ ...technique, tactic: tactic.name }))
);
const coveredCount = allTechniques.filter((t) => t.covered).length;
const totalCount = allTechniques.length;

/** T1059.001 → https://attack.mitre.org/techniques/T1059/001/ */
function mitreUrl(techniqueId: string): string {
  return `https://attack.mitre.org/techniques/${techniqueId.replace('.', '/')}/`;
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

type SelectedTechnique = (Technique & { tactic: string }) | null;

const MitreHeatmap = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const [selected, setSelected] = useState<SelectedTechnique>(null);

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
          className="mb-8 text-center sm:mb-10"
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
            Techniques covered across detection rules, tooling, and cloud controls — click any
            tile to see how it&apos;s covered and where it&apos;s implemented
          </p>
        </motion.div>

        {/* Coverage summary */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mb-6 max-w-xl"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-text-primary">
              {coveredCount} of {totalCount} mapped techniques covered
            </span>
            <span className="font-mono text-primary">
              {Math.round((coveredCount / totalCount) * 100)}%
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-elevated"
            role="progressbar"
            aria-valuenow={coveredCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label="Technique coverage"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(coveredCount / totalCount) * 100}%` }}
            />
          </div>
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
                {tactic.techniques.map((technique) => {
                  const isSelected = selected?.id === technique.id;
                  return (
                    <button
                      key={technique.id}
                      type="button"
                      onClick={() =>
                        setSelected(
                          isSelected ? null : { ...technique, tactic: tactic.name }
                        )
                      }
                      aria-pressed={isSelected}
                      title={`${technique.id} — ${technique.name}`}
                      className={cn(
                        'flex min-h-[64px] w-full flex-col justify-center gap-0.5 rounded-lg border p-2 text-left',
                        'transition-all duration-200',
                        technique.covered
                          ? 'border-primary/40 bg-primary/10 hover:border-primary hover:bg-primary/20'
                          : 'border-border/50 bg-background-elevated/30 opacity-50 hover:opacity-90',
                        isSelected && 'ring-2 ring-primary'
                      )}
                    >
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
                    </button>
                  );
                })}
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

        {/* Technique detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: easings.easeOutQuint }}
              className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-background-card p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={mitreUrl(selected.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-sm font-bold text-primary hover:text-primary-hover"
                    >
                      {selected.id}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {selected.tactic}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-text-primary">
                    {selected.name}
                  </h3>
                </div>
                {selected.covered ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-severity-low/30 bg-severity-low/10 px-3 py-1 text-xs font-semibold text-severity-low">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Covered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-elevated px-3 py-1 text-xs font-semibold text-text-muted">
                    <Circle className="h-3 w-3" aria-hidden="true" /> Not yet covered
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {selected.description}
              </p>

              {selected.covered && selected.coveredBy ? (
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Covered by
                  </p>
                  <p className="mt-1 text-sm text-text-primary">{selected.coveredBy.label}</p>
                  <div className="mt-3">
                    {selected.coveredBy.url ? (
                      <a
                        href={selected.coveredBy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
                      >
                        View implementation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          selected.coveredBy?.sectionId &&
                          scrollToSection(selected.coveredBy.sectionId)
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
                      >
                        Jump to the SOC console <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-text-muted">
                  On the detection roadmap — coverage here only reflects what&apos;s actually
                  built.
                </p>
              )}

              <a
                href={mitreUrl(selected.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-primary"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Full technique reference on attack.mitre.org
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default memo(MitreHeatmap);

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileCode,
  GitCommit,
  Building2,
  Lock,
  ExternalLink,
  ChevronRight,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

// ============================================
// SLSA Provenance Panel Component
// ============================================

/**
 * SLSA Level requirements
 */
interface SLSARequirement {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3 | 4;
  met: boolean;
  evidence?: string;
}

/**
 * Build provenance data
 */
interface ProvenanceData {
  buildType: string;
  builder: {
    id: string;
    version: string;
  };
  invocation: {
    configSource: {
      uri: string;
      digest: Record<string, string>;
      entryPoint: string;
    };
    parameters: Record<string, string>;
  };
  materials: Array<{
    uri: string;
    digest: Record<string, string>;
  }>;
  metadata: {
    buildInvocationId: string;
    buildStartedOn: string;
    buildFinishedOn: string;
    completeness: {
      parameters: boolean;
      environment: boolean;
      materials: boolean;
    };
    reproducible: boolean;
  };
}

interface SLSAProvenancePanelProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mock provenance data
 */
const mockProvenance: ProvenanceData = {
  buildType: 'https://github.com/slsa-framework/slsa-github-generator/container@v1',
  builder: {
    id: 'https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@refs/tags/v1.9.0',
    version: 'v1.9.0',
  },
  invocation: {
    configSource: {
      uri: 'git+https://github.com/example/secure-api-gateway@refs/heads/main',
      digest: { sha1: 'a1b2c3d4e5f6789012345678901234567890abcd' },
      entryPoint: '.github/workflows/build.yml',
    },
    parameters: {
      'inputs.image-name': 'secure-api-gateway',
      'inputs.push-to-registry': 'true',
    },
  },
  materials: [
    {
      uri: 'git+https://github.com/example/secure-api-gateway@refs/heads/main',
      digest: { sha1: 'a1b2c3d4e5f6789012345678901234567890abcd' },
    },
    {
      uri: 'pkg:npm/@types/node@18.17.0',
      digest: { sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' },
    },
  ],
  metadata: {
    buildInvocationId: 'github-actions-12345',
    buildStartedOn: '2024-01-15T10:30:00Z',
    buildFinishedOn: '2024-01-15T10:35:42Z',
    completeness: {
      parameters: true,
      environment: true,
      materials: true,
    },
    reproducible: false,
  },
};

/**
 * SLSA requirements checklist
 */
const slsaRequirements: SLSARequirement[] = [
  // Level 1
  {
    id: 'l1-1',
    title: 'Build process exists',
    description: 'A documented build process that others can follow',
    level: 1,
    met: true,
    evidence: 'GitHub Actions workflow defined',
  },
  {
    id: 'l1-2',
    title: 'Provenance generated',
    description: 'Provenance describing how artifact was built',
    level: 1,
    met: true,
    evidence: 'SLSA provenance attestation generated',
  },
  // Level 2
  {
    id: 'l2-1',
    title: 'Version controlled build service',
    description: 'Build service uses version control for build definition',
    level: 2,
    met: true,
    evidence: 'Using GitHub Actions with versioned workflows',
  },
  {
    id: 'l2-2',
    title: 'Authenticated provenance',
    description: 'Provenance is signed by build service',
    level: 2,
    met: true,
    evidence: 'Signed with Sigstore/Cosign',
  },
  // Level 3
  {
    id: 'l3-1',
    title: 'Hardened build service',
    description: 'Build service runs in isolated, ephemeral environment',
    level: 3,
    met: true,
    evidence: 'GitHub-hosted runners with ephemeral environments',
  },
  {
    id: 'l3-2',
    title: 'Non-falsifiable provenance',
    description: 'Provenance cannot be modified by tenants',
    level: 3,
    met: true,
    evidence: 'Using slsa-github-generator with isolated provenance',
  },
  {
    id: 'l3-3',
    title: 'Build from source',
    description: 'Build service fetches source code directly',
    level: 3,
    met: true,
    evidence: 'Source fetched from GitHub during build',
  },
  // Level 4
  {
    id: 'l4-1',
    title: 'Two-person review',
    description: 'All changes require two-person review',
    level: 4,
    met: false,
    evidence: 'Branch protection requires only 1 reviewer',
  },
  {
    id: 'l4-2',
    title: 'Hermetic builds',
    description: 'All dependencies are locked and verified',
    level: 4,
    met: false,
    evidence: 'Not all dependencies are pinned by hash',
  },
  {
    id: 'l4-3',
    title: 'Reproducible builds',
    description: 'Build is reproducible by independent party',
    level: 4,
    met: false,
    evidence: 'Build not verified as reproducible',
  },
];

/**
 * SLSAProvenancePanel Component
 * @description Displays SLSA provenance information and level compliance
 */
export function SLSAProvenancePanel({ className }: SLSAProvenancePanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('provenance');

  // Calculate achieved SLSA level
  const achievedLevel = (() => {
    const levelMet = (level: number) =>
      slsaRequirements.filter(r => r.level <= level).every(r => r.met);
    
    if (levelMet(4)) return 4;
    if (levelMet(3)) return 3;
    if (levelMet(2)) return 2;
    if (levelMet(1)) return 1;
    return 0;
  })();

  const levelColors: Record<number, string> = {
    0: 'text-text-muted',
    1: 'text-severity-medium',
    2: 'text-severity-medium',
    3: 'text-severity-low',
    4: 'text-primary',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* SLSA Level Indicator */}
      <Card variant="cyber" padding="lg" className="relative overflow-visible">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br from-primary/20 to-accent/20',
              'border-2 border-primary/50'
            )}>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">SLSA Compliance Level</p>
              <div className="flex items-baseline gap-2">
                <span className={cn('text-4xl font-bold', levelColors[achievedLevel])}>
                  Level {achievedLevel}
                </span>
                <span className="text-text-muted">/ 4</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center font-bold',
                  'border-2 transition-all',
                  level <= achievedLevel
                    ? 'bg-severity-low/20 border-severity-low text-severity-low'
                    : 'bg-background-elevated border-border text-text-muted'
                )}
              >
                L{level}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span>Requirements met</span>
            <span>{slsaRequirements.filter(r => r.met).length} / {slsaRequirements.length}</span>
          </div>
          <div className="h-2 rounded-full bg-background-elevated overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-severity-low to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(slsaRequirements.filter(r => r.met).length / slsaRequirements.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </Card>

      {/* Provenance Details */}
      <Card variant="default" padding="none">
        <button
          onClick={() => setExpandedSection(expandedSection === 'provenance' ? null : 'provenance')}
          className="w-full p-4 flex items-center justify-between hover:bg-background-elevated/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileCode className="h-5 w-5 text-primary" />
            <span className="font-medium text-text-primary">Build Provenance</span>
          </div>
          <ChevronRight className={cn(
            'h-5 w-5 text-text-muted transition-transform',
            expandedSection === 'provenance' && 'rotate-90'
          )} />
        </button>

        {expandedSection === 'provenance' && (
          <div className="px-4 pb-4 space-y-4">
            {/* Builder Info */}
            <div className="p-3 rounded-lg bg-background-elevated">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-text-primary">Builder</span>
              </div>
              <p className="text-xs font-mono text-text-secondary break-all">
                {mockProvenance.builder.id}
              </p>
              <Badge label={`Version ${mockProvenance.builder.version}`} size="xs" className="mt-2" />
            </div>

            {/* Source Info */}
            <div className="p-3 rounded-lg bg-background-elevated">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-text-primary">Source</span>
              </div>
              <p className="text-xs font-mono text-text-secondary break-all">
                {mockProvenance.invocation.configSource.uri}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-text-muted">SHA:</span>
                <code className="text-xs font-mono text-primary">
                  {mockProvenance.invocation.configSource.digest.sha1?.substring(0, 12)}
                </code>
              </div>
            </div>

            {/* Build Metadata */}
            <div className="p-3 rounded-lg bg-background-elevated">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-severity-low" />
                <span className="text-sm font-medium text-text-primary">Build Metadata</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted">Started:</span>
                  <p className="text-text-secondary">
                    {new Date(mockProvenance.metadata.buildStartedOn).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Finished:</span>
                  <p className="text-text-secondary">
                    {new Date(mockProvenance.metadata.buildFinishedOn).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                {Object.entries(mockProvenance.metadata.completeness).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-1">
                    {value ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-severity-low" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-severity-high" />
                    )}
                    <span className="text-xs text-text-secondary capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Requirements Checklist */}
      <Card variant="default" padding="none">
        <button
          onClick={() => setExpandedSection(expandedSection === 'requirements' ? null : 'requirements')}
          className="w-full p-4 flex items-center justify-between hover:bg-background-elevated/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-medium text-text-primary">SLSA Requirements</span>
          </div>
          <ChevronRight className={cn(
            'h-5 w-5 text-text-muted transition-transform',
            expandedSection === 'requirements' && 'rotate-90'
          )} />
        </button>

        {expandedSection === 'requirements' && (
          <div className="px-4 pb-4 space-y-2">
            {[1, 2, 3, 4].map(level => (
              <div key={level}>
                <div className="flex items-center gap-2 py-2">
                  <Badge
                    label={`Level ${level}`}
                    size="xs"
                    variant={level <= achievedLevel ? 'primary' : 'default'}
                  />
                </div>
                <div className="space-y-1.5">
                  {slsaRequirements
                    .filter(r => r.level === level)
                    .map(req => (
                      <div
                        key={req.id}
                        className={cn(
                          'p-3 rounded-lg flex items-start gap-3',
                          req.met
                            ? 'bg-severity-low/5 border border-severity-low/20'
                            : 'bg-background-elevated border border-border'
                        )}
                      >
                        {req.met ? (
                          <CheckCircle2 className="h-4 w-4 text-severity-low flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-text-muted flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium',
                            req.met ? 'text-text-primary' : 'text-text-secondary'
                          )}>
                            {req.title}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">{req.description}</p>
                          {req.evidence && (
                            <p className="text-xs text-text-secondary mt-1 italic">
                              {req.evidence}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Learn More Link */}
      <div className="text-center">
        <a
          href="https://slsa.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Learn more about SLSA
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export default SLSAProvenancePanel;

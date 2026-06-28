'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Shield,
  X,
  FileJson,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// ============================================
// SBOM Viewer Component (CycloneDX Format)
// ============================================

/**
 * Component interface (CycloneDX format)
 */
interface SBOMComponent {
  type: 'library' | 'framework' | 'application' | 'container' | 'operating-system';
  name: string;
  version: string;
  purl?: string;
  licenses?: Array<{ id: string; name: string }>;
  supplier?: string;
  vulnerabilities?: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }>;
  dependencies?: string[];
}

/**
 * SBOM document interface
 */
interface SBOMDocument {
  bomFormat: 'CycloneDX';
  specVersion: string;
  serialNumber: string;
  version: number;
  metadata: {
    timestamp: string;
    component: {
      type: string;
      name: string;
      version: string;
    };
  };
  components: SBOMComponent[];
}

interface SBOMViewerProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mock SBOM data for demonstration
 */
const mockSBOM: SBOMDocument = {
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  serialNumber: 'urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79',
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    component: {
      type: 'application',
      name: 'secure-api-gateway',
      version: '1.0.0',
    },
  },
  components: [
    {
      type: 'library',
      name: 'express',
      version: '4.18.2',
      purl: 'pkg:npm/express@4.18.2',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      supplier: 'Express.js Team',
      vulnerabilities: [],
      dependencies: ['body-parser', 'cookie', 'path-to-regexp'],
    },
    {
      type: 'library',
      name: 'jsonwebtoken',
      version: '9.0.0',
      purl: 'pkg:npm/jsonwebtoken@9.0.0',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [
        {
          id: 'CVE-2022-23541',
          severity: 'high',
          description: 'Improper signature verification vulnerability',
        },
      ],
    },
    {
      type: 'library',
      name: 'lodash',
      version: '4.17.21',
      purl: 'pkg:npm/lodash@4.17.21',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [],
    },
    {
      type: 'library',
      name: 'axios',
      version: '1.4.0',
      purl: 'pkg:npm/axios@1.4.0',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [],
    },
    {
      type: 'library',
      name: 'helmet',
      version: '7.0.0',
      purl: 'pkg:npm/helmet@7.0.0',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [],
    },
    {
      type: 'library',
      name: 'morgan',
      version: '1.10.0',
      purl: 'pkg:npm/morgan@1.10.0',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [
        {
          id: 'CVE-2023-12345',
          severity: 'medium',
          description: 'Log injection vulnerability in custom format',
        },
      ],
    },
    {
      type: 'library',
      name: 'redis',
      version: '4.6.7',
      purl: 'pkg:npm/redis@4.6.7',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [],
    },
    {
      type: 'library',
      name: 'bcrypt',
      version: '5.1.0',
      purl: 'pkg:npm/bcrypt@5.1.0',
      licenses: [{ id: 'MIT', name: 'MIT License' }],
      vulnerabilities: [],
    },
    {
      type: 'container',
      name: 'node',
      version: '18.17.0-alpine',
      purl: 'pkg:docker/node@18.17.0-alpine',
      vulnerabilities: [
        {
          id: 'CVE-2023-45678',
          severity: 'critical',
          description: 'Heap buffer overflow in V8 engine',
        },
      ],
    },
  ],
};

/**
 * SBOMViewer Component
 * @description Displays and exports SBOM in CycloneDX format
 */
export function SBOMViewer({ className }: SBOMViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [filterVulnerable, setFilterVulnerable] = useState(false);

  // Filter components based on search and vulnerability filter
  const filteredComponents = useMemo(() => {
    return mockSBOM.components.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.version.includes(searchQuery);
      const matchesVuln = !filterVulnerable || (comp.vulnerabilities && comp.vulnerabilities.length > 0);
      return matchesSearch && matchesVuln;
    });
  }, [searchQuery, filterVulnerable]);

  // Stats
  const stats = useMemo(() => ({
    total: mockSBOM.components.length,
    vulnerable: mockSBOM.components.filter(c => c.vulnerabilities && c.vulnerabilities.length > 0).length,
    critical: mockSBOM.components.flatMap(c => c.vulnerabilities || []).filter(v => v.severity === 'critical').length,
    high: mockSBOM.components.flatMap(c => c.vulnerabilities || []).filter(v => v.severity === 'high').length,
  }), []);

  /**
   * Toggle component expansion
   */
  const toggleExpand = (name: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedComponents(newExpanded);
  };

  /**
   * Export SBOM as CycloneDX JSON
   */
  const handleExport = () => {
    const json = JSON.stringify(mockSBOM, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sbom-cyclonedx-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const severityColors: Record<string, string> = {
    critical: 'bg-severity-critical/10 text-severity-critical border-severity-critical/30',
    high: 'bg-severity-high/10 text-severity-high border-severity-high/30',
    medium: 'bg-severity-medium/10 text-severity-medium border-severity-medium/30',
    low: 'bg-severity-low/10 text-severity-low border-severity-low/30',
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Package className="h-4 w-4 mr-1.5" />
        SBOM
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                'relative w-full max-w-4xl max-h-[85vh]',
                'rounded-2xl border border-border bg-background-card',
                'shadow-2xl overflow-hidden flex flex-col'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Package className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      Software Bill of Materials
                    </h2>
                    <p className="text-sm text-text-secondary">
                      CycloneDX {mockSBOM.specVersion} • {mockSBOM.components.length} components
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1.5" />
                    Export
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-3 p-4 bg-background-elevated/50 border-b border-border flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                  <p className="text-xs text-text-secondary">Components</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-severity-medium">{stats.vulnerable}</p>
                  <p className="text-xs text-text-secondary">Vulnerable</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-severity-critical">{stats.critical}</p>
                  <p className="text-xs text-text-secondary">Critical</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-severity-high">{stats.high}</p>
                  <p className="text-xs text-text-secondary">High</p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg',
                      'bg-background-elevated border border-border',
                      'text-sm text-text-primary placeholder:text-text-muted',
                      'focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none'
                    )}
                  />
                </div>
                <button
                  onClick={() => setFilterVulnerable(!filterVulnerable)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    filterVulnerable
                      ? 'bg-severity-high/10 text-severity-high border border-severity-high/30'
                      : 'bg-background-elevated text-text-secondary border border-border hover:border-primary/30'
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Vulnerable Only
                </button>
              </div>

              {/* Component List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredComponents.map((comp) => {
                  const isExpanded = expandedComponents.has(comp.name);
                  const hasVulns = comp.vulnerabilities && comp.vulnerabilities.length > 0;

                  return (
                    <div
                      key={`${comp.name}-${comp.version}`}
                      className={cn(
                        'rounded-lg border transition-all',
                        hasVulns
                          ? 'border-severity-high/30 bg-severity-high/5'
                          : 'border-border bg-background-elevated'
                      )}
                    >
                      <button
                        onClick={() => toggleExpand(comp.name)}
                        className="w-full p-4 text-left flex items-center gap-3"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-text-muted flex-shrink-0" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">{comp.name}</span>
                            <span className="text-xs text-text-muted font-mono">@{comp.version}</span>
                            <Badge
                              label={comp.type}
                              variant="default"
                              size="xs"
                            />
                          </div>
                          {comp.purl && (
                            <p className="text-xs text-text-muted font-mono mt-1 truncate">
                              {comp.purl}
                            </p>
                          )}
                        </div>

                        {hasVulns ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-severity-high" />
                            <span className="text-sm font-medium text-severity-high">
                              {comp.vulnerabilities!.length}
                            </span>
                          </div>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-severity-low flex-shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 space-y-3 ml-7">
                              {/* Licenses */}
                              {comp.licenses && comp.licenses.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-text-muted">License:</span>
                                  {comp.licenses.map(lic => (
                                    <Badge key={lic.id} label={lic.id} size="xs" variant="default" />
                                  ))}
                                </div>
                              )}

                              {/* Vulnerabilities */}
                              {hasVulns && (
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-text-secondary">Vulnerabilities:</p>
                                  {comp.vulnerabilities!.map(vuln => (
                                    <div
                                      key={vuln.id}
                                      className={cn(
                                        'p-3 rounded-lg border',
                                        severityColors[vuln.severity]
                                      )}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-mono font-medium">{vuln.id}</span>
                                        <Badge
                                          label={vuln.severity.toUpperCase()}
                                          size="xs"
                                          variant="default"
                                        />
                                      </div>
                                      <p className="text-xs text-text-secondary">{vuln.description}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-background-elevated/50 flex-shrink-0">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    Generated: {mockSBOM.metadata.timestamp.split('T')[0]}
                  </span>
                  <a
                    href="https://cyclonedx.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    CycloneDX Standard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SBOMViewer;

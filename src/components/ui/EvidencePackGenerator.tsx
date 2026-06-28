'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  FileJson,
  FileCode,
  CheckCircle2,
  Loader2,
  Package,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import Card from './Card';

// ============================================
// Evidence Pack Generator Component
// ============================================

/**
 * Evidence pack output types
 */
type OutputType = 'markdown' | 'json' | 'all';

/**
 * Evidence pack data interface
 */
interface EvidencePackData {
  /** Executive summary content */
  executiveSummary: string;
  /** Technical findings content */
  technicalFindings: string;
  /** Backlog items (tasks/recommendations) */
  backlog: Array<{
    id: string;
    title: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    effort: string;
    owner?: string;
  }>;
  /** Raw evidence data (for JSON export) */
  rawData: Record<string, unknown>;
  /** Project/analysis name */
  projectName: string;
  /** Generation timestamp */
  generatedAt: string;
}

interface EvidencePackGeneratorProps {
  /** Data to include in the evidence pack */
  data: EvidencePackData;
  /** Additional CSS classes */
  className?: string;
  /** Callback after successful generation */
  onGenerated?: (type: OutputType) => void;
}

/**
 * EvidencePackGenerator Component
 * @description Generates downloadable evidence packs (Markdown, JSON, CSV)
 */
export function EvidencePackGenerator({
  data,
  className,
  onGenerated,
}: EvidencePackGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<OutputType | null>(null);

  /**
   * Generate executive summary markdown
   */
  const generateExecutiveSummary = (): string => {
    return `# Executive Summary: ${data.projectName}

**Generated:** ${data.generatedAt}

---

${data.executiveSummary}

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Items | ${data.backlog.length} |
| Critical Priority | ${data.backlog.filter(b => b.priority === 'critical').length} |
| High Priority | ${data.backlog.filter(b => b.priority === 'high').length} |

## Next Steps

${data.backlog
  .filter(b => b.priority === 'critical' || b.priority === 'high')
  .slice(0, 5)
  .map((b, i) => `${i + 1}. **${b.title}** (${b.priority.toUpperCase()})`)
  .join('\n')}

---
*This report was automatically generated.*
`;
  };

  /**
   * Generate technical findings markdown
   */
  const generateTechnicalFindings = (): string => {
    return `# Technical Findings: ${data.projectName}

**Generated:** ${data.generatedAt}

---

${data.technicalFindings}

## Detailed Findings

${data.backlog.map(b => `
### ${b.title}

- **Priority:** ${b.priority.toUpperCase()}
- **Effort:** ${b.effort}
${b.owner ? `- **Owner:** ${b.owner}` : ''}
`).join('\n')}

---
*This report was automatically generated.*
`;
  };

  /**
   * Generate backlog CSV content
   */
  const generateBacklogCSV = (): string => {
    const headers = 'ID,Title,Priority,Effort,Owner';
    const rows = data.backlog.map(b => 
      `"${b.id}","${b.title}","${b.priority}","${b.effort}","${b.owner || 'Unassigned'}"`
    );
    return [headers, ...rows].join('\n');
  };

  /**
   * Download file helper
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Handle evidence pack generation
   */
  const handleGenerate = async (type: OutputType) => {
    setGenerating(true);
    
    // Simulate async generation
    await new Promise(resolve => setTimeout(resolve, 800));

    const timestamp = new Date().toISOString().split('T')[0];
    const projectSlug = data.projectName.toLowerCase().replace(/\s+/g, '-');

    if (type === 'markdown' || type === 'all') {
      downloadFile(
        generateExecutiveSummary(),
        `${projectSlug}-exec-summary-${timestamp}.md`,
        'text/markdown'
      );
      downloadFile(
        generateTechnicalFindings(),
        `${projectSlug}-technical-findings-${timestamp}.md`,
        'text/markdown'
      );
      downloadFile(
        generateBacklogCSV(),
        `${projectSlug}-backlog-${timestamp}.csv`,
        'text/csv'
      );
    }

    if (type === 'json' || type === 'all') {
      downloadFile(
        JSON.stringify(data.rawData, null, 2),
        `${projectSlug}-evidence-${timestamp}.json`,
        'application/json'
      );
    }

    setGenerating(false);
    setGenerated(type);
    onGenerated?.(type);

    // Reset after 3 seconds
    setTimeout(() => setGenerated(null), 3000);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="cyber"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Package className="h-4 w-4 mr-1.5" />
        Evidence Pack
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
                'relative w-full max-w-lg',
                'rounded-2xl border border-border bg-background-card',
                'shadow-2xl overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      Generate Evidence Pack
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Export analysis results as documentation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:bg-background-elevated hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-text-secondary">
                  The evidence pack includes:
                </p>

                <div className="space-y-2">
                  {[
                    { icon: FileText, label: 'EXEC_SUMMARY.md', desc: 'Executive summary for stakeholders' },
                    { icon: FileCode, label: 'TECHNICAL_FINDINGS.md', desc: 'Detailed technical analysis' },
                    { icon: FileText, label: 'BACKLOG.csv', desc: 'Prioritized action items' },
                    { icon: FileJson, label: 'EVIDENCE.json', desc: 'Machine-readable raw data' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated"
                    >
                      <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary font-mono">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generation Status */}
                {generated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-severity-low/10 text-severity-low"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Evidence pack downloaded!</span>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background-elevated/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleGenerate('all')}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1.5" />
                      Download All
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default EvidencePackGenerator;

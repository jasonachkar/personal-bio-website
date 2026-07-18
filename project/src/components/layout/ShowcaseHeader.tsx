'use client';

import Link from 'next/link';
import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import type { ReactNode } from 'react';

// ============================================
// ShowcaseHeader Component
// ============================================

/**
 * ShowcaseHeader - Consistent navigation header for live demo pages
 * @description Provides navigation and optional action buttons for showcase pages
 */
interface ShowcaseHeaderProps {
  /** Main title of the showcase/demo */
  title: string;
  /** Optional description/subtitle */
  description?: string;
  /** Additional CSS classes */
  className?: string;
  /** Optional action buttons to display on the right */
  actions?: ReactNode;
  /** Optional export handler */
  onExport?: () => void;
  /** Export button label */
  exportLabel?: string;
}

export function ShowcaseHeader({
  title,
  description,
  className,
  actions,
  onExport,
  exportLabel = 'Export',
}: ShowcaseHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-40',
        'border-b border-border bg-background/95 backdrop-blur-xl',
        className
      )}
    >
      <div className="content-container py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back Navigation + Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Back Button */}
            <Link
              href="/#projects"
              className={cn(
                'group flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2',
                'text-xs sm:text-sm font-medium text-text-secondary',
                'transition-all duration-200',
                'hover:bg-background-elevated hover:text-text-primary',
                'focus-ring',
                'active:scale-95',
                'flex-shrink-0'
              )}
              aria-label="Return to the projects section"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>

            {/* Separator */}
            <span
              className="hidden text-text-muted sm:inline"
              aria-hidden="true"
            >
              /
            </span>

            {/* Title */}
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-text-primary truncate">
                {title}
              </h1>
              {description && (
                <p className="hidden sm:block text-xs sm:text-sm text-text-secondary truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Custom actions */}
            {actions}

            {/* Export button */}
            {onExport && (
              <Button
                variant="primary"
                size="sm"
                onClick={onExport}
                className="hidden sm:inline-flex"
              >
                <Download className="h-4 w-4 mr-1.5" />
                {exportLabel}
              </Button>
            )}
            {onExport && (
              <Button
                variant="primary"
                size="sm"
                onClick={onExport}
                className="sm:hidden"
                aria-label={exportLabel}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Animated variant with fade-in effect
 */
export function AnimatedShowcaseHeader(props: ShowcaseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ShowcaseHeader {...props} />
    </motion.div>
  );
}

export default ShowcaseHeader;

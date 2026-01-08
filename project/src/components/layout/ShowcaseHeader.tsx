'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * ShowcaseHeader - Consistent navigation header for live demo pages
 *
 * Provides a "Back to Home" navigation affordance for all showcase/demo pages.
 * Ensures accessibility, keyboard navigation, and consistent UX across demos.
 *
 * @example
 * ```tsx
 * <ShowcaseHeader
 *   title="SIEM Detection Console"
 *   description="Real-time security event monitoring"
 * />
 * ```
 */

interface ShowcaseHeaderProps {
  /** Main title of the showcase/demo */
  title: string;
  /** Optional description/subtitle */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

export function ShowcaseHeader({
  title,
  description,
  className,
}: ShowcaseHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-border bg-background-card/50 backdrop-blur-sm',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Back to Home Navigation */}
          <div className="flex items-start gap-4">
            <Link
              href="/#showcases"
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2',
                'text-sm font-medium text-text-secondary',
                'transition-all duration-200',
                'hover:bg-background-elevated hover:text-text-primary',
                'focus-visible:outline focus-visible:outline-2',
                'focus-visible:outline-offset-2 focus-visible:outline-primary',
                'active:scale-95'
              )}
              aria-label="Return to interactive showcases section"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Back to Showcases</span>
              <span className="sm:hidden">Showcases</span>
            </Link>

            {/* Breadcrumb Separator */}
            <span
              className="hidden text-text-muted md:inline"
              aria-hidden="true"
            >
              /
            </span>

            {/* Current Page Title */}
            <div className="hidden md:flex md:flex-col">
              <h1 className="text-lg font-semibold text-text-primary">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-text-secondary">{description}</p>
              )}
            </div>
          </div>

          {/* Right: Optional Action Slot (for future use) */}
          <div className="flex items-center gap-2">
            {/* Reserved for future actions (e.g., settings, export) */}
          </div>
        </div>

        {/* Mobile Title (below back button) */}
        <div className="mt-3 md:hidden">
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Animated variant with fade-in effect
 * Use this for pages that want a subtle entrance animation
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

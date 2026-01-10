'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Writeup } from '@/lib/schemas';
import { markdownToHtml, githubUrlToRaw, sanitizeMarkdownHtml } from '@/lib/markdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ============================================
// WriteupViewer Component
// ============================================

/**
 * Category color mapping for badges
 */
const categoryColors: Record<string, string> = {
  tutorial: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  research: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'certification-notes': 'text-green-400 bg-green-400/10 border-green-400/20',
  'lab-report': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  analysis: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

/**
 * Internal content fetcher component
 * This component is unmounted and remounted for each new writeup
 * ensuring completely fresh state every time
 */
function WriteupContent({ writeup }: { writeup: Writeup }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchContent = async () => {
      if (!writeup.githubUrl) {
        setError('GitHub URL not available');
        setLoading(false);
        return;
      }

      try {
        const rawUrl = githubUrlToRaw(writeup.githubUrl);
        const apiUrl = `/api/writeups/fetch?url=${encodeURIComponent(rawUrl)}`;

        const response = await fetch(apiUrl, { signal });
        
        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        if (signal.aborted) return;

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.rendered) {
          const sanitized = sanitizeMarkdownHtml(data.content);
          setContent(sanitized);
          setIsRendered(true);
        } else {
          const html = markdownToHtml(data.content);
          setContent(html);
          setIsRendered(false);
        }
      } catch (err) {
        if (signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []); // Empty deps - this component is remounted for each writeup

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-text-secondary">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-8 w-8 text-severity-medium mb-4" />
        <p className="text-text-secondary mb-4 text-center">{error}</p>
        {writeup.githubUrl && (
          <a
            href={writeup.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2',
              'px-4 py-2 rounded-lg text-sm font-medium',
              'text-primary hover:text-primary-hover hover:bg-primary/10',
              'transition-colors'
            )}
          >
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </a>
        )}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-secondary">No content available</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'markdown-body',
        isRendered && 'github-rendered'
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

/**
 * WriteupViewer props interface
 */
interface WriteupViewerProps {
  writeup: Writeup;
  onClose: () => void;
}

/**
 * WriteupViewer Component
 * @description Modal component for displaying writeup content fetched from GitHub
 */
function WriteupViewerModal({ writeup, onClose }: WriteupViewerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        className={cn(
          'relative w-full max-w-4xl max-h-[90vh]',
          'overflow-hidden rounded-2xl',
          'border border-border bg-background-card',
          'shadow-2xl flex flex-col'
        )}
      >
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between',
          'border-b border-border bg-background-card/95 backdrop-blur-sm',
          'p-4 sm:p-6 flex-shrink-0'
        )}>
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
              {writeup.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{writeup.date}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{writeup.readingTime}</span>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-medium',
                  categoryColors[writeup.category] || categoryColors.tutorial
                )}
              >
                {writeup.category.replace('-', ' ')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {writeup.githubUrl && (
              <a
                href={writeup.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'hidden sm:inline-flex items-center gap-2',
                  'px-3 py-2 rounded-lg text-sm font-medium',
                  'text-primary hover:text-primary-hover hover:bg-primary/10',
                  'transition-colors focus-ring'
                )}
              >
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            )}
            <button
              onClick={onClose}
              className={cn(
                'rounded-lg p-2 text-text-secondary',
                'transition-colors hover:bg-background-elevated hover:text-text-primary',
                'focus-ring'
              )}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content - Key by writeup.id to force remount of content fetcher */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 custom-scrollbar">
          <WriteupContent key={writeup.id} writeup={writeup} />
        </div>

        {/* Mobile GitHub Link */}
        {writeup.githubUrl && (
          <div className="sm:hidden border-t border-border p-4 bg-background-card/95">
            <a
              href={writeup.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center justify-center gap-2 w-full',
                'px-4 py-2.5 rounded-lg text-sm font-medium',
                'bg-primary/10 text-primary border border-primary/30',
                'hover:bg-primary/20 transition-colors'
              )}
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * WriteupViewer Wrapper
 * This wrapper ensures the modal is properly animated in/out
 */
export function WriteupViewer({ 
  writeup, 
  onClose 
}: { 
  writeup: Writeup | null; 
  onClose: () => void;
}) {
  if (!writeup) return null;
  
  return (
    <AnimatePresence mode="wait">
      <WriteupViewerModal 
        key={`viewer-${writeup.id}`} 
        writeup={writeup} 
        onClose={onClose} 
      />
    </AnimatePresence>
  );
}

export default WriteupViewer;

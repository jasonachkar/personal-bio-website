'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Writeup } from '@/lib/schemas';
import { markdownToHtml, githubUrlToRaw, sanitizeMarkdownHtml } from '@/lib/markdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { writeupCategoryColors } from '@/utils/categoryColors';

// ============================================
// WriteupViewer Component
// ============================================

/**
 * WriteupViewer props interface
 */
interface WriteupViewerProps {
  writeup: Writeup;
  onClose: () => void;
}

/**
 * State for tracking fetch status
 */
interface FetchState {
  content: string | null;
  loading: boolean;
  error: string | null;
  isRendered: boolean;
  fetchedWriteupId: string | null; // Track which writeup the content belongs to
}

const initialFetchState: FetchState = {
  content: null,
  loading: true,
  error: null,
  isRendered: false,
  fetchedWriteupId: null,
};

/**
 * WriteupViewer Component
 * Shows loading state immediately and only displays content when fully loaded.
 * NEVER shows cached/stale content - always fetches fresh from GitHub API.
 */
export function WriteupViewer({ writeup, onClose }: WriteupViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Single state object to ensure atomic updates
  const [fetchState, setFetchState] = useState<FetchState>(initialFetchState);
  
  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Track the current writeup ID to prevent showing stale content
  const currentWriteupIdRef = useRef<string>(writeup.id);

  // Fetch content on mount - runs once per writeup
  useEffect(() => {
    // Update the current writeup ID ref
    currentWriteupIdRef.current = writeup.id;
    
    // Cancel any previous request immediately
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // CRITICAL: Reset to initial loading state - never show previous content
    setFetchState({
      content: null,
      loading: true,
      error: null,
      isRendered: false,
      fetchedWriteupId: null,
    });

    const fetchContent = async () => {
      if (!writeup.githubUrl) {
        setFetchState({
          content: null,
          loading: false,
          error: 'GitHub URL not available',
          isRendered: false,
          fetchedWriteupId: writeup.id,
        });
        return;
      }

      try {
        const rawUrl = githubUrlToRaw(writeup.githubUrl);
        
        // Add cache-busting timestamp to URL to prevent any caching
        const cacheBuster = Date.now();
        const apiUrl = `/api/writeups/fetch?url=${encodeURIComponent(rawUrl)}&_t=${cacheBuster}`;

        const response = await fetch(apiUrl, { 
          signal: abortController.signal,
          // Prevent browser from caching the response
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        
        // Check if aborted or if we're fetching for a different writeup now
        if (abortController.signal.aborted || currentWriteupIdRef.current !== writeup.id) {
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        // Check again after JSON parsing
        if (abortController.signal.aborted || currentWriteupIdRef.current !== writeup.id) {
          return;
        }

        if (data.error) {
          throw new Error(data.error);
        }

        // Validate that content exists
        if (!data.content || typeof data.content !== 'string') {
          throw new Error('Invalid content received from server');
        }

        // Process content
        let processedContent: string;
        let rendered = false;
        
        if (data.rendered) {
          processedContent = sanitizeMarkdownHtml(data.content);
          rendered = true;
        } else {
          processedContent = markdownToHtml(data.content);
        }

        // Final check before setting state - ensure we're still showing this writeup
        if (abortController.signal.aborted || currentWriteupIdRef.current !== writeup.id) {
          return;
        }

        // Set state atomically with the writeup ID to verify it matches
        setFetchState({
          content: processedContent,
          loading: false,
          error: null,
          isRendered: rendered,
          fetchedWriteupId: writeup.id,
        });
        
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        // Only set error if this is still the current writeup
        if (!abortController.signal.aborted && currentWriteupIdRef.current === writeup.id) {
          setFetchState({
            content: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load content',
            isRendered: false,
            fetchedWriteupId: writeup.id,
          });
        }
      }
    };

    fetchContent();

    // Cleanup: abort on unmount and reset state
    return () => {
      abortController.abort();
    };
  }, [writeup.id, writeup.githubUrl]);

  // Handle escape key and body scroll
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

  // Memoize close handler to prevent unnecessary re-renders
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Destructure state for easier access
  const { content, loading, error, isRendered, fetchedWriteupId } = fetchState;
  
  // CRITICAL SAFEGUARD: Only show content if it belongs to the current writeup
  // If the fetched content is for a different writeup, show loading instead
  const isContentValid = fetchedWriteupId === writeup.id;
  const shouldShowLoading = loading || (!isContentValid && !error);
  const shouldShowError = !loading && error && isContentValid;
  const shouldShowContent = !loading && !error && content && isContentValid;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0.05 }}
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
                  writeupCategoryColors[writeup.category] || writeupCategoryColors.tutorial
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
                  'transition-colors'
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
                'transition-colors hover:bg-background-elevated hover:text-text-primary'
              )}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 custom-scrollbar">
          {/* Loading State - Show when loading OR when content doesn't match current writeup */}
          {shouldShowLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="absolute inset-0 h-12 w-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
              </div>
              <p className="text-text-secondary mt-4 font-medium">Loading writeup...</p>
              <p className="text-text-muted text-sm mt-1">Fetching content from GitHub</p>
            </div>
          )}

          {/* Error State - Only show if error belongs to current writeup */}
          {shouldShowError && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-12 w-12 text-severity-medium mb-4" />
              <p className="text-text-primary font-medium mb-2">Failed to load content</p>
              <p className="text-text-secondary mb-4 text-center text-sm">{error}</p>
              {writeup.githubUrl && (
                <a
                  href={writeup.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2',
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'bg-primary text-white hover:bg-primary-hover',
                    'transition-colors'
                  )}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </a>
              )}
            </div>
          )}

          {/* Content - Only show when content is valid and matches current writeup */}
          {shouldShowContent && (
            <div
              className={cn(
                'markdown-body',
                isRendered && 'github-rendered'
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Mobile GitHub Link */}
        {writeup.githubUrl && (
          <div className="sm:hidden border-t border-border p-4 bg-background-card/95 flex-shrink-0">
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
    </motion.div>
  );
}

export default WriteupViewer;

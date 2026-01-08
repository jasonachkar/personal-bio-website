'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Clock, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Writeup } from '@/lib/schemas';
import { markdownToHtml, githubUrlToRaw, sanitizeMarkdownHtml } from '@/lib/markdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface WriteupViewerProps {
  writeup: Writeup | null;
  onClose: () => void;
}

export function WriteupViewer({ writeup, onClose }: WriteupViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!writeup?.githubUrl) {
      setError('GitHub URL not available');
      return;
    }

    setLoading(true);
    setError(null);
    setContent('');

    const rawUrl = githubUrlToRaw(writeup.githubUrl);
    
    // Use API route to proxy the fetch (bypasses CSP)
    const apiUrl = `/api/writeups/fetch?url=${encodeURIComponent(rawUrl)}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.rendered) {
          // GitHub API returned rendered HTML - sanitize and use directly
          const sanitized = sanitizeMarkdownHtml(data.content);
          setContent(sanitized);
          setIsRendered(true);
        } else {
          // Fallback: render markdown ourselves
          const html = markdownToHtml(data.content);
          setContent(html);
          setIsRendered(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load content');
        setLoading(false);
      });
  }, [writeup]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && writeup) {
        onClose();
      }
    };

    if (writeup) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [writeup, onClose]);

  const categoryColors = {
    tutorial: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    research: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'certification-notes': 'text-green-400 bg-green-400/10 border-green-400/20',
    'lab-report': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    analysis: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  };

  if (!writeup) return null;

  return (
    <AnimatePresence>
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
          key={writeup.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-background-card shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background-card/95 backdrop-blur-sm p-6 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-text-primary mb-2 pr-8">{writeup.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{writeup.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{writeup.readingTime}</span>
                </div>
                <span className={cn('px-2.5 py-1 rounded-full border text-xs font-medium', categoryColors[writeup.category])}>
                  {writeup.category.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {writeup.githubUrl && (
                <a
                  href={writeup.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-card"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </a>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-card"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-text-secondary">Loading content...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-8 w-8 text-severity-medium mb-4" />
                <p className="text-text-secondary mb-4">{error}</p>
                {writeup.githubUrl && (
                  <a
                    href={writeup.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>
                )}
              </div>
            )}

            {!loading && !error && content && (
              <div
                className={`markdown-body ${isRendered ? 'github-rendered' : ''}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


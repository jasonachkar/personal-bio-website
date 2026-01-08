'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CaseStudy } from '../types';
import { ImpactMetrics } from './ImpactMetrics';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CaseStudyViewerProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
}

export function CaseStudyViewer({ caseStudy, onClose }: CaseStudyViewerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background-card shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background-card/95 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-bold text-text-primary">{caseStudy.title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(caseStudy.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{caseStudy.duration}</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-primary/20 text-primary text-xs font-semibold uppercase">
                {caseStudy.category}
              </span>
            </div>

            {/* Problem */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Problem Statement</h3>
              <p className="text-text-secondary leading-relaxed">{caseStudy.problem}</p>
            </section>

            {/* Analysis */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Security Analysis</h3>
              <p className="text-text-secondary leading-relaxed">{caseStudy.analysis}</p>
            </section>

            {/* Solution */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Solution Implementation</h3>
              <p className="text-text-secondary leading-relaxed">{caseStudy.solution}</p>
            </section>

            {/* Impact Metrics */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Measurable Impact
              </h3>
              <ImpactMetrics metrics={caseStudy.impact} />
            </section>

            {/* Technologies */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-background-elevated text-text-primary border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Lessons Learned */}
            <section>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Lessons Learned</h3>
              <ul className="space-y-2">
                {caseStudy.lessonsLearned.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


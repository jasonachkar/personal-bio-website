'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import { CaseStudyCard } from '@/features/case-studies/components/CaseStudyCard';
import { CaseStudyViewer } from '@/features/case-studies/components/CaseStudyViewer';
import { caseStudies } from '@/features/case-studies/data';
import type { CaseStudy } from '@/features/case-studies/types';
import { scrollVariants, staggerContainer, viewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CaseStudies() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);

  return (
    <>
      <Section id="case-studies" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            eyebrow="Case Studies"
            title="Real-World Security Solutions"
            subtitle="Detailed case studies showcasing security challenges, analysis, implementation, and measurable impact"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportSettings}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {caseStudies.map((caseStudy, index) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                onClick={() => setSelectedCaseStudy(caseStudy)}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </Section>

      <CaseStudyViewer
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </>
  );
}


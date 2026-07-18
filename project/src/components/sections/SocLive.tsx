'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, ExternalLink } from 'lucide-react';
import { SiemDetectionConsole } from '@/features/siem/components/SiemDetectionConsole';
import { scrollVariants, getViewportSettings, easings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * SOC Live section — embeds the interactive SIEM detection console on the
 * homepage with a link out to the full-page version.
 */
const SocLive = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);

  const headerVariants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  return (
    <section id="siem" className="section-container relative">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />

      <div className="content-container relative">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-severity-low/30 bg-severity-low/5 px-4 py-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: easings.easeOutQuint }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-severity-low opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-severity-low" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-severity-low">
              SOC Live
            </span>
          </motion.div>

          <h2 className="text-headline text-text-primary">SIEM Detection Console</h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
            Interactive security event monitoring with custom detection rules mapped to MITRE
            ATT&amp;CK — explore events, detections, and the query builder below, or{' '}
            <a
              href="/siem"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover"
            >
              open the full console
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            .
          </p>
        </motion.div>

        {/* Embedded console */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="rounded-2xl border border-border bg-background-card"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:px-5">
            <Activity className="h-4 w-4 text-severity-low" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              live detection console
            </span>
          </div>
          <SiemDetectionConsole />
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SocLive);

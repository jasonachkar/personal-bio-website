import { memo, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Writeup } from '@/lib/schemas';
import { scrollVariants, staggerContainer, getViewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { WriteupViewer } from './WriteupViewer';
import { WriteupCard } from './WriteupCard';

interface WriteupsProps {
  writeups: Writeup[];
}

const Writeups = ({ writeups }: WriteupsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  
  // Track both the writeup and a unique key to force remount
  const [selectedWriteup, setSelectedWriteup] = useState<Writeup | null>(null);
  const [viewerKey, setViewerKey] = useState(0);

  // Handler to open a writeup - increments key to force complete remount
  const handleOpenWriteup = useCallback((writeup: Writeup) => {
    setViewerKey(prev => prev + 1);
    setSelectedWriteup(writeup);
  }, []);

  // Handler to close - resets everything
  const handleCloseWriteup = useCallback(() => {
    setSelectedWriteup(null);
  }, []);
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);

  return (
    <>
    <section
      id="writeups"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Writeups & Learning
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Technical articles, research notes, and documentation from my cybersecurity learning journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {writeups.map((writeup) => (
            <WriteupCard
              key={writeup.id}
              writeup={writeup}
              onOpen={handleOpenWriteup}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        <motion.div
          variants={useMemo(() => prefersReducedMotion ? {} : scrollVariants.fade, [prefersReducedMotion])}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary">
            More writeups and technical content coming soon. Follow my learning journey on{' '}
            <a
              href="https://github.com/jasonachkar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary-hover"
            >
              GitHub
            </a>
            .
          </p>
        </motion.div>
      </div>
      </section>

      {/* AnimatePresence ensures proper unmount/mount animation */}
      <AnimatePresence mode="wait">
        {selectedWriteup && (
          <WriteupViewer
            key={`writeup-viewer-${viewerKey}`}
            writeup={selectedWriteup}
            onClose={handleCloseWriteup}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Writeups);

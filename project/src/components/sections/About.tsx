import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target } from 'lucide-react';
import Card from '../ui/Card';
import type { About } from '@/lib/schemas';
import { scrollVariants, staggerContainer, getViewportSettings } from '@/utils/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface AboutProps {
  content: About;
}

const About = ({ content }: AboutProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const viewport = getViewportSettings(isMobile);
  const headerVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const paragraphVariants = useMemo(() => prefersReducedMotion ? {} : scrollVariants.fadeUp, [prefersReducedMotion]);
  const containerVariants = useMemo(() => prefersReducedMotion ? {} : staggerContainer, [prefersReducedMotion]);

  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            About Me
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium text-text-secondary">
            {content.title}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={viewport}
            className="lg:col-span-2 space-y-6"
          >
            {content.paragraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                variants={paragraphVariants}
                custom={index}
              >
                <p className="text-lg leading-relaxed text-text-secondary">
                  {paragraph}
                </p>
              </motion.div>
            ))}

            <motion.div
              variants={paragraphVariants}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">Focus Areas</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-text-secondary">{area}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? {} : scrollVariants.slideRight}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Core Strengths</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              viewport={viewport}
              className="space-y-3"
            >
              {content.coreStrengths.map((strength, index) => (
                <motion.div
                  key={index}
                  variants={prefersReducedMotion ? {} : scrollVariants.scaleFade}
                >
                  <Card className="border border-border bg-background-card p-4">
                    <h4 className="mb-1 font-semibold text-primary">{strength.title}</h4>
                    <p className="text-sm text-text-secondary">{strength.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(About);

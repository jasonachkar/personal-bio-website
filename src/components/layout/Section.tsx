import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  accent?: boolean;
};

const Section = ({ id, className, children, accent = false }: SectionProps) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className={cn(
      'relative py-16 md:py-24',
      accent && 'before:absolute before:inset-x-0 before:bottom-0 before:top-10 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:blur-3xl',
      className,
    )}
  >
    <div className="relative mx-auto max-w-6xl px-6">{children}</div>
  </motion.section>
);

export default Section;

import { motion } from 'framer-motion';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ eyebrow, title, subtitle }: SectionHeaderProps) => (
  <div className="mb-8 flex flex-col gap-2">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="text-sm font-mono uppercase tracking-[0.2em] text-primary"
    >
      {eyebrow}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-3xl md:text-4xl"
    >
      {title}
    </motion.h2>
    {subtitle && <p className="max-w-2xl text-text-secondary">{subtitle}</p>}
  </div>
);

export default SectionHeader;

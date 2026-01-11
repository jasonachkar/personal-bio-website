import { memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { categoryColors } from '@/constants/ui';
import type { Writeup } from '@/lib/schemas';
import { scrollVariants } from '@/utils/animations';

interface WriteupCardProps {
  writeup: Writeup;
  onOpen: (writeup: Writeup) => void;
  prefersReducedMotion: boolean;
}

export const WriteupCard = memo(({ writeup, onOpen, prefersReducedMotion }: WriteupCardProps) => {
  const itemVariants = prefersReducedMotion ? {} : scrollVariants.cardReveal;

  return (
    <motion.div variants={itemVariants}>
      <Card className="group relative h-full overflow-hidden border border-border bg-background-card transition-all hover:border-primary/50 hover:shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span
              className={`rounded-full border px-2 py-1 text-xs font-medium ${
                categoryColors[writeup.category] || categoryColors.tutorial
              }`}
            >
              {writeup.category.replace('-', ' ')}
            </span>
          </div>

          <h3 className="mb-3 text-xl font-semibold text-text-primary transition-colors group-hover:text-primary">
            {writeup.title}
          </h3>

          <p className="mb-4 text-sm text-text-secondary">
            {writeup.description}
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {writeup.readingTime}
            </span>
            <span>{writeup.date}</span>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {writeup.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
            {writeup.tags.length > 3 && (
              <span className="flex items-center text-xs text-text-muted">
                +{writeup.tags.length - 3}
              </span>
            )}
          </div>

          <button
            onClick={() => onOpen(writeup)}
            className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-card rounded"
            aria-label={`Read more about ${writeup.title}`}
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute inset-0 border-2 border-primary/0 transition-all group-hover:border-primary/20 pointer-events-none" />
      </Card>
    </motion.div>
  );
});

WriteupCard.displayName = 'WriteupCard';

import { motion } from 'framer-motion';
import { FileText, Clock, Tag, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Writeup } from '@/lib/schemas';

interface WriteupsProps {
  writeups: Writeup[];
}

const categoryColors = {
  tutorial: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  research: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'certification-notes': 'text-green-400 bg-green-400/10 border-green-400/20',
  'lab-report': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  analysis: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

const Writeups = ({ writeups }: WriteupsProps) => {
  return (
    <section
      id="writeups"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Writeups & Learning
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Technical articles, research notes, and documentation from my cybersecurity learning journey
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {writeups.map((writeup, index) => (
            <motion.div
              key={writeup.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="group relative h-full overflow-hidden border border-border bg-background-card transition-all hover:border-primary/50 hover:shadow-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-medium ${
                        categoryColors[writeup.category]
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

                  <button className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute inset-0 border-2 border-primary/0 transition-all group-hover:border-primary/20" />
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary">
            More writeups and technical content coming soon. Follow my learning journey on{' '}
            <a
              href="https://github.com/yourusername"
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
  );
};

export default Writeups;

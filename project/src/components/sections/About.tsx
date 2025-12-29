import { motion } from 'framer-motion';
import { CheckCircle2, Target } from 'lucide-react';
import Card from '../ui/Card';
import type { About } from '@/lib/schemas';

interface AboutProps {
  content: About;
}

const About = ({ content }: AboutProps) => (
  <section id="about" className="relative overflow-hidden py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
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
        <div className="lg:col-span-2 space-y-6">
          {content.paragraphs.map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-lg leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Core Strengths</h3>
            <div className="space-y-3">
              {content.coreStrengths.map((strength, index) => (
                <Card
                  key={index}
                  className="border border-border bg-background-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <h4 className="mb-1 font-semibold text-primary">{strength.title}</h4>
                  <p className="text-sm text-text-secondary">{strength.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default About;

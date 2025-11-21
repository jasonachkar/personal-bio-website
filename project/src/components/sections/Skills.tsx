import { motion } from 'framer-motion';
import { skillCategories } from '../../data/skills';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const iconGradients = [
  'from-primary/50 to-secondary/60',
  'from-accent/50 to-primary/50',
  'from-secondary/70 to-accent/60',
];

const Skills = () => (
  <Section id="skills">
    <SectionHeader
      eyebrow="Skills"
      title="End-to-end delivery with security at the table."
      subtitle="From API design and UI polish to threat modeling and detection engineering, I stay hands-on across the stack."
    />
    <div className="grid gap-6 md:grid-cols-3">
      {skillCategories.map((category, idx) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
        >
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-primary">{category.title}</div>
                <p className="mt-2 text-sm text-slate-300">{category.summary}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${iconGradients[idx % iconGradients.length]} opacity-80 blur-[1px]`}
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.tools.map((tool) => (
                <Badge key={tool} label={tool} className="bg-white/5 text-xs" />
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);

export default Skills;

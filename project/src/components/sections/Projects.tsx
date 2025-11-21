import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import { projects } from '../../data/projects';
import ProjectCard from './ProjectCard';

const categories: Array<{ id: 'cyber' | 'software' | 'game'; label: string; blurb: string }> = [
  {
    id: 'cyber',
    label: 'Cybersecurity',
    blurb: 'Bug bounty cases, SIEM dashboards, and adversary emulation work.',
  },
  {
    id: 'software',
    label: 'Software',
    blurb: 'Reliable full-stack delivery with observability and DX in mind.',
  },
  {
    id: 'game',
    label: 'Game Dev',
    blurb: 'WebGL / PlayCanvas prototypes exploring mechanics and feel.',
  },
];

const Projects = () => (
  <Section id="projects">
    <SectionHeader
      eyebrow="Projects"
      title="Selected work across security, software, and games."
      subtitle="Highlights with roles, tech stacks, and links to demos or source."
    />

    <div className="space-y-12">
      {categories.map((category) => {
        const filtered = projects.filter((project) => project.category === category.id);
        return (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-primary">{category.label}</p>
                <p className="text-slate-300">{category.blurb}</p>
              </div>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-white/30 to-transparent md:block" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </Section>
);

export default Projects;

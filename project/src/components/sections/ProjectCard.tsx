import { motion } from 'framer-motion';
import type { Project } from '../../data/types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Button } from '../ui/Button';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card className="flex h-full flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <div
          className="h-40 w-full bg-gradient-to-br from-primary/10 via-accent/10 to-transparent transition duration-300 hover:scale-[1.01]"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(124,255,228,0.14), rgba(161,102,255,0.12)), url(${project.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label={`${project.title} thumbnail`}
        />
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
          {project.category}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{project.role}</p>
          <h3 className="mt-1 text-xl text-white">{project.title}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {project.tech[0]}
        </span>
      </div>
      <p className="text-sm text-slate-300">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" href={project.demoUrl ?? project.repoUrl} target="_blank" rel="noreferrer">
          {project.demoUrl ? 'Live demo' : 'View'}
        </Button>
        <Button variant="ghost" href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub
        </Button>
      </div>
    </Card>
  </motion.div>
);

export default ProjectCard;

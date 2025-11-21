'use client';

import { useState } from 'react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Github, ExternalLink, FolderGit2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Project } from '@/types';
import { cn } from '@/lib/cn';

interface ProjectsSectionProps {
  projects: Project[];
}

type CategoryFilter = 'all' | 'cybersecurity' | 'software' | 'game' | 'other';

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'software', label: 'Software' },
    { value: 'game', label: 'Games' },
  ];

  return (
    <SectionContainer id="projects" background="grid">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">Projects</h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-primary via-primary-purple to-primary-green"></div>
          </div>

          {/* Filter buttons */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={cn(
                  'rounded-lg border px-6 py-2 text-sm font-medium transition-all',
                  activeFilter === cat.value
                    ? 'border-primary bg-primary text-background shadow-glow'
                    : 'border-border bg-background-card text-text-secondary hover:border-primary hover:text-text-primary'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-lg border border-border bg-background-card p-12 text-center">
              <FolderGit2 className="mx-auto mb-4 h-16 w-16 text-text-muted" />
              <p className="text-lg text-text-secondary">
                No projects in this category yet. Add some to your Supabase database!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.05}>
                  <div className="group flex h-full flex-col rounded-lg border border-border bg-background-card transition-all hover:border-primary hover:shadow-card-hover">
                    {/* Thumbnail */}
                    {project.thumbnail_url ? (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-background-elevated">
                        <img
                          src={project.thumbnail_url}
                          alt={project.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 via-primary-purple/20 to-background-elevated">
                        <div className="flex h-full items-center justify-center">
                          <FolderGit2 className="h-16 w-16 text-primary/40" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-2 text-xl font-bold text-text-primary">{project.name}</h3>
                      <p className="mb-4 flex-1 text-sm text-text-secondary">{project.short_description}</p>

                      {/* Tech stack */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tech_stack.slice(0, 4).map((tech) => (
                          <Badge key={tech} label={tech} />
                        ))}
                        {project.tech_stack.length > 4 && (
                          <Badge label={`+${project.tech_stack.length - 4}`} />
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary transition-all hover:border-primary hover:text-primary"
                          >
                            <Github className="h-4 w-4" />
                            Code
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-3 py-2 text-sm text-primary transition-all hover:bg-primary hover:text-background"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}

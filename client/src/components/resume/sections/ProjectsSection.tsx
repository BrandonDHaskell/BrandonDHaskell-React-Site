import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Project } from '../../../types/resume';
import { SectionTitle } from './SectionTitle';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = React.memo(
  ({ projects }) => (
    <section aria-labelledby="projects-heading">
      <SectionTitle id="projects-heading">Projects</SectionTitle>

      <div className="space-y-6">
        {projects.map((project) => (
          <article key={project.name}>
            <h3 className="flex items-center gap-1.5 font-medium text-zinc-900">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  {project.name}
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                </a>
              ) : (
                project.name
              )}
            </h3>

            <p className="mt-1 text-sm text-zinc-700">{project.description}</p>

            {project.highlights.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                {project.highlights.map((h) => (
                  <li key={h.text} className="flex gap-2">
                    <span aria-hidden="true" className="select-none text-zinc-300">
                      —
                    </span>
                    {h.text}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tech stack">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  ),
);

ProjectsSection.displayName = 'ProjectsSection';

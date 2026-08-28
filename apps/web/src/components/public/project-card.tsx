import type { Project } from '@whoisockyo/shared';
import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-primary/35">
      {project.thumbnailUrl ? (
        <div className="aspect-[16/9] overflow-hidden border-b border-border bg-muted">
          <img
            src={project.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-end border-b border-border bg-gradient-to-br from-muted to-background p-5">
          <span className="font-mono text-xs text-muted-foreground">./projects/{project.slug}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="technical-label mb-2">{project.status.replaceAll('_', ' ')}</p>
            <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={`View ${project.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{project.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-4 pt-6 text-sm">
          <Link className="font-medium hover:text-primary" to={`/projects/${project.slug}`}>
            Case study
          </Link>
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> Source
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

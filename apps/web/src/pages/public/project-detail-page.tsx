import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { queryKeys } from '@/lib/query-keys';
import { portfolioService } from '@/services/portfolio.service';

export default function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const projectQuery = useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => portfolioService.getProject(slug),
    enabled: Boolean(slug),
    retry: false,
  });

  useDocumentTitle(`${projectQuery.data?.title ?? 'Project'} — whoisockyo`);

  if (projectQuery.isLoading) {
    return (
      <div className="container-shell section-space">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div className="container-shell section-space">
        <ErrorState message="This project could not be found or is not published." />
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 text-sm hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </div>
    );
  }

  const project = projectQuery.data;

  return (
    <article className="container-shell section-space">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.35fr]">
        <div>
          <p className="technical-label">{project.status.replaceAll('_', ' ')}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">
            {project.shortDescription}
          </p>
        </div>
        <aside className="border-l border-border pl-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Stack</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <Badge key={technology}>{technology}</Badge>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-sm">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" /> Visit live project
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Github className="h-4 w-4" /> View repository
              </a>
            ) : null}
          </div>
        </aside>
      </div>

      {project.thumbnailUrl ? (
        <img
          src={project.thumbnailUrl}
          alt={`${project.title} interface preview`}
          className="mt-14 aspect-[16/8] w-full rounded-2xl border border-border object-cover shadow-soft"
        />
      ) : (
        <div className="mt-14 flex aspect-[16/7] items-center justify-center rounded-2xl border border-border bg-card font-mono text-sm text-muted-foreground">
          ./projects/{project.slug}
        </div>
      )}

      <div className="mx-auto mt-14 max-w-3xl">
        <p className="technical-label">Overview</p>
        <div className="mt-5 whitespace-pre-line text-lg leading-9 text-muted-foreground">
          {project.description}
        </div>
      </div>
    </article>
  );
}

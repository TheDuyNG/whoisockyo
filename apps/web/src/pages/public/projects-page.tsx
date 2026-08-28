import { useQuery } from '@tanstack/react-query';

import { ProjectCard } from '@/components/public/project-card';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { queryKeys } from '@/lib/query-keys';
import { portfolioService } from '@/services/portfolio.service';

export default function ProjectsPage() {
  useDocumentTitle('Projects — whoisockyo');
  const portfolioQuery = useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: portfolioService.getPortfolio,
  });

  return (
    <div className="container-shell section-space">
      <p className="technical-label">Selected archive</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
        Projects built to last.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        A selection of product engineering, system design, and interface work—from initial model to
        final detail.
      </p>

      <div className="mt-12">
        {portfolioQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
        {portfolioQuery.isError ? (
          <ErrorState
            message="Projects could not be loaded."
            onRetry={() => void portfolioQuery.refetch()}
          />
        ) : null}
        {portfolioQuery.data?.projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Published projects will appear here." />
        ) : null}
        {portfolioQuery.data?.projects.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {portfolioQuery.data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

import type { Project, ProjectInput } from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmButton } from '@/components/dashboard/confirm-button';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { ProjectForm } from '@/features/projects/project-form';
import { ApiClientError } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

export default function DashboardProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects,
    queryFn: adminService.getProjects,
  });

  function refreshProjects(): void {
    void queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  }

  const saveMutation = useMutation({
    mutationFn: (input: ProjectInput) =>
      selectedProject
        ? adminService.updateProject(selectedProject.id, input)
        : adminService.createProject(input),
    onSuccess: () => {
      refreshProjects();
      setIsFormOpen(false);
      setSelectedProject(null);
      toast.success(selectedProject ? 'Project updated.' : 'Project created.');
    },
    onError: (error: Error) =>
      toast.error(error instanceof ApiClientError ? error.message : 'Project could not be saved.'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteProject,
    onSuccess: () => {
      refreshProjects();
      toast.success('Project deleted.');
    },
    onError: (error: Error) =>
      toast.error(
        error instanceof ApiClientError ? error.message : 'Project could not be deleted.',
      ),
  });

  function openCreateForm(): void {
    setSelectedProject(null);
    setIsFormOpen(true);
  }

  function openEditForm(project: Project): void {
    setSelectedProject(project);
    setIsFormOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create, publish, feature, and order portfolio projects."
        action={
          <Button onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        }
      />
      {projectsQuery.isLoading ? <LoadingSkeleton rows={5} /> : null}
      {projectsQuery.isError ? <ErrorState message="Projects could not be loaded." /> : null}
      {projectsQuery.data?.length === 0 ? (
        <EmptyState
          title="No projects"
          description="Create your first portfolio project to get started."
        />
      ) : null}
      {projectsQuery.data?.length ? (
        <div className="grid gap-4">
          {projectsQuery.data.map((project) => (
            <Card key={project.id} className="p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{project.title}</h2>
                    <Badge className={project.published ? 'border-primary/30 text-primary' : ''}>
                      {project.published ? 'Published' : 'Draft'}
                    </Badge>
                    {project.featured ? <Badge>Featured</Badge> : null}
                  </div>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {project.shortDescription}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((technology) => (
                      <Badge key={technology}>{technology}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {project.published ? (
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClassName({ variant: 'ghost', size: 'sm' })}
                      aria-label={`View ${project.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  <Button variant="ghost" size="sm" onClick={() => openEditForm(project)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <ConfirmButton
                    variant="ghost"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onConfirm={() => deleteMutation.mutate(project.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </ConfirmButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <Modal
        title={selectedProject ? 'Edit project' : 'New project'}
        description="Project content is validated before it is published."
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <ProjectForm
          project={selectedProject}
          isPending={saveMutation.isPending}
          onSubmit={(input) => saveMutation.mutate(input)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </>
  );
}

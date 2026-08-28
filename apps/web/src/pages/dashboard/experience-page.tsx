import type { Experience, ExperienceInput } from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmButton } from '@/components/dashboard/confirm-button';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { ExperienceForm } from '@/features/experience/experience-form';
import { ApiClientError } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

export default function ExperiencePage() {
  const queryClient = useQueryClient();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const experienceQuery = useQuery({
    queryKey: queryKeys.experience,
    queryFn: adminService.getExperience,
  });

  function refreshExperience(): void {
    void queryClient.invalidateQueries({ queryKey: queryKeys.experience });
    void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  }

  const saveMutation = useMutation({
    mutationFn: (input: ExperienceInput) =>
      selectedExperience
        ? adminService.updateExperience(selectedExperience.id, input)
        : adminService.createExperience(input),
    onSuccess: () => {
      refreshExperience();
      setIsFormOpen(false);
      toast.success(selectedExperience ? 'Experience updated.' : 'Experience added.');
    },
    onError: (error: Error) =>
      toast.error(
        error instanceof ApiClientError ? error.message : 'Experience could not be saved.',
      ),
  });
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteExperience,
    onSuccess: () => {
      refreshExperience();
      toast.success('Experience deleted.');
    },
  });

  return (
    <>
      <PageHeader
        title="Experience"
        description="Maintain the career timeline shown on your portfolio."
        action={
          <Button
            onClick={() => {
              setSelectedExperience(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add entry
          </Button>
        }
      />
      {experienceQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {experienceQuery.isError ? <ErrorState message="Experience could not be loaded." /> : null}
      {experienceQuery.data?.length === 0 ? (
        <EmptyState title="No experience" description="Add a role to begin your timeline." />
      ) : null}
      <div className="grid gap-4">
        {experienceQuery.data?.map((experience) => (
          <Card key={experience.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold">{experience.position}</h2>
                <p className="mt-1 text-sm text-primary">{experience.company}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {new Date(experience.startDate).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  —{' '}
                  {experience.isCurrent
                    ? 'Present'
                    : experience.endDate
                      ? new Date(experience.endDate).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {experience.technologies.map((technology) => (
                    <Badge key={technology}>{technology}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedExperience(experience);
                    setIsFormOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <ConfirmButton
                  variant="ghost"
                  size="sm"
                  onConfirm={() => deleteMutation.mutate(experience.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </ConfirmButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title={selectedExperience ? 'Edit experience' : 'Add experience'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <ExperienceForm
          experience={selectedExperience}
          isPending={saveMutation.isPending}
          onSubmit={(input) => saveMutation.mutate(input)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </>
  );
}

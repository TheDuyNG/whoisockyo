import type { Skill, SkillInput } from '@whoisockyo/shared';
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
import { SkillForm } from '@/features/skills/skill-form';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const skillsQuery = useQuery({ queryKey: queryKeys.skills, queryFn: adminService.getSkills });

  function refreshSkills(): void {
    void queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  }

  const saveMutation = useMutation({
    mutationFn: (input: SkillInput) =>
      selectedSkill
        ? adminService.updateSkill(selectedSkill.id, input)
        : adminService.createSkill(input),
    onSuccess: () => {
      refreshSkills();
      setIsFormOpen(false);
      toast.success(selectedSkill ? 'Skill updated.' : 'Skill added.');
    },
    onError: () => toast.error('Skill could not be saved.'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteSkill,
    onSuccess: () => {
      refreshSkills();
      toast.success('Skill deleted.');
    },
  });

  return (
    <>
      <PageHeader
        title="Skills"
        description="Group and order the capabilities shown on your portfolio."
        action={
          <Button
            onClick={() => {
              setSelectedSkill(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add skill
          </Button>
        }
      />
      {skillsQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {skillsQuery.isError ? <ErrorState message="Skills could not be loaded." /> : null}
      {skillsQuery.data?.length === 0 ? (
        <EmptyState
          title="No skills"
          description="Add a capability to start building your skill groups."
        />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {skillsQuery.data?.map((skill) => (
          <Card key={skill.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{skill.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Badge>{skill.category}</Badge>
                  {skill.proficiency ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {skill.proficiency}%
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setIsFormOpen(true);
                  }}
                  aria-label={`Edit ${skill.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmButton
                  variant="ghost"
                  size="sm"
                  onConfirm={() => deleteMutation.mutate(skill.id)}
                  aria-label={`Delete ${skill.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title={selectedSkill ? 'Edit skill' : 'Add skill'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <SkillForm
          skill={selectedSkill}
          isPending={saveMutation.isPending}
          onSubmit={(input) => saveMutation.mutate(input)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </>
  );
}

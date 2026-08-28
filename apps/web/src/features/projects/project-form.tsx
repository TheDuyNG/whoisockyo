import { zodResolver } from '@hookform/resolvers/zod';
import { projectInputSchema, type Project, type ProjectInput } from '@whoisockyo/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FieldShell, Input, Textarea } from '@/components/ui/form-field';

type ProjectFormInput = z.input<typeof projectInputSchema>;

const emptyProject: ProjectFormInput = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: null,
  repositoryUrl: null,
  liveUrl: null,
  technologies: [],
  status: 'COMPLETED',
  featured: false,
  published: false,
  displayOrder: 0,
};

export function ProjectForm({
  project,
  isPending,
  onSubmit,
  onCancel,
}: {
  project: Project | null;
  isPending: boolean;
  onSubmit: (input: ProjectInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<ProjectFormInput, unknown, ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: emptyProject,
  });

  useEffect(() => {
    form.reset(project ?? emptyProject);
  }, [form, project]);

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell label="Title" name="project-title" error={form.formState.errors.title?.message}>
          <Input id="project-title" {...form.register('title')} />
        </FieldShell>
        <FieldShell label="Slug" name="project-slug" error={form.formState.errors.slug?.message}>
          <Input id="project-slug" placeholder="project-name" {...form.register('slug')} />
        </FieldShell>
      </div>
      <FieldShell
        label="Short description"
        name="project-short-description"
        error={form.formState.errors.shortDescription?.message}
      >
        <Textarea id="project-short-description" rows={3} {...form.register('shortDescription')} />
      </FieldShell>
      <FieldShell
        label="Description"
        name="project-description"
        error={form.formState.errors.description?.message}
      >
        <Textarea id="project-description" rows={8} {...form.register('description')} />
      </FieldShell>
      <Controller
        control={form.control}
        name="technologies"
        render={({ field, fieldState }) => (
          <FieldShell
            label="Technologies"
            name="project-technologies"
            error={fieldState.error?.message}
            hint="Separate entries with commas."
          >
            <Input
              id="project-technologies"
              value={(field.value ?? []).join(', ')}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange(
                  event.target.value
                    .split(',')
                    .map((technology) => technology.trim())
                    .filter(Boolean),
                )
              }
            />
          </FieldShell>
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {(['thumbnailUrl', 'repositoryUrl', 'liveUrl'] as const).map((fieldName) => (
          <Controller
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field, fieldState }) => (
              <FieldShell
                label={
                  {
                    thumbnailUrl: 'Thumbnail URL',
                    repositoryUrl: 'Repository URL',
                    liveUrl: 'Live URL',
                  }[fieldName]
                }
                name={`project-${fieldName}`}
                error={fieldState.error?.message}
              >
                <Input
                  id={`project-${fieldName}`}
                  type="url"
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              </FieldShell>
            )}
          />
        ))}
        <FieldShell
          label="Status"
          name="project-status"
          error={form.formState.errors.status?.message}
        >
          <select
            id="project-status"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            {...form.register('status')}
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </FieldShell>
        <FieldShell
          label="Display order"
          name="project-order"
          error={form.formState.errors.displayOrder?.message}
        >
          <Input id="project-order" type="number" min={0} {...form.register('displayOrder')} />
        </FieldShell>
      </div>
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[hsl(var(--primary))]"
            {...form.register('featured')}
          />
          Featured project
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[hsl(var(--primary))]"
            {...form.register('published')}
          />
          Published publicly
        </label>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : project ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  );
}

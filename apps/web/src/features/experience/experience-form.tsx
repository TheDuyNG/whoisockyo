import { zodResolver } from '@hookform/resolvers/zod';
import { experienceInputSchema, type Experience, type ExperienceInput } from '@whoisockyo/shared';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FieldShell, Input, Textarea } from '@/components/ui/form-field';

const experienceFormSchema = z.object({
  company: z.string().trim().min(2).max(120),
  companyUrl: z.union([z.string().trim().url(), z.literal('')]),
  position: z.string().trim().min(2).max(120),
  location: z.string().trim().max(120),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string(),
  isCurrent: z.boolean(),
  description: z.string().trim().min(10).max(5_000),
  technologies: z.string(),
  displayOrder: z.coerce.number().int().min(0),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const emptyExperience: ExperienceFormValues = {
  company: '',
  companyUrl: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  technologies: '',
  displayOrder: 0,
};

function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : '';
}

export function ExperienceForm({
  experience,
  isPending,
  onSubmit,
  onCancel,
}: {
  experience: Experience | null;
  isPending: boolean;
  onSubmit: (input: ExperienceInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: emptyExperience,
  });
  const isCurrent = form.watch('isCurrent');

  useEffect(() => {
    form.reset(
      experience
        ? {
            company: experience.company,
            companyUrl: experience.companyUrl ?? '',
            position: experience.position,
            location: experience.location,
            startDate: toDateInput(experience.startDate),
            endDate: toDateInput(experience.endDate),
            isCurrent: experience.isCurrent,
            description: experience.description,
            technologies: experience.technologies.join(', '),
            displayOrder: experience.displayOrder,
          }
        : emptyExperience,
    );
  }, [experience, form]);

  function handleSubmit(values: ExperienceFormValues): void {
    const input = experienceInputSchema.parse({
      ...values,
      companyUrl: values.companyUrl || null,
      startDate: new Date(`${values.startDate}T00:00:00.000Z`),
      endDate:
        values.isCurrent || !values.endDate ? null : new Date(`${values.endDate}T00:00:00.000Z`),
      technologies: values.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean),
    });
    onSubmit(input);
  }

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell
          label="Company"
          name="experience-company"
          error={form.formState.errors.company?.message}
        >
          <Input id="experience-company" {...form.register('company')} />
        </FieldShell>
        <FieldShell
          label="Position"
          name="experience-position"
          error={form.formState.errors.position?.message}
        >
          <Input id="experience-position" {...form.register('position')} />
        </FieldShell>
        <FieldShell
          label="Company URL"
          name="experience-company-url"
          error={form.formState.errors.companyUrl?.message}
        >
          <Input id="experience-company-url" type="url" {...form.register('companyUrl')} />
        </FieldShell>
        <FieldShell
          label="Location"
          name="experience-location"
          error={form.formState.errors.location?.message}
        >
          <Input id="experience-location" {...form.register('location')} />
        </FieldShell>
        <FieldShell
          label="Start date"
          name="experience-start-date"
          error={form.formState.errors.startDate?.message}
        >
          <Input id="experience-start-date" type="date" {...form.register('startDate')} />
        </FieldShell>
        <FieldShell
          label="End date"
          name="experience-end-date"
          error={form.formState.errors.endDate?.message}
        >
          <Input
            id="experience-end-date"
            type="date"
            disabled={isCurrent}
            {...form.register('endDate')}
          />
        </FieldShell>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[hsl(var(--primary))]"
          {...form.register('isCurrent')}
        />
        I currently work here
      </label>
      <FieldShell
        label="Description"
        name="experience-description"
        error={form.formState.errors.description?.message}
      >
        <Textarea id="experience-description" rows={6} {...form.register('description')} />
      </FieldShell>
      <FieldShell
        label="Technologies"
        name="experience-technologies"
        hint="Separate entries with commas."
      >
        <Input id="experience-technologies" {...form.register('technologies')} />
      </FieldShell>
      <FieldShell
        label="Display order"
        name="experience-order"
        error={form.formState.errors.displayOrder?.message}
      >
        <Input id="experience-order" type="number" min={0} {...form.register('displayOrder')} />
      </FieldShell>
      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : experience ? 'Save changes' : 'Add experience'}
        </Button>
      </div>
    </form>
  );
}

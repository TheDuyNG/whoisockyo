import { zodResolver } from '@hookform/resolvers/zod';
import { skillInputSchema, type Skill, type SkillInput } from '@whoisockyo/shared';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FieldShell, Input } from '@/components/ui/form-field';

const skillFormSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.enum(['LANGUAGE', 'FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TOOL']),
  proficiency: z.union([z.literal(''), z.coerce.number().int().min(1).max(100)]),
  icon: z.string().trim().max(80),
  displayOrder: z.coerce.number().int().min(0),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

const emptySkill: SkillFormValues = {
  name: '',
  category: 'FRONTEND',
  proficiency: '',
  icon: '',
  displayOrder: 0,
};

export function SkillForm({
  skill,
  isPending,
  onSubmit,
  onCancel,
}: {
  skill: Skill | null;
  isPending: boolean;
  onSubmit: (input: SkillInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: emptySkill,
  });

  useEffect(() => {
    form.reset(
      skill
        ? {
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency ?? '',
            icon: skill.icon ?? '',
            displayOrder: skill.displayOrder,
          }
        : emptySkill,
    );
  }, [form, skill]);

  function handleSubmit(values: SkillFormValues): void {
    onSubmit(
      skillInputSchema.parse({
        ...values,
        proficiency: values.proficiency === '' ? null : values.proficiency,
        icon: values.icon || null,
      }),
    );
  }

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldShell label="Name" name="skill-name" error={form.formState.errors.name?.message}>
        <Input id="skill-name" {...form.register('name')} />
      </FieldShell>
      <FieldShell
        label="Category"
        name="skill-category"
        error={form.formState.errors.category?.message}
      >
        <select
          id="skill-category"
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          {...form.register('category')}
        >
          <option value="LANGUAGE">Language</option>
          <option value="FRONTEND">Frontend</option>
          <option value="BACKEND">Backend</option>
          <option value="DATABASE">Database</option>
          <option value="DEVOPS">DevOps</option>
          <option value="TOOL">Tool</option>
        </select>
      </FieldShell>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell
          label="Proficiency"
          name="skill-proficiency"
          error={form.formState.errors.proficiency?.message}
          hint="Optional, from 1 to 100."
        >
          <Input
            id="skill-proficiency"
            type="number"
            min={1}
            max={100}
            {...form.register('proficiency')}
          />
        </FieldShell>
        <FieldShell
          label="Icon key"
          name="skill-icon"
          error={form.formState.errors.icon?.message}
          hint="Optional semantic icon identifier."
        >
          <Input id="skill-icon" {...form.register('icon')} />
        </FieldShell>
      </div>
      <FieldShell
        label="Display order"
        name="skill-order"
        error={form.formState.errors.displayOrder?.message}
      >
        <Input id="skill-order" type="number" min={0} {...form.register('displayOrder')} />
      </FieldShell>
      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : skill ? 'Save changes' : 'Add skill'}
        </Button>
      </div>
    </form>
  );
}

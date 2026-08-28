import { zodResolver } from '@hookform/resolvers/zod';
import { socialLinkInputSchema, type SocialLink, type SocialLinkInput } from '@whoisockyo/shared';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FieldShell, Input } from '@/components/ui/form-field';

const socialLinkFormSchema = z.object({
  platform: z.string().trim().min(1).max(80),
  url: z.string().trim().url().max(2_048),
  icon: z.string().trim().max(80),
  displayOrder: z.coerce.number().int().min(0),
  isVisible: z.boolean(),
});

type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;

const emptySocialLink: SocialLinkFormValues = {
  platform: '',
  url: '',
  icon: '',
  displayOrder: 0,
  isVisible: true,
};

export function SocialLinkForm({
  socialLink,
  isPending,
  onSubmit,
  onCancel,
}: {
  socialLink: SocialLink | null;
  isPending: boolean;
  onSubmit: (input: SocialLinkInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: emptySocialLink,
  });

  useEffect(() => {
    form.reset(
      socialLink
        ? {
            platform: socialLink.platform,
            url: socialLink.url,
            icon: socialLink.icon ?? '',
            displayOrder: socialLink.displayOrder,
            isVisible: socialLink.isVisible,
          }
        : emptySocialLink,
    );
  }, [form, socialLink]);

  function handleSubmit(values: SocialLinkFormValues): void {
    onSubmit(socialLinkInputSchema.parse({ ...values, icon: values.icon || null }));
  }

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldShell
        label="Platform"
        name="social-platform"
        error={form.formState.errors.platform?.message}
      >
        <Input id="social-platform" placeholder="GitHub" {...form.register('platform')} />
      </FieldShell>
      <FieldShell label="URL" name="social-url" error={form.formState.errors.url?.message}>
        <Input id="social-url" type="url" {...form.register('url')} />
      </FieldShell>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell label="Icon key" name="social-icon" error={form.formState.errors.icon?.message}>
          <Input id="social-icon" {...form.register('icon')} />
        </FieldShell>
        <FieldShell
          label="Display order"
          name="social-order"
          error={form.formState.errors.displayOrder?.message}
        >
          <Input id="social-order" type="number" min={0} {...form.register('displayOrder')} />
        </FieldShell>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[hsl(var(--primary))]"
          {...form.register('isVisible')}
        />
        Visible on public pages
      </label>
      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : socialLink ? 'Save changes' : 'Add link'}
        </Button>
      </div>
    </form>
  );
}

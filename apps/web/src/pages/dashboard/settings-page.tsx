import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordInputSchema,
  siteSettingsInputSchema,
  type ChangePasswordInput,
  type SiteSettingsInput,
} from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PageHeader } from '@/components/dashboard/page-header';
import { ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FieldShell, Input, Textarea } from '@/components/ui/form-field';
import { ApiClientError } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';
import { authService } from '@/services/auth.service';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: queryKeys.settings,
    queryFn: adminService.getSettings,
  });
  const settingsForm = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsInputSchema),
    defaultValues: {
      siteTitle: '',
      siteDescription: '',
      seoTitle: '',
      seoDescription: '',
      isContactFormEnabled: true,
    },
  });
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInputSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      settingsForm.reset(settingsQuery.data);
    }
  }, [settingsForm, settingsQuery.data]);

  const settingsMutation = useMutation({
    mutationFn: adminService.updateSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings, settings);
      void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
      settingsForm.reset(settings);
      toast.success('Site settings updated.');
    },
    onError: (error: Error) =>
      toast.error(error instanceof ApiClientError ? error.message : 'Settings could not be saved.'),
  });
  const passwordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success('Password changed. Other sessions are no longer valid.');
    },
    onError: (error: Error) =>
      toast.error(
        error instanceof ApiClientError ? error.message : 'Password could not be changed.',
      ),
  });

  return (
    <>
      <PageHeader
        title="Settings"
        description="Control site metadata, contact availability, and administrator security."
      />
      {settingsQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {settingsQuery.isError ? <ErrorState message="Settings could not be loaded." /> : null}
      {settingsQuery.data ? (
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <h2 className="font-semibold">Site settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Metadata and public contact behavior.
            </p>
            <form
              className="mt-6 grid gap-5"
              onSubmit={settingsForm.handleSubmit((values) => settingsMutation.mutate(values))}
            >
              <FieldShell
                label="Site title"
                name="site-title"
                error={settingsForm.formState.errors.siteTitle?.message}
              >
                <Input id="site-title" {...settingsForm.register('siteTitle')} />
              </FieldShell>
              <FieldShell
                label="Site description"
                name="site-description"
                error={settingsForm.formState.errors.siteDescription?.message}
              >
                <Textarea
                  id="site-description"
                  rows={3}
                  {...settingsForm.register('siteDescription')}
                />
              </FieldShell>
              <FieldShell
                label="SEO title"
                name="seo-title"
                error={settingsForm.formState.errors.seoTitle?.message}
              >
                <Input id="seo-title" {...settingsForm.register('seoTitle')} />
              </FieldShell>
              <FieldShell
                label="SEO description"
                name="seo-description"
                error={settingsForm.formState.errors.seoDescription?.message}
              >
                <Textarea
                  id="seo-description"
                  rows={3}
                  {...settingsForm.register('seoDescription')}
                />
              </FieldShell>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                  {...settingsForm.register('isContactFormEnabled')}
                />
                Accept messages through the public contact form
              </label>
              <Button
                type="submit"
                disabled={settingsMutation.isPending || !settingsForm.formState.isDirty}
              >
                {settingsMutation.isPending ? 'Saving…' : 'Save site settings'}
              </Button>
            </form>
          </Card>

          <Card className="h-fit p-6">
            <h2 className="font-semibold">Change password</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Use at least 12 characters with uppercase, lowercase, and a number.
            </p>
            <form
              className="mt-6 grid gap-5"
              onSubmit={passwordForm.handleSubmit((values) => passwordMutation.mutate(values))}
            >
              <FieldShell
                label="Current password"
                name="current-password"
                error={passwordForm.formState.errors.currentPassword?.message}
              >
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register('currentPassword')}
                />
              </FieldShell>
              <FieldShell
                label="New password"
                name="new-password"
                error={passwordForm.formState.errors.newPassword?.message}
              >
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('newPassword')}
                />
              </FieldShell>
              <Button type="submit" variant="secondary" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}

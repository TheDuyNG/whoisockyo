import { zodResolver } from '@hookform/resolvers/zod';
import { profileInputSchema, type ProfileInput } from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { PageHeader } from '@/components/dashboard/page-header';
import { ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FieldShell, Input, Textarea } from '@/components/ui/form-field';
import { ApiClientError } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

type ProfileFormInput = z.input<typeof profileInputSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: queryKeys.profile, queryFn: adminService.getProfile });
  const form = useForm<ProfileFormInput, unknown, ProfileInput>({
    resolver: zodResolver(profileInputSchema),
    defaultValues: {
      name: '',
      headline: '',
      shortBio: '',
      bio: '',
      philosophy: '',
      currentFocus: '',
      location: '',
      email: '',
      avatarUrl: null,
      resumeUrl: null,
      availabilityStatus: 'AVAILABLE',
    },
  });
  const updateMutation = useMutation({
    mutationFn: adminService.updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile, profile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
      toast.success('Profile updated.');
      form.reset(profile);
    },
    onError: (error: Error) =>
      toast.error(error instanceof ApiClientError ? error.message : 'Profile update failed.'),
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileQuery.data);
    }
  }, [form, profileQuery.data]);

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage the identity and introduction shown publicly."
      />
      {profileQuery.isLoading ? <LoadingSkeleton rows={5} /> : null}
      {profileQuery.isError ? <ErrorState message="Profile data could not be loaded." /> : null}
      {profileQuery.data ? (
        <form
          className="grid gap-6"
          onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
        >
          <Card className="grid gap-5 p-6 sm:grid-cols-2">
            <FieldShell label="Name" name="name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register('name')} />
            </FieldShell>
            <FieldShell label="Email" name="email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" {...form.register('email')} />
            </FieldShell>
            <div className="sm:col-span-2">
              <FieldShell
                label="Headline"
                name="headline"
                error={form.formState.errors.headline?.message}
              >
                <Input id="headline" {...form.register('headline')} />
              </FieldShell>
            </div>
            <div className="sm:col-span-2">
              <FieldShell
                label="Short bio"
                name="shortBio"
                error={form.formState.errors.shortBio?.message}
              >
                <Textarea id="shortBio" rows={3} {...form.register('shortBio')} />
              </FieldShell>
            </div>
            <div className="sm:col-span-2">
              <FieldShell label="Full bio" name="bio" error={form.formState.errors.bio?.message}>
                <Textarea id="bio" rows={7} {...form.register('bio')} />
              </FieldShell>
            </div>
            <FieldShell
              label="Philosophy"
              name="philosophy"
              error={form.formState.errors.philosophy?.message}
            >
              <Textarea id="philosophy" rows={4} {...form.register('philosophy')} />
            </FieldShell>
            <FieldShell
              label="Current focus"
              name="currentFocus"
              error={form.formState.errors.currentFocus?.message}
            >
              <Textarea id="currentFocus" rows={4} {...form.register('currentFocus')} />
            </FieldShell>
            <FieldShell
              label="Location"
              name="location"
              error={form.formState.errors.location?.message}
            >
              <Input id="location" {...form.register('location')} />
            </FieldShell>
            <FieldShell
              label="Availability"
              name="availabilityStatus"
              error={form.formState.errors.availabilityStatus?.message}
            >
              <select
                id="availabilityStatus"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                {...form.register('availabilityStatus')}
              >
                <option value="AVAILABLE">Available</option>
                <option value="LIMITED">Limited availability</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </FieldShell>
            <FieldShell
              label="Avatar URL"
              name="avatarUrl"
              error={form.formState.errors.avatarUrl?.message}
            >
              <Input
                id="avatarUrl"
                type="url"
                {...form.register('avatarUrl')}
                value={form.watch('avatarUrl') ?? ''}
              />
            </FieldShell>
            <FieldShell
              label="Résumé URL"
              name="resumeUrl"
              error={form.formState.errors.resumeUrl?.message}
            >
              <Input
                id="resumeUrl"
                type="url"
                {...form.register('resumeUrl')}
                value={form.watch('resumeUrl') ?? ''}
              />
            </FieldShell>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
              {updateMutation.isPending ? 'Saving…' : 'Save profile'}
            </Button>
          </div>
        </form>
      ) : null}
    </>
  );
}

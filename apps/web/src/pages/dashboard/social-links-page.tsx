import type { SocialLink, SocialLinkInput } from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmButton } from '@/components/dashboard/confirm-button';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { SocialLinkForm } from '@/features/social-links/social-link-form';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

export default function SocialLinksPage() {
  const queryClient = useQueryClient();
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const linksQuery = useQuery({
    queryKey: queryKeys.socialLinks,
    queryFn: adminService.getSocialLinks,
  });

  function refreshLinks(): void {
    void queryClient.invalidateQueries({ queryKey: queryKeys.socialLinks });
    void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
  }

  const saveMutation = useMutation({
    mutationFn: (input: SocialLinkInput) =>
      selectedLink
        ? adminService.updateSocialLink(selectedLink.id, input)
        : adminService.createSocialLink(input),
    onSuccess: () => {
      refreshLinks();
      setIsFormOpen(false);
      toast.success(selectedLink ? 'Social link updated.' : 'Social link added.');
    },
    onError: () => toast.error('Social link could not be saved.'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteSocialLink,
    onSuccess: () => {
      refreshLinks();
      toast.success('Social link deleted.');
    },
  });

  return (
    <>
      <PageHeader
        title="Social links"
        description="Control where visitors can find you elsewhere."
        action={
          <Button
            onClick={() => {
              setSelectedLink(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add link
          </Button>
        }
      />
      {linksQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}
      {linksQuery.isError ? <ErrorState message="Social links could not be loaded." /> : null}
      {linksQuery.data?.length === 0 ? (
        <EmptyState title="No social links" description="Add your first public profile link." />
      ) : null}
      <div className="grid gap-3">
        {linksQuery.data?.map((link) => (
          <Card
            key={link.id}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-medium">{link.platform}</h2>
                <Badge>{link.isVisible ? 'Visible' : 'Hidden'}</Badge>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-primary"
              >
                {link.url} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedLink(link);
                  setIsFormOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <ConfirmButton
                variant="ghost"
                size="sm"
                onConfirm={() => deleteMutation.mutate(link.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </ConfirmButton>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title={selectedLink ? 'Edit social link' : 'Add social link'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <SocialLinkForm
          socialLink={selectedLink}
          isPending={saveMutation.isPending}
          onSubmit={(input) => saveMutation.mutate(input)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </>
  );
}

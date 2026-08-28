import type { ContactMessage } from '@whoisockyo/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmButton } from '@/components/dashboard/confirm-button';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/async-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { queryKeys } from '@/lib/query-keys';
import { adminService } from '@/services/admin.service';

type MessageStatus = 'all' | 'read' | 'unread';

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MessageStatus>('all');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const messagesQuery = useQuery({
    queryKey: queryKeys.messages(status, page),
    queryFn: () => adminService.getMessages({ status, page, pageSize: 12 }),
  });

  function refreshMessages(): void {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      adminService.updateMessageStatus(id, isRead),
    onSuccess: (message) => {
      refreshMessages();
      setSelectedMessage((current) => (current?.id === message.id ? message : current));
    },
    onError: () => toast.error('Message status could not be updated.'),
  });
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteMessage,
    onSuccess: () => {
      refreshMessages();
      setSelectedMessage(null);
      toast.success('Message deleted.');
    },
    onError: () => toast.error('Message could not be deleted.'),
  });

  function openMessage(message: ContactMessage): void {
    setSelectedMessage(message);
    if (!message.isRead) {
      statusMutation.mutate({ id: message.id, isRead: true });
    }
  }

  return (
    <>
      <PageHeader
        title="Messages"
        description="Read and manage messages submitted through the contact form."
      />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Message status filter">
        {(['all', 'unread', 'read'] as const).map((filterStatus) => (
          <Button
            key={filterStatus}
            size="sm"
            variant={status === filterStatus ? 'secondary' : 'ghost'}
            onClick={() => {
              setStatus(filterStatus);
              setPage(1);
            }}
          >
            {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
          </Button>
        ))}
      </div>
      {messagesQuery.isLoading ? <LoadingSkeleton rows={5} /> : null}
      {messagesQuery.isError ? <ErrorState message="Messages could not be loaded." /> : null}
      {messagesQuery.data?.items.length === 0 ? (
        <EmptyState title="No messages" description="There are no messages matching this filter." />
      ) : null}
      <div className="grid gap-3">
        {messagesQuery.data?.items.map((message) => (
          <Card
            key={message.id}
            className={`cursor-pointer p-4 transition hover:border-primary/35 ${message.isRead ? '' : 'border-primary/25 bg-primary/[0.025]'}`}
            onClick={() => openMessage(message)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openMessage(message);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-0.5 rounded-lg p-2 ${message.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}
              >
                {message.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className={message.isRead ? 'font-medium' : 'font-semibold'}>
                      {message.subject}
                    </h2>
                    {!message.isRead ? (
                      <Badge className="border-primary/30 text-primary">New</Badge>
                    ) : null}
                  </div>
                  <time
                    className="font-mono text-[11px] text-muted-foreground"
                    dateTime={message.createdAt}
                  >
                    {new Date(message.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {message.name} · {message.email}
                </p>
                <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{message.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {messagesQuery.data && messagesQuery.data.pagination.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            Page {page} of {messagesQuery.data.pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= messagesQuery.data.pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <Modal
        title={selectedMessage?.subject ?? 'Message'}
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
      >
        {selectedMessage ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="font-medium">{selectedMessage.name}</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <time className="text-xs text-muted-foreground">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="whitespace-pre-wrap py-6 text-sm leading-7 text-muted-foreground">
              {selectedMessage.message}
            </p>
            <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
              <Button
                variant="secondary"
                onClick={() =>
                  statusMutation.mutate({ id: selectedMessage.id, isRead: !selectedMessage.isRead })
                }
                disabled={statusMutation.isPending}
              >
                {selectedMessage.isRead ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <MailOpen className="h-4 w-4" />
                )}
                Mark {selectedMessage.isRead ? 'unread' : 'read'}
              </Button>
              <ConfirmButton
                variant="destructive"
                onConfirm={() => deleteMutation.mutate(selectedMessage.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </ConfirmButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

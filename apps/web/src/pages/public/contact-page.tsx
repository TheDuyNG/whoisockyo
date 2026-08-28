import { zodResolver } from '@hookform/resolvers/zod';
import { contactMessageInputSchema, type ContactMessageInput } from '@whoisockyo/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FieldShell, Input, Textarea } from '@/components/ui/form-field';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { ApiClientError } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { portfolioService } from '@/services/portfolio.service';

export default function ContactPage() {
  useDocumentTitle('Contact — whoisockyo');
  const portfolioQuery = useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: portfolioService.getPortfolio,
  });
  const form = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageInputSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });
  const sendMessageMutation = useMutation({
    mutationFn: portfolioService.sendMessage,
    onSuccess: () => {
      toast.success('Message sent. I’ll get back to you soon.');
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(
        error instanceof ApiClientError ? error.message : 'Your message could not be sent.',
      );
    },
  });
  const profile = portfolioQuery.data?.profile;
  const settings = portfolioQuery.data?.settings;

  return (
    <div className="container-shell section-space">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="technical-label">Open channel</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Let’s build something considered.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Tell me about the problem, the people it affects, and what a strong outcome looks like.
          </p>
          {profile?.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-flex items-center gap-2 text-sm hover:text-primary"
            >
              <Mail className="h-4 w-4" /> {profile.email}
            </a>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {portfolioQuery.data?.socialLinks.map((socialLink) => (
              <a
                key={socialLink.id}
                href={socialLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                {socialLink.platform} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          {settings && !settings.isContactFormEnabled ? (
            <div className="py-12 text-center">
              <h2 className="text-xl font-semibold">The contact form is paused.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please use the email address on this page instead.
              </p>
            </div>
          ) : (
            <form
              className="grid gap-5"
              onSubmit={form.handleSubmit((values) => sendMessageMutation.mutate(values))}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell label="Name" name="name" error={form.formState.errors.name?.message}>
                  <Input id="name" autoComplete="name" {...form.register('name')} />
                </FieldShell>
                <FieldShell label="Email" name="email" error={form.formState.errors.email?.message}>
                  <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
                </FieldShell>
              </div>
              <FieldShell
                label="Subject"
                name="subject"
                error={form.formState.errors.subject?.message}
              >
                <Input id="subject" {...form.register('subject')} />
              </FieldShell>
              <FieldShell
                label="Message"
                name="message"
                error={form.formState.errors.message?.message}
              >
                <Textarea id="message" rows={7} {...form.register('message')} />
              </FieldShell>
              <Button type="submit" size="lg" disabled={sendMessageMutation.isPending}>
                {sendMessageMutation.isPending ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

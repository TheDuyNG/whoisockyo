import { zodResolver } from '@hookform/resolvers/zod';
import { loginInputSchema, type LoginInput } from '@whoisockyo/shared';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FieldShell, Input } from '@/components/ui/form-field';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { ApiClientError } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-context';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  useDocumentTitle('Dashboard sign in — whoisockyo');
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: { email: '', password: '' },
  });
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (authenticatedAdmin) => {
      setAdmin(authenticatedAdmin);
      const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      void navigate(destination, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error instanceof ApiClientError ? error.message : 'Sign in failed.');
    },
  });

  if (admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Return to portfolio
        </Link>
        <Card className="p-7 sm:p-8">
          <div className="mb-7">
            <span className="mb-4 inline-flex rounded-xl border border-border bg-muted p-3 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">Administrator access</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sign in to manage portfolio content and messages.
            </p>
          </div>
          <form
            className="grid gap-5"
            onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
          >
            <FieldShell label="Email" name="email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
            </FieldShell>
            <FieldShell
              label="Password"
              name="password"
              error={form.formState.errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register('password')}
              />
            </FieldShell>
            <Button className="mt-1" type="submit" size="lg" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>
        <p className="mt-5 text-center font-mono text-[11px] text-muted-foreground">
          Protected administrative surface
        </p>
      </div>
    </main>
  );
}

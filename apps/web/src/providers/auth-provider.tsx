import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { queryKeys } from '@/lib/query-keys';
import { authService } from '@/services/auth.service';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const shouldCheckSession =
    location.pathname === '/login' || location.pathname.startsWith('/dashboard');
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: authService.getSession,
    retry: false,
    staleTime: 5 * 60 * 1_000,
    enabled: shouldCheckSession,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      admin: sessionQuery.data ?? null,
      isLoading: shouldCheckSession && sessionQuery.isLoading,
      setAdmin: (admin) => queryClient.setQueryData(queryKeys.session, admin),
      signOut: async () => {
        await authService.logout();
        queryClient.setQueryData(queryKeys.session, null);
        queryClient.removeQueries({ queryKey: ['admin'] });
      },
    }),
    [queryClient, sessionQuery.data, sessionQuery.isLoading, shouldCheckSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

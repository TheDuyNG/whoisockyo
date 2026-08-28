import type { AuthenticatedAdmin } from '@whoisockyo/shared';
import { createContext, useContext } from 'react';

export interface AuthContextValue {
  admin: AuthenticatedAdmin | null;
  isLoading: boolean;
  setAdmin: (admin: AuthenticatedAdmin) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}

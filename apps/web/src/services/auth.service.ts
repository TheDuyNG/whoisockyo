import type { AuthenticatedAdmin, ChangePasswordInput, LoginInput } from '@whoisockyo/shared';

import { apiRequest, jsonBody } from '@/lib/api-client';

export const authService = {
  login(input: LoginInput) {
    return apiRequest<AuthenticatedAdmin>('/auth/login', {
      method: 'POST',
      body: jsonBody(input),
    });
  },

  getSession() {
    return apiRequest<AuthenticatedAdmin>('/auth/session');
  },

  logout() {
    return apiRequest<null>('/auth/logout', { method: 'POST' });
  },

  changePassword(input: ChangePasswordInput) {
    return apiRequest<AuthenticatedAdmin>('/auth/change-password', {
      method: 'POST',
      body: jsonBody(input),
    });
  },
};

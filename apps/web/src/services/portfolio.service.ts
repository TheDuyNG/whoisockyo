import type { ContactMessageInput, Portfolio, Project } from '@whoisockyo/shared';

import { apiRequest, jsonBody } from '@/lib/api-client';

export const portfolioService = {
  getPortfolio() {
    return apiRequest<Portfolio>('/portfolio');
  },

  getProject(slug: string) {
    return apiRequest<Project>(`/projects/${encodeURIComponent(slug)}`);
  },

  sendMessage(input: ContactMessageInput) {
    return apiRequest<{ id: string }>('/contact', {
      method: 'POST',
      body: jsonBody(input),
    });
  },
};

export const queryKeys = {
  session: ['session'] as const,
  portfolio: ['portfolio'] as const,
  project: (slug: string) => ['project', slug] as const,
  dashboard: ['dashboard'] as const,
  profile: ['admin', 'profile'] as const,
  projects: ['admin', 'projects'] as const,
  experience: ['admin', 'experience'] as const,
  skills: ['admin', 'skills'] as const,
  socialLinks: ['admin', 'social-links'] as const,
  messages: (status: string, page: number) => ['admin', 'messages', status, page] as const,
  settings: ['admin', 'settings'] as const,
};

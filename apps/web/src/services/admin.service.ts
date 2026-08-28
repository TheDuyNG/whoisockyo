import type {
  ContactMessage,
  ContactMessageQuery,
  DashboardMetrics,
  Experience,
  ExperienceInput,
  PaginatedResult,
  Profile,
  ProfileInput,
  Project,
  ProjectInput,
  ProjectUpdate,
  SiteSettings,
  SiteSettingsInput,
  Skill,
  SkillInput,
  SocialLink,
  SocialLinkInput,
} from '@whoisockyo/shared';

import { apiRequest, jsonBody } from '@/lib/api-client';

export const adminService = {
  getDashboardMetrics() {
    return apiRequest<DashboardMetrics>('/dashboard');
  },

  getProfile() {
    return apiRequest<Profile>('/admin/profile');
  },

  updateProfile(input: ProfileInput) {
    return apiRequest<Profile>('/admin/profile', { method: 'PUT', body: jsonBody(input) });
  },

  getProjects() {
    return apiRequest<Project[]>('/admin/projects');
  },

  createProject(input: ProjectInput) {
    return apiRequest<Project>('/admin/projects', { method: 'POST', body: jsonBody(input) });
  },

  updateProject(id: string, input: ProjectUpdate) {
    return apiRequest<Project>(`/admin/projects/${id}`, { method: 'PATCH', body: jsonBody(input) });
  },

  deleteProject(id: string) {
    return apiRequest<void>(`/admin/projects/${id}`, { method: 'DELETE' });
  },

  getExperience() {
    return apiRequest<Experience[]>('/admin/experience');
  },

  createExperience(input: ExperienceInput) {
    return apiRequest<Experience>('/admin/experience', { method: 'POST', body: jsonBody(input) });
  },

  updateExperience(id: string, input: ExperienceInput) {
    return apiRequest<Experience>(`/admin/experience/${id}`, {
      method: 'PUT',
      body: jsonBody(input),
    });
  },

  deleteExperience(id: string) {
    return apiRequest<void>(`/admin/experience/${id}`, { method: 'DELETE' });
  },

  getSkills() {
    return apiRequest<Skill[]>('/admin/skills');
  },

  createSkill(input: SkillInput) {
    return apiRequest<Skill>('/admin/skills', { method: 'POST', body: jsonBody(input) });
  },

  updateSkill(id: string, input: SkillInput) {
    return apiRequest<Skill>(`/admin/skills/${id}`, { method: 'PUT', body: jsonBody(input) });
  },

  deleteSkill(id: string) {
    return apiRequest<void>(`/admin/skills/${id}`, { method: 'DELETE' });
  },

  getSocialLinks() {
    return apiRequest<SocialLink[]>('/admin/social-links');
  },

  createSocialLink(input: SocialLinkInput) {
    return apiRequest<SocialLink>('/admin/social-links', { method: 'POST', body: jsonBody(input) });
  },

  updateSocialLink(id: string, input: SocialLinkInput) {
    return apiRequest<SocialLink>(`/admin/social-links/${id}`, {
      method: 'PUT',
      body: jsonBody(input),
    });
  },

  deleteSocialLink(id: string) {
    return apiRequest<void>(`/admin/social-links/${id}`, { method: 'DELETE' });
  },

  getMessages(query: ContactMessageQuery) {
    const searchParams = new URLSearchParams({
      page: String(query.page),
      pageSize: String(query.pageSize),
      status: query.status,
    });
    return apiRequest<PaginatedResult<ContactMessage>>(
      `/admin/messages?${searchParams.toString()}`,
    );
  },

  updateMessageStatus(id: string, isRead: boolean) {
    return apiRequest<ContactMessage>(`/admin/messages/${id}/status`, {
      method: 'PATCH',
      body: jsonBody({ isRead }),
    });
  },

  deleteMessage(id: string) {
    return apiRequest<void>(`/admin/messages/${id}`, { method: 'DELETE' });
  },

  getSettings() {
    return apiRequest<SiteSettings>('/admin/settings');
  },

  updateSettings(input: SiteSettingsInput) {
    return apiRequest<SiteSettings>('/admin/settings', { method: 'PUT', body: jsonBody(input) });
  },
};

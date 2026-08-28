import type { Experience } from './experience.js';
import type { Profile } from './profile.js';
import type { Project } from './project.js';
import type { SiteSettings } from './settings.js';
import type { Skill } from './skill.js';
import type { SocialLink } from './social-link.js';

export interface Portfolio {
  profile: Profile | null;
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  socialLinks: SocialLink[];
  settings: SiteSettings | null;
}

export interface DashboardMetrics {
  totalProjects: number;
  featuredProjects: number;
  publishedProjects: number;
  totalSkills: number;
  experienceEntries: number;
  unreadMessages: number;
}

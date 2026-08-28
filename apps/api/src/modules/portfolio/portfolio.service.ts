import { experienceService } from '../experience/experience.service.js';
import { profileService } from '../profile/profile.service.js';
import { projectService } from '../projects/project.service.js';
import { settingsService } from '../settings/settings.service.js';
import { skillService } from '../skills/skill.service.js';
import { socialLinkService } from '../social-links/social-link.service.js';

export const portfolioService = {
  async getPortfolio() {
    const [profile, projects, experience, skills, socialLinks, settings] = await Promise.all([
      profileService.find(),
      projectService.listPublished(),
      experienceService.list(),
      skillService.list(),
      socialLinkService.listVisible(),
      settingsService.find(),
    ]);

    return { profile, projects, experience, skills, socialLinks, settings };
  },
};

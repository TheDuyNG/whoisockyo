import type { SocialLinkInput } from '@whoisockyo/shared';

import { AppError } from '../../utils/app-error.js';
import { socialLinkRepository } from './social-link.repository.js';

async function requireSocialLink(id: string) {
  const socialLink = await socialLinkRepository.findById(id);

  if (!socialLink) {
    throw new AppError(404, 'SOCIAL_LINK_NOT_FOUND', 'The requested social link was not found.');
  }

  return socialLink;
}

export const socialLinkService = {
  listVisible() {
    return socialLinkRepository.findVisible();
  },

  listAll() {
    return socialLinkRepository.findAll();
  },

  create(input: SocialLinkInput) {
    return socialLinkRepository.create(input);
  },

  async update(id: string, input: SocialLinkInput) {
    await requireSocialLink(id);
    return socialLinkRepository.update(id, input);
  },

  async delete(id: string) {
    await requireSocialLink(id);
    return socialLinkRepository.delete(id);
  },
};

import type { ProfileInput } from '@whoisockyo/shared';

import { ERROR_CODES } from '../../config/constants.js';
import { AppError } from '../../utils/app-error.js';
import { profileRepository } from './profile.repository.js';

export const profileService = {
  find() {
    return profileRepository.find();
  },

  async getRequired() {
    const profile = await profileRepository.find();

    if (!profile) {
      throw new AppError(
        404,
        ERROR_CODES.notFound,
        'The portfolio profile has not been configured.',
      );
    }

    return profile;
  },

  update(input: ProfileInput) {
    return profileRepository.upsert(input);
  },
};

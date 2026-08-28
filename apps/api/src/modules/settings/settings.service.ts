import type { SiteSettingsInput } from '@whoisockyo/shared';

import { ERROR_CODES } from '../../config/constants.js';
import { AppError } from '../../utils/app-error.js';
import { settingsRepository } from './settings.repository.js';

export const settingsService = {
  find() {
    return settingsRepository.find();
  },

  async getRequired() {
    const settings = await settingsRepository.find();

    if (!settings) {
      throw new AppError(404, ERROR_CODES.notFound, 'Site settings have not been configured.');
    }

    return settings;
  },

  update(input: SiteSettingsInput) {
    return settingsRepository.upsert(input);
  },
};

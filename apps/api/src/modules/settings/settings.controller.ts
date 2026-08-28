import type { Request, Response } from 'express';
import type { SiteSettingsInput } from '@whoisockyo/shared';

import { sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { settingsService } from './settings.service.js';

export const settingsController = {
  async get(_request: Request, response: Response): Promise<void> {
    const settings = await settingsService.getRequired();
    sendSuccess(response, 200, settings, 'Site settings retrieved successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const settings = await settingsService.update(getValidatedBody<SiteSettingsInput>(request));
    sendSuccess(response, 200, settings, 'Site settings updated successfully.');
  },
};

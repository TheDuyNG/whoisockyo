import type { Request, Response } from 'express';
import type { ProfileInput } from '@whoisockyo/shared';

import { sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { profileService } from './profile.service.js';

export const profileController = {
  async get(_request: Request, response: Response): Promise<void> {
    const profile = await profileService.getRequired();
    sendSuccess(response, 200, profile, 'Profile retrieved successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const profile = await profileService.update(getValidatedBody<ProfileInput>(request));
    sendSuccess(response, 200, profile, 'Profile updated successfully.');
  },
};

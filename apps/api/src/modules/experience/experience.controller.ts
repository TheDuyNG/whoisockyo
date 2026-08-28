import type { Request, Response } from 'express';
import type { ExperienceInput } from '@whoisockyo/shared';

import { sendNoContent, sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { experienceService } from './experience.service.js';

export const experienceController = {
  async list(_request: Request, response: Response): Promise<void> {
    const experience = await experienceService.list();
    sendSuccess(response, 200, experience, 'Experience retrieved successfully.');
  },

  async create(request: Request, response: Response): Promise<void> {
    const experience = await experienceService.create(getValidatedBody<ExperienceInput>(request));
    sendSuccess(response, 201, experience, 'Experience entry created successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const experience = await experienceService.update(
      request.params.id!,
      getValidatedBody<ExperienceInput>(request),
    );
    sendSuccess(response, 200, experience, 'Experience entry updated successfully.');
  },

  async delete(request: Request, response: Response): Promise<void> {
    await experienceService.delete(request.params.id!);
    sendNoContent(response);
  },
};

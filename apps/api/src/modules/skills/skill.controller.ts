import type { Request, Response } from 'express';
import type { SkillInput } from '@whoisockyo/shared';

import { sendNoContent, sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { skillService } from './skill.service.js';

export const skillController = {
  async list(_request: Request, response: Response): Promise<void> {
    const skills = await skillService.list();
    sendSuccess(response, 200, skills, 'Skills retrieved successfully.');
  },

  async create(request: Request, response: Response): Promise<void> {
    const skill = await skillService.create(getValidatedBody<SkillInput>(request));
    sendSuccess(response, 201, skill, 'Skill created successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const skill = await skillService.update(
      request.params.id!,
      getValidatedBody<SkillInput>(request),
    );
    sendSuccess(response, 200, skill, 'Skill updated successfully.');
  },

  async delete(request: Request, response: Response): Promise<void> {
    await skillService.delete(request.params.id!);
    sendNoContent(response);
  },
};

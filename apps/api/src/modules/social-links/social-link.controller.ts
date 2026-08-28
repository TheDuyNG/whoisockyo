import type { Request, Response } from 'express';
import type { SocialLinkInput } from '@whoisockyo/shared';

import { sendNoContent, sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { socialLinkService } from './social-link.service.js';

export const socialLinkController = {
  async listVisible(_request: Request, response: Response): Promise<void> {
    const links = await socialLinkService.listVisible();
    sendSuccess(response, 200, links, 'Social links retrieved successfully.');
  },

  async listAll(_request: Request, response: Response): Promise<void> {
    const links = await socialLinkService.listAll();
    sendSuccess(response, 200, links, 'Social links retrieved successfully.');
  },

  async create(request: Request, response: Response): Promise<void> {
    const link = await socialLinkService.create(getValidatedBody<SocialLinkInput>(request));
    sendSuccess(response, 201, link, 'Social link created successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const link = await socialLinkService.update(
      request.params.id!,
      getValidatedBody<SocialLinkInput>(request),
    );
    sendSuccess(response, 200, link, 'Social link updated successfully.');
  },

  async delete(request: Request, response: Response): Promise<void> {
    await socialLinkService.delete(request.params.id!);
    sendNoContent(response);
  },
};

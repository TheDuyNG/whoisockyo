import type { Request, Response } from 'express';
import type { ContactMessageInput, ContactMessageQuery } from '@whoisockyo/shared';

import { sendNoContent, sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { contactMessageService } from './contact-message.service.js';

export const contactMessageController = {
  async create(request: Request, response: Response): Promise<void> {
    const message = await contactMessageService.create(
      getValidatedBody<ContactMessageInput>(request),
    );
    sendSuccess(response, 201, { id: message.id }, 'Your message was sent successfully.');
  },

  async list(request: Request, response: Response): Promise<void> {
    const messages = await contactMessageService.list(
      request.query as unknown as ContactMessageQuery,
    );
    sendSuccess(response, 200, messages, 'Contact messages retrieved successfully.');
  },

  async updateStatus(request: Request, response: Response): Promise<void> {
    const { isRead } = getValidatedBody<{ isRead: boolean }>(request);
    const message = await contactMessageService.updateStatus(request.params.id!, isRead);
    sendSuccess(response, 200, message, 'Message status updated successfully.');
  },

  async delete(request: Request, response: Response): Promise<void> {
    await contactMessageService.delete(request.params.id!);
    sendNoContent(response);
  },
};

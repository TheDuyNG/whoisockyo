import type { ContactMessageInput, ContactMessageQuery } from '@whoisockyo/shared';

import { ERROR_CODES } from '../../config/constants.js';
import { AppError } from '../../utils/app-error.js';
import { settingsService } from '../settings/settings.service.js';
import { contactMessageRepository } from './contact-message.repository.js';

async function requireMessage(id: string) {
  const message = await contactMessageRepository.findById(id);

  if (!message) {
    throw new AppError(404, 'CONTACT_MESSAGE_NOT_FOUND', 'The requested message was not found.');
  }

  return message;
}

export const contactMessageService = {
  async create(input: ContactMessageInput) {
    const settings = await settingsService.find();

    if (settings && !settings.isContactFormEnabled) {
      throw new AppError(
        403,
        ERROR_CODES.contactDisabled,
        'The contact form is not accepting messages right now.',
      );
    }

    return contactMessageRepository.create(input);
  },

  async list(query: ContactMessageQuery) {
    const { items, totalItems } = await contactMessageRepository.findMany(query);

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / query.pageSize),
      },
    };
  },

  async updateStatus(id: string, isRead: boolean) {
    await requireMessage(id);
    return contactMessageRepository.updateStatus(id, isRead);
  },

  async delete(id: string) {
    await requireMessage(id);
    return contactMessageRepository.delete(id);
  },
};

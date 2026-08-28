import {
  contactMessageInputSchema,
  contactMessageQuerySchema,
  contactMessageStatusSchema,
  idParamSchema,
} from '@whoisockyo/shared';
import { Router } from 'express';

import { contactRateLimit } from '../../middlewares/rate-limit.js';
import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { contactMessageController } from './contact-message.controller.js';

export const publicContactRouter = Router();
export const adminContactMessageRouter = Router();

publicContactRouter.post(
  '/',
  contactRateLimit,
  validateRequest({ body: contactMessageInputSchema }),
  asyncHandler(contactMessageController.create),
);

adminContactMessageRouter.get(
  '/',
  validateRequest({ query: contactMessageQuerySchema }),
  asyncHandler(contactMessageController.list),
);
adminContactMessageRouter.patch(
  '/:id/status',
  validateRequest({ params: idParamSchema, body: contactMessageStatusSchema }),
  asyncHandler(contactMessageController.updateStatus),
);
adminContactMessageRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(contactMessageController.delete),
);

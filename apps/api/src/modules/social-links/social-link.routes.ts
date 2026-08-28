import { idParamSchema, socialLinkInputSchema } from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { socialLinkController } from './social-link.controller.js';

export const publicSocialLinkRouter = Router();
export const adminSocialLinkRouter = Router();

publicSocialLinkRouter.get('/', asyncHandler(socialLinkController.listVisible));
adminSocialLinkRouter.get('/', asyncHandler(socialLinkController.listAll));
adminSocialLinkRouter.post(
  '/',
  validateRequest({ body: socialLinkInputSchema }),
  asyncHandler(socialLinkController.create),
);
adminSocialLinkRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: socialLinkInputSchema }),
  asyncHandler(socialLinkController.update),
);
adminSocialLinkRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(socialLinkController.delete),
);

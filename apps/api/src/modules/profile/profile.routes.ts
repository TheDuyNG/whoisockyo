import { profileInputSchema } from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { profileController } from './profile.controller.js';

export const publicProfileRouter = Router();
export const adminProfileRouter = Router();

publicProfileRouter.get('/', asyncHandler(profileController.get));
adminProfileRouter.get('/', asyncHandler(profileController.get));
adminProfileRouter.put(
  '/',
  validateRequest({ body: profileInputSchema }),
  asyncHandler(profileController.update),
);

import { siteSettingsInputSchema } from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { settingsController } from './settings.controller.js';

export const publicSettingsRouter = Router();
export const adminSettingsRouter = Router();

publicSettingsRouter.get('/', asyncHandler(settingsController.get));
adminSettingsRouter.get('/', asyncHandler(settingsController.get));
adminSettingsRouter.put(
  '/',
  validateRequest({ body: siteSettingsInputSchema }),
  asyncHandler(settingsController.update),
);

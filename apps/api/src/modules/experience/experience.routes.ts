import { experienceInputSchema, idParamSchema } from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { experienceController } from './experience.controller.js';

export const publicExperienceRouter = Router();
export const adminExperienceRouter = Router();

publicExperienceRouter.get('/', asyncHandler(experienceController.list));
adminExperienceRouter.get('/', asyncHandler(experienceController.list));
adminExperienceRouter.post(
  '/',
  validateRequest({ body: experienceInputSchema }),
  asyncHandler(experienceController.create),
);
adminExperienceRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: experienceInputSchema }),
  asyncHandler(experienceController.update),
);
adminExperienceRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(experienceController.delete),
);

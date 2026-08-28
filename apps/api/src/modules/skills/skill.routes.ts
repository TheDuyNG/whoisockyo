import { idParamSchema, skillInputSchema } from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { skillController } from './skill.controller.js';

export const publicSkillRouter = Router();
export const adminSkillRouter = Router();

publicSkillRouter.get('/', asyncHandler(skillController.list));
adminSkillRouter.get('/', asyncHandler(skillController.list));
adminSkillRouter.post(
  '/',
  validateRequest({ body: skillInputSchema }),
  asyncHandler(skillController.create),
);
adminSkillRouter.put(
  '/:id',
  validateRequest({ params: idParamSchema, body: skillInputSchema }),
  asyncHandler(skillController.update),
);
adminSkillRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(skillController.delete),
);

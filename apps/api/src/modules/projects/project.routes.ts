import {
  idParamSchema,
  projectInputSchema,
  projectUpdateSchema,
  slugParamSchema,
} from '@whoisockyo/shared';
import { Router } from 'express';

import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { projectController } from './project.controller.js';

export const publicProjectRouter = Router();
export const adminProjectRouter = Router();

publicProjectRouter.get('/', asyncHandler(projectController.listPublished));
publicProjectRouter.get(
  '/:slug',
  validateRequest({ params: slugParamSchema }),
  asyncHandler(projectController.getPublished),
);

adminProjectRouter.get('/', asyncHandler(projectController.listAll));
adminProjectRouter.post(
  '/',
  validateRequest({ body: projectInputSchema }),
  asyncHandler(projectController.create),
);
adminProjectRouter.patch(
  '/:id',
  validateRequest({ params: idParamSchema, body: projectUpdateSchema }),
  asyncHandler(projectController.update),
);
adminProjectRouter.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(projectController.delete),
);

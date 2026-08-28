import { Router } from 'express';
import { changePasswordInputSchema, loginInputSchema } from '@whoisockyo/shared';

import { authenticate } from '../../middlewares/authenticate.js';
import { loginRateLimit } from '../../middlewares/rate-limit.js';
import { validateRequest } from '../../middlewares/validate-request.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { authController } from './auth.controller.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  loginRateLimit,
  validateRequest({ body: loginInputSchema }),
  asyncHandler(authController.login),
);
authRouter.post('/refresh', asyncHandler(authController.refresh));
authRouter.post('/logout', asyncHandler(authController.logout));
authRouter.get('/session', authenticate, asyncHandler(authController.session));
authRouter.post(
  '/change-password',
  authenticate,
  validateRequest({ body: changePasswordInputSchema }),
  asyncHandler(authController.changePassword),
);

import { Router } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { portfolioController } from './portfolio.controller.js';

export const portfolioRouter = Router();

portfolioRouter.get('/', asyncHandler(portfolioController.get));

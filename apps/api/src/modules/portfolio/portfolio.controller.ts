import type { Request, Response } from 'express';

import { sendSuccess } from '../../utils/api-response.js';
import { portfolioService } from './portfolio.service.js';

export const portfolioController = {
  async get(_request: Request, response: Response): Promise<void> {
    const portfolio = await portfolioService.getPortfolio();
    sendSuccess(response, 200, portfolio, 'Portfolio retrieved successfully.');
  },
};

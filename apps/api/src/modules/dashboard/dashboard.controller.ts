import type { Request, Response } from 'express';

import { sendSuccess } from '../../utils/api-response.js';
import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  async getMetrics(_request: Request, response: Response): Promise<void> {
    const metrics = await dashboardService.getMetrics();
    sendSuccess(response, 200, metrics, 'Dashboard metrics retrieved successfully.');
  },
};

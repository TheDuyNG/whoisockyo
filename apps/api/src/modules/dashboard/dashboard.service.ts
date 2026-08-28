import { dashboardRepository } from './dashboard.repository.js';

export const dashboardService = {
  getMetrics() {
    return dashboardRepository.getMetrics();
  },
};

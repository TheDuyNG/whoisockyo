import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { env, isProduction } from './config/env.js';
import { logger } from './lib/logger.js';
import { authenticate } from './middlewares/authenticate.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundHandler } from './middlewares/not-found.js';
import { apiRateLimit } from './middlewares/rate-limit.js';
import { authRouter } from './modules/auth/auth.routes.js';
import {
  adminContactMessageRouter,
  publicContactRouter,
} from './modules/contact-messages/contact-message.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import {
  adminExperienceRouter,
  publicExperienceRouter,
} from './modules/experience/experience.routes.js';
import { portfolioRouter } from './modules/portfolio/portfolio.routes.js';
import { adminProfileRouter, publicProfileRouter } from './modules/profile/profile.routes.js';
import { adminProjectRouter, publicProjectRouter } from './modules/projects/project.routes.js';
import { adminSettingsRouter, publicSettingsRouter } from './modules/settings/settings.routes.js';
import { adminSkillRouter, publicSkillRouter } from './modules/skills/skill.routes.js';
import {
  adminSocialLinkRouter,
  publicSocialLinkRouter,
} from './modules/social-links/social-link.routes.js';
import { AppError } from './utils/app-error.js';

export const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (request) => request.url === '/api/health',
    },
  }),
);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === env.FRONTEND_URL) {
        callback(null, true);
        return;
      }

      callback(new AppError(403, 'ORIGIN_NOT_ALLOWED', 'The request origin is not allowed.'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use('/api', apiRateLimit);

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    data: { status: 'ok' },
    message: 'API is healthy.',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/profile', publicProfileRouter);
app.use('/api/projects', publicProjectRouter);
app.use('/api/experience', publicExperienceRouter);
app.use('/api/skills', publicSkillRouter);
app.use('/api/social-links', publicSocialLinkRouter);
app.use('/api/settings', publicSettingsRouter);
app.use('/api/contact', publicContactRouter);

const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use('/profile', adminProfileRouter);
adminRouter.use('/projects', adminProjectRouter);
adminRouter.use('/experience', adminExperienceRouter);
adminRouter.use('/skills', adminSkillRouter);
adminRouter.use('/social-links', adminSocialLinkRouter);
adminRouter.use('/messages', adminContactMessageRouter);
adminRouter.use('/settings', adminSettingsRouter);

app.use('/api/admin', adminRouter);
app.use('/api/dashboard', authenticate, dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

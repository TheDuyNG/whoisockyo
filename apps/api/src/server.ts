import { createServer } from 'node:http';

import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { logger } from './lib/logger.js';

const server = createServer(app);

server.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, 'API server started');
});

function shutDown(signal: string): void {
  logger.info({ signal }, 'API server shutting down');

  server.close(async (serverError) => {
    if (serverError) {
      logger.error({ error: serverError }, 'Failed to close HTTP server cleanly');
      process.exitCode = 1;
    }

    await prisma.$disconnect();
    process.exit();
  });
}

process.on('SIGINT', () => {
  shutDown('SIGINT');
});

process.on('SIGTERM', () => {
  shutDown('SIGTERM');
});

process.on('unhandledRejection', (error: unknown) => {
  logger.error({ error }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (error: unknown) => {
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);
});

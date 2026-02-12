import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './config/logger';

const PORT = env.PORT;

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Stilora API running on http://localhost:${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/v1/health`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

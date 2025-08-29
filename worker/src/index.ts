import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import cron from 'node-cron';
import winston from 'winston';

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Redis
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Initialize Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Connect to Redis
async function connectRedis() {
  try {
    await redis.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

// Health check function
async function healthCheck() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    logger.info('Health check passed');
  } catch (error) {
    logger.error('Health check failed:', error);
  }
}

// Cleanup old audit logs (retention policy)
async function cleanupOldAuditLogs() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
        // Don't delete logs with legal hold
        // This would be implemented based on your legal hold logic
      },
    });

    logger.info(`Cleaned up ${result.count} old audit logs`);
  } catch (error) {
    logger.error('Failed to cleanup old audit logs:', error);
  }
}

// Process notification queue
async function processNotifications() {
  try {
    // TODO: Implement notification processing
    // This would process queued notifications for Slack/Teams/Email
    logger.info('Processing notifications queue');
  } catch (error) {
    logger.error('Failed to process notifications:', error);
  }
}

// Main function
async function main() {
  try {
    // Connect to services
    await connectRedis();
    
    logger.info('Worker service started');

    // Schedule cron jobs
    cron.schedule('*/5 * * * *', healthCheck); // Every 5 minutes
    cron.schedule('0 2 * * *', cleanupOldAuditLogs); // Daily at 2 AM
    cron.schedule('*/15 * * * *', processNotifications); // Every 15 minutes

    // Initial health check
    await healthCheck();

    // Keep the process running
    process.on('SIGINT', async () => {
      logger.info('Shutting down worker service...');
      await prisma.$disconnect();
      await redis.quit();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down worker service...');
      await prisma.$disconnect();
      await redis.quit();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start worker service:', error);
    process.exit(1);
  }
}

// Start the service
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});

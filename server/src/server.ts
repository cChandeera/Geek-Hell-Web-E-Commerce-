import app from './app';
import { ENV } from './config/env.config';
import { connectDatabase } from './config/db.config';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDatabase();
  app.listen(ENV.PORT, () => {
    logger.info(`⚡️ Geek Hell Backend API server running on http://localhost:${ENV.PORT} [${ENV.NODE_ENV}]`);
  });
};

startServer();

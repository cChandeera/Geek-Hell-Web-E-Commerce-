import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.config';
import { connectDatabase } from './config/db.config';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import router from './routes/index';
import { logger } from './utils/logger';

const app = express();

// Security & Core Middlewares
app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimiter);

// API Router Gateway
app.use('/api/v1', router);

// Global Error Handler
app.use(errorHandler);

// Bootstrap Function
const startServer = async () => {
  await connectDatabase();
  app.listen(ENV.PORT, () => {
    logger.info(`⚡️ Server running on http://localhost:${ENV.PORT} [${ENV.NODE_ENV}]`);
  });
};

startServer();

export default app;

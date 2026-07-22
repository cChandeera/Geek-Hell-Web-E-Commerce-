import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.config';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import router from './routes/index';

const app = express();

// Security & Core Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimiter);

// API Router Gateway
app.use('/api/v1', router);

// Global Error Handler
app.use(errorHandler);

export default app;

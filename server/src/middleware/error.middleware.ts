import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error | ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[Error Middleware]: ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err instanceof ApiError ? err.errors : [],
    meta: { timestamp: new Date().toISOString() },
  });
};

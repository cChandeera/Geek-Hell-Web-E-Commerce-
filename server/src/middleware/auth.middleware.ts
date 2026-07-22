import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const authenticateJWT = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized: Access token missing'));
  }
  // JWT verification skeleton - ready for Phase 03
  next();
};

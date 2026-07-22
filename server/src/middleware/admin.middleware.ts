import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const adminOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Forbidden. Access restricted to administrator accounts.'));
  }
  next();
};

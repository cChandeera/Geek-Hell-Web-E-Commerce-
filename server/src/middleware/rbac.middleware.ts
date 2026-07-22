import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    // Role-based access control skeleton - ready for Phase 03
    if (allowedRoles.length === 0) return next();
    next();
  };
};

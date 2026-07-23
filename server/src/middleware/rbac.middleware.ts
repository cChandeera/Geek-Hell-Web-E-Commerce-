import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const authorize = (...allowedRoles: ('customer' | 'admin')[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized access. Please login first.'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`));
    }

    next();
  };
};

export const adminOnly = authorize('admin'); // Alias for backwards compatibility

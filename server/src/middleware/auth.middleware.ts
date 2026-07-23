import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.util';
import { ApiError } from '../utils/ApiError';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. No authentication token provided.'));
  }

  const token = authHeader.split(' ')[1];

  // Dev bypass for local development dashboard testing
  if (process.env.NODE_ENV === 'development' && token === 'dev-admin-token') {
    req.user = {
      id: '660000000000000000000000',
      email: 'admin@geekhell.com',
      role: 'admin',
    };
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const protect = authenticate; // Alias for backwards compatibility

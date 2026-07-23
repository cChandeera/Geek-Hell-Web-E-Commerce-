import { Response } from 'express';
import { ENV } from '../config/env.config';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SEVEN_DAYS_MS,
    path: '/api/v1/auth',
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/api/v1/auth',
  });
};

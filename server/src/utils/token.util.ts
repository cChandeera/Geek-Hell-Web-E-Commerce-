import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env.config';
import { AuthUserPayload } from '../types/express';
import { ApiError } from './ApiError';

export const generateAccessToken = (payload: AuthUserPayload): string => {
  return jwt.sign(
    payload,
    ENV.JWT_ACCESS_SECRET || 'geek_hell_jwt_access_secret_7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (payload: AuthUserPayload): string => {
  return jwt.sign(
    payload,
    ENV.JWT_REFRESH_SECRET || 'geek_hell_jwt_refresh_secret_1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a',
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): AuthUserPayload => {
  try {
    return jwt.verify(
      token,
      ENV.JWT_ACCESS_SECRET || 'geek_hell_jwt_access_secret_7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e'
    ) as AuthUserPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Access token has expired');
    }
    throw new ApiError(401, 'Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): AuthUserPayload => {
  try {
    return jwt.verify(
      token,
      ENV.JWT_REFRESH_SECRET || 'geek_hell_jwt_refresh_secret_1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a'
    ) as AuthUserPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Refresh token has expired');
    }
    throw new ApiError(401, 'Invalid refresh token');
  }
};

export const hashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export const generateRandomToken = (): { rawToken: string; hashedToken: string } => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';
import { AuthService } from '../services/auth.service';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookie.util';
import { ApiError } from '../utils/ApiError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = registerSchema.parse(req.body);
  const result = await AuthService.register(validatedInput);

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      'User registered successfully'
    )
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = loginSchema.parse(req.body);
  const result = await AuthService.login(validatedInput);

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      'User logged in successfully'
    )
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const incomingCookieToken = req.cookies?.refreshToken;
  const userId = req.user?.id;

  if (userId) {
    await AuthService.logout(userId, incomingCookieToken);
  }

  clearRefreshTokenCookie(res);

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const parsed = refreshTokenSchema.parse(req.body);
  const incomingToken = req.cookies?.refreshToken || parsed.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const result = await AuthService.refreshToken(incomingToken);

  setRefreshTokenCookie(res, result.tokens.refreshToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
      'Tokens refreshed successfully'
    )
  );
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const validatedInput = changePasswordSchema.parse(req.body);
  const user = await AuthService.changePassword(userId, validatedInput);

  clearRefreshTokenCookie(res);

  res.status(200).json(new ApiResponse(200, user, 'Password changed successfully. Please login again.'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = forgotPasswordSchema.parse(req.body);
  const result = await AuthService.forgotPassword(validatedInput);

  res.status(200).json(new ApiResponse(200, result, 'Password reset instructions generated'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = resetPasswordSchema.parse(req.body);
  const result = await AuthService.resetPassword(validatedInput);

  clearRefreshTokenCookie(res);

  res.status(200).json(new ApiResponse(200, result, 'Password reset successfully'));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = verifyEmailSchema.parse(req.body);
  const result = await AuthService.verifyEmail(validatedInput);

  res.status(200).json(new ApiResponse(200, result, 'Email verified successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await AuthService.getCurrentUser(userId);

  res.status(200).json(new ApiResponse(200, user, 'Authenticated user profile fetched'));
});
